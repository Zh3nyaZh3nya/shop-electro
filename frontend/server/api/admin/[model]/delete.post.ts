import { readBody, defineEventHandler } from 'h3'
import { readFile, writeFile, unlink } from 'fs/promises'
import { join, resolve } from 'path'
import { requireAdmin } from '~/utils/auth'

export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const { model } = event.context.params as { model: string }
    const body = await readBody(event)
    const filePath = join('assets/staticData', `${model}.json`)

    let data = []
    try {
        const content = await readFile(filePath, 'utf-8')
        data = JSON.parse(content)
    } catch {}

    const idsToDelete: number[] = []

    if (Array.isArray(body.ids)) {
        idsToDelete.push(...body.ids)
    } else if (typeof body.id !== 'undefined') {
        idsToDelete.push(body.id)
    }

    const itemsToDelete = data.filter((item: any) => idsToDelete.includes(item.id))

    for (const item of itemsToDelete) {
        if (item.image) {
            const absolutePath = resolve('public', item.image.replace(/^\/+/, ''))
            try {
                await unlink(absolutePath)
            } catch (err) {
                console.warn(`Не удалось удалить файл: ${absolutePath}`, err)
            }
        }
    }

    data = data.filter((item: any) => !idsToDelete.includes(item.id))

    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')

    return {
        success: true,
        deletedIds: idsToDelete,
    }
})
