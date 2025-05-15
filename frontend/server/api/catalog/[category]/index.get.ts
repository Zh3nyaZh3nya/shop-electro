// @ts-ignore
import fs from 'fs/promises'
// @ts-ignore
import path from 'path'
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
    const { category } = event.context.params as { category: string }
    const { page = '1', perPage = '10' } = getQuery(event)

    const currentPage = parseInt(page as string, 10)
    const limit = parseInt(perPage as string, 10)

    const dirPath = path.resolve('assets/staticData')
    const files = await fs.readdir(dirPath)

    const productFiles = files.filter(file => file.startsWith('catalog-') && file.endsWith('.json'))

    let allProducts: any[] = []

    for (const file of productFiles) {
        const filePath = path.join(dirPath, file)
        const content = await fs.readFile(filePath, 'utf-8')
        try {
            const products = JSON.parse(content)
            allProducts.push(...products)
        } catch (err) {
            console.error(`Ошибка в файле ${file}:`, err)
        }
    }

    const filtered = allProducts.filter(p => p.category?.value === category && p.active).map(item => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        discount: item.discount,
        discount_percent: item.discount_percent,
        price: item.price,
        rating: item.rating,
        category: item.category,
        subcategory: item.subcategory,
        preview_images: item.preview_images,
        reviews: item.reviews,
        installment: item.installment,
    }))

    const total = filtered.length
    const start = (currentPage - 1) * limit
    const end = start + limit
    const paginated = filtered.slice(start, end)

    return {
        data: paginated,
        meta: {
            total,
            page: currentPage,
            perPage: limit,
            totalPages: Math.ceil(total / limit)
        }
    }
})
