import { readBody, defineEventHandler } from 'h3'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join, resolve } from 'path'
import { requireAdmin } from '~/utils/auth'

export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const { model } = event.context.params as { model: string }
    const body = await readBody(event)
    const folderPath = resolve('assets/staticData')
    const filePath = join(folderPath, `${model}.json`)

    await mkdir(folderPath, { recursive: true })

    let data = []
    try {
        const content = await readFile(filePath, 'utf-8')
        data = JSON.parse(content)
    } catch {
    }

    data.push({ id: Date.now(), ...body })

    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')

    return { success: true }
})
