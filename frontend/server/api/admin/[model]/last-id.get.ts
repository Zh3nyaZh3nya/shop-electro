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

        if (!Array.isArray(data) || data.length === 0) {
            return { last_id: '1' }
        }

        const ids = data
            .map((item: any) => parseInt(item.id, 10))
            .filter(id => !isNaN(id))

        const maxId = ids.length > 0 ? Math.max(...ids) : 0

        return {
            last_id: String(maxId + 1)
        }
    } catch {
        return {
            last_id: '1'
        }
    }
})
