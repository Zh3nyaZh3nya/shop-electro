// @ts-ignore
import fs from 'fs/promises'
// @ts-ignore
import path from 'path'
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const searchQuery = (query.search as string)?.toLowerCase()?.trim() || ''

        const dirPath = path.resolve('assets/staticData')
        const files = await fs.readdir(dirPath)

        const productFiles = files.filter(file => file.startsWith('catalog-') && file.endsWith('.json'))

        let allProducts: any[] = []

        for (const file of productFiles) {
            const filePath = path.join(dirPath, file)
            try {
                const content = await fs.readFile(filePath, 'utf-8')
                const products = JSON.parse(content)
                allProducts.push(...products)
            } catch (err) {
                console.error(`❌ Ошибка в файле ${file}:`, err)
            }
        }

        if (!allProducts.length) {
            console.warn('⚠️ Каталоги пусты или не прочитаны.')
        }

        const filteredProducts = allProducts
            .filter(p => p.active)
            .filter(p => {
                if (!searchQuery) return true

                const inTitle = p.title?.toLowerCase().includes(searchQuery)
                const inSlug = p.slug?.toLowerCase().includes(searchQuery)
                const inCategory = p.category?.label?.toLowerCase().includes(searchQuery)
                const inSubcategory = p.subcategory?.label?.toLowerCase().includes(searchQuery)

                return inTitle || inSlug || inCategory || inSubcategory
            })
            .slice(0, 6) // максимум 6 результатов
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
                installment: item.installment,
            }))

        return { data: filteredProducts }
    } catch (error) {
        console.error('❌ Общая ошибка в API поиска:', error)
        return {
            statusCode: 500,
            statusMessage: 'Failed to read data',
            data: [],
        }
    }
})
