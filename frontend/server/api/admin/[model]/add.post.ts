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
    const UPLOADS_DIR = process.env.NUXT_UPLOADS_DIR
        ? resolve(process.cwd(), process.env.NUXT_UPLOADS_DIR)
        : resolve(process.cwd(), 'uploads')

    const uploadDir = join(UPLOADS_DIR, model)
    await mkdir(uploadDir, { recursive: true })

    const fields: Record<string, any> = {}
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

        busboy.on('field', (fieldname: string, val: string) => {
            if (fieldname === 'multipleFields') {
                try {
                    const parsed = JSON.parse(val || '[]')
                    fields.multipleFields = Array.isArray(parsed) ? parsed : []
                } catch (err) {
                    console.warn('Ошибка при парсинге multipleFields:', err)
                    fields.multipleFields = []
                }
            } else {
                try {
                    fields[fieldname] = JSON.parse(val)
                } catch {
                    fields[fieldname] = autoCast(val)
                }
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

        const finalFilename = `${nameWithoutExt}-${timestamp}.${isImage ? 'webp' : ext}`
        const saveTo = join(uploadDir, finalFilename)

        try {
            if (isImage) {
                await sharp(buffer).webp({ quality: 80 }).toFile(saveTo)
            } else {
                await writeFile(saveTo, buffer)
            }
            console.log('✅ Файл сохранён:', saveTo)
        } catch (err) {
            console.error(`❌ Ошибка сохранения файла ${filename}:`, err)
            continue
        }

        const webPath = `/uploads/${model}/${finalFilename}`
        const key = fieldname.replace(/\[\]$/, '')
        if (!groupedPaths[key]) groupedPaths[key] = []
        groupedPaths[key].push(webPath)
    }

    const dataPath = resolve('assets/staticData', `${model}.json`)
    let data: any[] = []

    try {
        const content = await readFile(dataPath, 'utf-8')
        data = content.trim() ? JSON.parse(content) : []
    } catch (err: any) {
        if (err.code !== 'ENOENT') throw err
    }

    const multipleFields: string[] = fields.multipleFields ?? []
    delete fields.multipleFields

    const newItem: Record<string, any> = {
        id: Date.now(),
        ...fields,
    }

    for (const [field, paths] of Object.entries(groupedPaths)) {
        const cleaned = paths.filter(p => typeof p === 'string' && p.trim())
        newItem[field] = multipleFields.includes(field)
            ? cleaned
            : (cleaned.length === 1 ? cleaned[0] : cleaned)
    }

    for (const key of multipleFields) {
        if (!Object.prototype.hasOwnProperty.call(newItem, key)) {
            newItem[key] = []
        }
    }

    data.push(newItem)
    await writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')

    return { success: true }
})
