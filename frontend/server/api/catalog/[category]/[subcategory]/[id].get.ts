// @ts-ignore
import fs from 'fs/promises'
// @ts-ignore
import path from 'path'
import { defineEventHandler, createError } from "h3"

export default defineEventHandler(async (event) => {
    try {
        const { category, subcategory, id } = event.context.params as {
            category: string
            subcategory: string
            id: string
        }

        const numericId = parseInt(id)
        if (isNaN(numericId)) {
            throw new Error('Некорректный ID')
        }

        // @ts-ignore
        const dirPath = path.resolve(process.cwd(), 'assets/staticData')
        const files = await fs.readdir(dirPath)

        const productFiles = files.filter(file =>
            file.startsWith('catalog-') && file.endsWith('.json')
        )

        for (const file of productFiles) {
            const filePath = path.join(dirPath, file)
            const content = await fs.readFile(filePath, 'utf-8')
            const products = JSON.parse(content)

            const found = products.find(
                (p: any) =>
                    p.id === numericId &&
                    p.category?.value === category &&
                    p.subcategory?.value === subcategory &&
                    p.active
            )

            if (found) return found
        }

        return createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            message: 'Товар не найден',
        })
    } catch (err: any) {
        console.error('Ошибка в API /api/[category]/[subcategory]/[slug]:', err)
        return createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: err.message || 'Unexpected error',
        })
    }
})
