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
    const fileBuffers: { fieldname: string; filename: string; buffer: Buffer }[] = []

    const busboy = Busboy({ headers: event.node.req.headers })

    const fileUploadPromise = new Promise<void>((resolveUpload, rejectUpload) => {
        busboy.on('file', (fieldname: string, file: any, info: any) => {
            const { filename } = info
            if (!filename) {
                file.resume()
                return
            }

            const chunks: Buffer[] = []
            file.on('data', (chunk: any) => chunks.push(chunk))
            file.on('end', () => {
                fileBuffers.push({ fieldname, filename, buffer: Buffer.concat(chunks) })
            })
            file.on('error', rejectUpload)
        })

        busboy.on('field', (fieldname: any, val: any) => {
            try {
                const parsed = JSON.parse(val)
                fields[fieldname] = parsed
            } catch {
                fields[fieldname] = autoCast(val)
            }
        })

        busboy.on('finish', () => resolveUpload())
        event.node.req.pipe(busboy)
    })

    await fileUploadPromise

    const groupedPaths: Record<string, string[]> = {}

    for (const { fieldname, filename, buffer } of fileBuffers) {
        const ext = filename.split('.').pop()?.toLowerCase() || 'bin'
        const nameWithoutExt = filename.split('.').slice(0, -1).join('.') || 'file'
        const timestamp = Date.now()
        const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext)
        const isVideo = ['mp4', 'webm', 'ogg'].includes(ext)

        if (!isImage && !isVideo) continue

        let finalFilename = `${nameWithoutExt}-${timestamp}`
        let saveTo: string

        if (isImage) {
            finalFilename += '.webp'
            saveTo = join(uploadDir, finalFilename)
            await sharp(buffer).webp({ quality: 80 }).toFile(saveTo)
        } else {
            finalFilename += `.${ext}`
            saveTo = join(uploadDir, finalFilename)
            await writeFile(saveTo, buffer)
        }

        const webPath = `/storage/${model}/${finalFilename}`

        if (!groupedPaths[fieldname]) groupedPaths[fieldname] = []
        groupedPaths[fieldname].push(webPath)
    }

    const dataPath = resolve('assets/staticData', `${model}.json`)
    let data: any[] = []

    try {
        const content = await readFile(dataPath, 'utf-8')
        data = JSON.parse(content)
    } catch (err: any) {
        if (err.code !== 'ENOENT') throw err
    }

    const newItem: Record<string, any> = {
        id: Date.now(),
        ...fields,
    }

    for (const [field, paths] of Object.entries(groupedPaths)) {
        const key = field.replace(/\[\]$/, '')
        newItem[key] = paths.length === 1 ? paths[0] : paths
    }

    data.push(newItem)
    await writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')

    return { success: true }
})
