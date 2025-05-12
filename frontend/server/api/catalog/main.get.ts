// @ts-ignore
import fs from 'fs/promises'
// @ts-ignore
import path from 'path'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
    const dirPath = path.resolve('assets/staticData')
    const files = await fs.readdir(dirPath)

    const productFiles = files.filter(file => file.startsWith('product-') && file.endsWith('.json'))

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

    const filtered = allProducts
        .filter(p => p.active && p.for_main_page)
        .map(item => ({
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
        }))

    return filtered
})
