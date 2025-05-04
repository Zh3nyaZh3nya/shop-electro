// @ts-ignore
import { readFile } from 'fs/promises'
// @ts-ignore
import { join } from 'path'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {

    const { model, id } = event.context.params as { model: string; id: string }
    const filePath = join('assets/staticData', `${model}.json`)

    try {
        const content = await readFile(filePath, 'utf-8')
        const data = JSON.parse(content)

        const item = data.find((entry: any) => String(entry.id) === id)

        if (!item) {
            return {
                statusCode: 404,
                statusMessage: 'Not Found',
                item: null
            }
        }

        return {
            item
        }
    } catch (err) {
        return {
            statusCode: 500,
            statusMessage: 'Failed to read data',
            item: null
        }
    }
})
