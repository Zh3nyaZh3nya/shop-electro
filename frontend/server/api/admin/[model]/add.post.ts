import { mkdir, readFile, writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { defineEventHandler } from 'h3'
import Busboy from 'busboy'
import sharp from 'sharp'
import { requireAdmin } from '~/utils/auth'

export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const { model } = event.context.params as { model: string }
    const uploadDir = resolve('public/storage', model)
    await mkdir(uploadDir, { recursive: true })

    const fields: Record<string, string> = {}
    let filePath: string | null = null

    const busboy = Busboy({ headers: event.node.req.headers })

    const chunks: Buffer[] = []
    let filename: string | null = null

    const fileUploadPromise = new Promise<void>((resolveUpload, rejectUpload) => {
        busboy.on('file', (fieldname, file, info) => {
            if (!info.filename) {
                file.resume()
                return
            }

            filename = info.filename
            file.on('data', (chunk) => chunks.push(chunk))
            file.on('error', rejectUpload)
        })

        busboy.on('field', (fieldname, val) => {
            fields[fieldname] = val
        })

        busboy.on('finish', async () => {
            if (filename && chunks.length) {
                const buffer = Buffer.concat(chunks)
                const nameWithoutExt = filename.split('.').slice(0, -1).join('.') || 'image'
                const webpFileName = `${nameWithoutExt}-${Date.now()}.webp`
                const saveTo = join(uploadDir, webpFileName)
                filePath = `/storage/${model}/${webpFileName}`

                try {
                    await sharp(buffer).webp({ quality: 80 }).toFile(saveTo)
                } catch (err) {
                    return rejectUpload(err)
                }
            }

            resolveUpload()
        })

        event.node.req.pipe(busboy)
    })

    await fileUploadPromise

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
        ...fields
    }

    if (filePath) {
        newItem.image = filePath
    }

    data.push(newItem)

    await writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')

    return { success: true }
})
