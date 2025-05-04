import { readFile } from 'fs/promises'
import { join } from 'path'
import { defineEventHandler } from 'h3'
import { requireAdmin } from '~/utils/auth'

export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const { model } = event.context.params as { model: string }
    const filePath = join('assets/staticData', `${model}.json`)

    try {
        const content = await readFile(filePath, 'utf-8')
        const data = JSON.parse(content)

        const maxId = Math.max(
            ...data.map((item: any) => parseInt(item.id, 10)).filter(id => !isNaN(id))
        )

        return {
            last_id: String(maxId + 1)
        }
    } catch {
        return {
            last_id: '1'
        }
    }
})
