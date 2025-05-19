// @ts-ignore
import fs from 'fs/promises'
// @ts-ignore
import path from 'path'
import { defineEventHandler, createError, getQuery } from "h3"

export default defineEventHandler(async (event) => {
    try {
        const { category, subcategory } = event.context.params as {
            category: string
            subcategory: string
        }

        const query = getQuery(event)
        const discount = query.discount === 'true'
        const installment = query.installment === 'true'
        const inStock = query.inStock === 'true'

        const priceFrom = query.priceFrom ? parseInt(query.priceFrom as string, 10) : 0
        const priceTo = query.priceTo ? parseInt(query.priceTo as string, 10) : Number.MAX_SAFE_INTEGER

        const page = parseInt((query.page as string) || '1', 10)
        const perPage = parseInt((query.per_page as string) || '20', 10)

        // @ts-ignore
        const dirPath = path.resolve(process.cwd(), 'assets/staticData')

        const files = await fs.readdir(dirPath)
        const productFiles = files.filter(file =>
            file.startsWith('catalog-') && file.endsWith('.json')
        )

        let allProducts: any[] = []

        for (const file of productFiles) {
            const filePath = path.join(dirPath, file)
            const content = await fs.readFile(filePath, 'utf-8')
            const products = JSON.parse(content)
            allProducts.push(...products)
        }

        const filtered = allProducts.filter(
            p =>
                p.active &&
                p.category?.value === category &&
                p.subcategory?.value === subcategory &&
                (!discount || p.discount === true) &&
                (!installment || p.installment === true) &&
                (!inStock || p.count > 0) &&
                typeof p.price === 'number' &&
                p.price >= priceFrom &&
                p.price <= priceTo
        )

        const total = filtered.length
        const start = (page - 1) * perPage
        const paginated = filtered.slice(start, start + perPage)

        const data = paginated.map(item => ({
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
            // reviews: item.reviews,
            installment: item.installment,
        }))

        return {
            data,
            meta: {
                total,
                page,
                perPage: perPage,
                totalPages: Math.ceil(total / perPage)
            }
        }
    } catch (err: any) {
        console.error('Ошибка в API /api/[category]/[subcategory]:', err)
        return createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: err.message || 'Unexpected error',
        })
    }
})
