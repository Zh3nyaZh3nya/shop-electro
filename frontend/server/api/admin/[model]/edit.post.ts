import { mkdir, readFile, writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { defineEventHandler } from 'h3'
// @ts-ignore
import Busboy from 'busboy'
import sharp from 'sharp'
import { requireAdmin } from '~/utils/auth'
import { autoCast } from '~/server/utils/autoCast'

export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const { model } = event.context.params as { model: string }
    const uploadDir = resolve('public/storage', model)
    await mkdir(uploadDir, { recursive: true })

    const fields: Record<string, string> = {}
    const files: { fieldname: string; filename: string; buffer: Buffer }[] = []

    const busboy = Busboy({ headers: event.node.req.headers })

    const fileUploadPromise = new Promise<void>((resolveUpload, rejectUpload) => {
        busboy.on('file', (fieldname, file, info) => {
            const { filename } = info
            if (!filename) {
                file.resume()
                return
            }

            const chunks: Buffer[] = []
            file.on('data', chunk => chunks.push(chunk))
            file.on('end', () => {
                files.push({ fieldname, filename, buffer: Buffer.concat(chunks) })
            })
            file.on('error', rejectUpload)
        })

        busboy.on('field', (fieldname, val) => {
            try {
                fields[fieldname] = JSON.parse(val)
            } catch {
                fields[fieldname] = autoCast(val)
            }
        })

        busboy.on('finish', () => resolveUpload())
        event.node.req.pipe(busboy)
    })

    await fileUploadPromise

    const fileGroups: Record<string, string[]> = {}

    for (const { fieldname, filename, buffer } of files) {
        const ext = filename.split('.').pop()?.toLowerCase() || 'bin'
        const nameWithoutExt = filename.split('.').slice(0, -1).join('.') || 'file'
        const timestamp = Date.now()

        let finalFilename = `${nameWithoutExt}-${timestamp}`
        const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext)
        const isVideo = ['mp4', 'webm', 'ogg'].includes(ext)

        if (!isImage && !isVideo) continue

        if (isImage) {
            finalFilename += '.webp'
            const saveTo = join(uploadDir, finalFilename)
            await sharp(buffer).webp({ quality: 80 }).toFile(saveTo)
        } else {
            finalFilename += `.${ext}`
            const saveTo = join(uploadDir, finalFilename)
            await writeFile(saveTo, buffer)
        }

        const filePath = `/storage/${model}/${finalFilename}`
        const baseField = fieldname.replace(/\[\]$/, '')

        if (!fileGroups[baseField]) fileGroups[baseField] = []
        fileGroups[baseField].push(filePath)
    }

    const dataPath = resolve('assets/staticData', `${model}.json`)
    let data: any[] = []

    try {
        const content = await readFile(dataPath, 'utf-8')
        data = JSON.parse(content)
    } catch {}

    const id = Number(fields.id)
    const index = data.findIndex((item) => Number(item.id) === id)

    if (index !== -1) {
        const original = data[index]

        const updated = {
            ...original,
            ...fields,
        }

        if ('video' in fileGroups && 'image' in updated) {
            updated.image = null
        }

        if ('image' in fileGroups && 'video' in updated) {
            updated.video = null
        }

        for (const [key, paths] of Object.entries(fileGroups)) {
            updated[key] = paths.length === 1 ? paths[0] : paths
        }

        data[index] = updated
    }

    await writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')

    return { success: true }
})
