import { readBody, defineEventHandler } from 'h3'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { requireAdmin } from '~/utils/auth'

export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const { model } = event.context.params as { model: string }
    const body = await readBody(event)
    const filePath = join('staticData', `${model}.json`)

    let data = []
    try {
        const content = await readFile(filePath, 'utf-8')
        data = JSON.parse(content)
    } catch {}

    data = data.filter((item: any) => item.id !== body.id)

    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')

    return { success: true }
})
