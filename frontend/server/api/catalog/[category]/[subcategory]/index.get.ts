// @ts-ignore
import fs from 'fs/promises'
// @ts-ignore
import path from 'path'
import { defineEventHandler, createError } from "h3"

export default defineEventHandler(async (event) => {
    try {
        const { category, subcategory } = event.context.params as {
            category: string
            subcategory: string
        }
        // @ts-ignore
        const dirPath = path.resolve(process.cwd(), 'assets/staticData')

        const files = await fs.readdir(dirPath)
        const productFiles = files.filter(file =>
            file.startsWith('product-') && file.endsWith('.json')
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
                p.category?.value === category &&
                p.subcategory?.value === subcategory &&
                p.active
        ).map(item => {
            return {
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
            }
        })

        return filtered
    } catch (err: any) {
        console.error('Ошибка в API /api/[category]/[subcategory]:', err)
        return createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: err.message || 'Unexpected error',
        })
    }
})
