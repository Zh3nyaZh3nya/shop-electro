import { readFile } from 'fs/promises'
import { join } from 'path'
import { defineEventHandler, getQuery } from 'h3'
import { requireAdmin } from '~/utils/auth'

export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const { model } = event.context.params as { model: string }
    const filePath = join('assets/staticData', `${model}.json`)

    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const perPage = parseInt(query.perPage as string) || 10
    const sortBy = query.sortBy as string || ''
    const sortDesc = query.sortDesc === 'true'

    try {
        const content = await readFile(filePath, 'utf-8')
        let data = JSON.parse(content)

        if (sortBy) {
            data.sort((a: any, b: any) => {
                if (a[sortBy] < b[sortBy]) return sortDesc ? 1 : -1
                if (a[sortBy] > b[sortBy]) return sortDesc ? -1 : 1
                return 0
            })
        }

        const total = data.length
        const start = (page - 1) * perPage
        const end = start + perPage
        const items = data.slice(start, end)

        return {
            items,
            page,
            perPage,
            total,
            totalPages: Math.ceil(total / perPage),
        }
    } catch {
        return {
            items: [],
            page,
            perPage,
            total: 0,
            totalPages: 0
        }
    }
})
