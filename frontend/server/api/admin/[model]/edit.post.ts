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
    const files: { filename: string; buffer: Buffer }[] = []

    const busboy = Busboy({ headers: event.node.req.headers })

    const fileUploadPromise = new Promise<void>((resolveUpload, rejectUpload) => {
        busboy.on('file', (fieldname, file, info) => {
            const { filename } = info
            if (!filename) {
                file.resume()
                return
            }

            const chunks: Buffer[] = []
            file.on('data', (chunk) => chunks.push(chunk))
            file.on('end', () => {
                files.push({ filename, buffer: Buffer.concat(chunks) })
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

    const savedPaths: { image?: string; video?: string }[] = []

    for (const { filename, buffer } of files) {
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
            savedPaths.push({ image: `/storage/${model}/${finalFilename}` })
        } else if (isVideo) {
            finalFilename += `.${ext}`
            const saveTo = join(uploadDir, finalFilename)
            await writeFile(saveTo, buffer)
            savedPaths.push({ video: `/storage/${model}/${finalFilename}` })
        }
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
        const updated = {
            ...data[index],
            ...fields
        }

        if (savedPaths.length === 1) {
            const { image, video } = savedPaths[0]
            if (image) {
                updated.image = image
                updated.video = ''
            } else if (video) {
                updated.video = video
                updated.image = ''
            }
        } else if (savedPaths.length > 1) {
            updated.images = savedPaths.filter(p => p.image).map(p => p.image!)
            updated.videos = savedPaths.filter(p => p.video).map(p => p.video!)
        }

        data[index] = updated
    }

    await writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')

    return { success: true }
})
