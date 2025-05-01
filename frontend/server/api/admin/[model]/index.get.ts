import { readFile } from 'fs/promises'
import { join } from 'path'
import { defineEventHandler } from 'h3'
import { requireAdmin } from '~/utils/auth'

export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const { model } = event.context.params as { model: string }
    const filePath = join('staticData', `${model}.json`)

    try {
        const content = await readFile(filePath, 'utf-8')
        return JSON.parse(content)
    } catch {
        return []
    }
})
