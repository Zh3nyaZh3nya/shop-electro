import { readFile } from 'fs/promises'
import { join } from 'path'
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
    const { model } = event.context.params as { model: string }
    const filePath = join('assets/staticData', `${model}.json`)

    const query = getQuery(event)
    const hasPagination = 'page' in query && 'perPage' in query
    const page = parseInt(query.page as string) || 1
    const perPage = parseInt(query.perPage as string) || 10
    const sortBy = query.sortBy as string || ''
    const sortDesc = query.sortDesc === 'true'
    const search = (query.search as string)?.toLowerCase().trim() || ''
    const filterByMainPage = query.mainPage === 'true'

    try {
        const content = await readFile(filePath, 'utf-8')
        let data = JSON.parse(content)

        data = data.filter((item: any) => {
            const isActive = checkActive(item)
            const isForMainPage = !filterByMainPage || item.for_main_page === true
            return isActive && isForMainPage
        })

        function checkActive(obj: any): boolean {
            if (!obj || typeof obj !== 'object') return true

            if ('active' in obj && obj.active === false) return false

            for (const key in obj) {
                if (Array.isArray(obj[key])) {
                    for (const child of obj[key]) {
                        if (!checkActive(child)) return false
                    }
                }
            }

            return true
        }

        data = data.map(({ active, for_main_page, ...rest }: any) => rest)

        if (search) {
            data = data.filter((item: any) =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(search)
                )
            )
        }

        if (sortBy) {
            data.sort((a: any, b: any) => {
                if (a[sortBy] < b[sortBy]) return sortDesc ? 1 : -1
                if (a[sortBy] > b[sortBy]) return sortDesc ? -1 : 1
                return 0
            })
        }

        if (!hasPagination) {
            return {
                items: data,
                total: data.length,
                page: 1,
                perPage: data.length,
                totalPages: 1,
            }
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
            page: 1,
            perPage: 10,
            total: 0,
            totalPages: 0,
        }
    }
})
