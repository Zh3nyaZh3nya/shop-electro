import { mkdir, readFile, writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { defineEventHandler } from 'h3'
// @ts-ignore
import Busboy from 'busboy'
import sharp from 'sharp'
import { requireAdmin } from '~/utils/auth'
import { autoCast } from "~/server/utils/autoCast";

export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const { model } = event.context.params as { model: string }
    const uploadDir = resolve('public/storage', model)
    await mkdir(uploadDir, { recursive: true })

    const busboy = Busboy({ headers: event.node.req.headers })
    const fields: Record<string, string> = {}
    const chunks: Buffer[] = []
    let filename: string | null = null
    let filePath: string | null = null

    const fileUploadPromise = new Promise<void>((resolveUpload, rejectUpload) => {
        busboy.on('file', (fieldname: any, file: any, info: any) => {
            filename = info.filename
            if (!filename) {
                file.resume()
                return
            }

            file.on('data', (chunk: any) => chunks.push(chunk))
            file.on('error', rejectUpload)
        })

        busboy.on('field', (fieldname: any, val: any) => {
            fields[fieldname] = autoCast(val)
        })

        busboy.on('finish', async () => {
            if (filename && chunks.length) {
                const fileNameWithoutExt = filename.split('.').slice(0, -1).join('.') || 'image'
                const webpFileName = `${fileNameWithoutExt}-${Date.now()}.webp`
                const saveTo = join(uploadDir, webpFileName)
                filePath = `/storage/${model}/${webpFileName}`

                try {
                    const buffer = Buffer.concat(chunks)
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
    let data = []
    try {
        const content = await readFile(dataPath, 'utf-8')
        data = JSON.parse(content)
    } catch {}

    const id = Number(fields.id)
    const index = data.findIndex((item: any) => Number(item.id) === id)

    if (index !== -1) {
        const updated = {
            ...data[index],
            ...fields,
        }

        if (filePath) {
            updated.image = filePath
        }

        data[index] = updated
    }

    console.log('Incoming fields:', fields)
    console.log('Parsed id:', id)
    console.log('Matched index:', index)

    await writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')

    return { success: true }
})
