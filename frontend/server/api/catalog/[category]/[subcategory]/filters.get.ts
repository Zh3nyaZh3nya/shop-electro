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
            file.startsWith('catalog-') && file.endsWith('.json')
        )

        let allProducts: any[] = []

        for (const file of productFiles) {
            const filePath = path.join(dirPath, file)
            const content = await fs.readFile(filePath, 'utf-8')
            const products = JSON.parse(content)
            allProducts.push(...products)
        }

        const filteredPrices = allProducts
            .filter(
                p =>
                    p.category?.value === category &&
                    p.subcategory?.value === subcategory &&
                    p.active &&
                    typeof p.price === 'number'
            )
            .map(p => p.price)

        if (filteredPrices.length === 0) {
            return {
                minPrice: 0,
                maxPrice: 0,
            }
        }

        const minPrice = Math.min(...filteredPrices)
        const maxPrice = Math.max(...filteredPrices)

        return { minPrice, maxPrice }

    } catch (err: any) {
        console.error('Ошибка в API /api/[category]/[subcategory]/filters:', err)
        return createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: err.message || 'Unexpected error',
        })
    }
})
