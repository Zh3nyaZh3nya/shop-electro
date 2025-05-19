// @ts-ignore
import fs from 'fs/promises'
// @ts-ignore
import path from 'path'
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const currentProductId = parseInt(query.id as string)

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

    const activeProducts = allProducts.filter(p => p.active)

    const currentProduct = activeProducts.find(p => p.id === currentProductId)
    if (!currentProduct) {
        return { data: [] }
    }

    // Критерии подбора
    const { category, subcategory, price } = currentProduct
    const minPrice = price * 0.5
    const maxPrice = price * 3

    const recommended = activeProducts
        .filter(p =>
            Number(p.id) !== Number(currentProductId) &&
            p.subcategory?.value === subcategory?.value &&
            p.active &&
            p.price >= minPrice &&
            p.price <= maxPrice
        )
        .slice(0, 10)
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
            // reviews: item.reviews,
            installment: item.installment,
        }))

    return { data: recommended }
})
