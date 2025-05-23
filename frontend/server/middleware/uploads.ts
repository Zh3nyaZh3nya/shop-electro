// server/middleware/uploads.ts
import { defineEventHandler, getRequestURL, sendStream, createError } from 'h3'
import { createReadStream, statSync } from 'node:fs'
import { join } from 'node:path'

const UPLOADS_DIR = process.env.NUXT_UPLOADS_DIR || join(process.cwd(), 'uploads')

export default defineEventHandler(async (event) => {
    const url = getRequestURL(event)

    // ✅ Обрабатываем только путь начинающийся с /uploads/
    if (!url.pathname.startsWith('/uploads/')) return

    const relativePath = decodeURIComponent(url.pathname.replace(/^\/uploads/, ''))
    const fullPath = join(UPLOADS_DIR, relativePath)

    // 🛡 Защита от запросов к __nuxt и др.
    if (!relativePath || relativePath === '/' || relativePath.includes('__nuxt')) {
        throw createError({ statusCode: 404, statusMessage: 'Forbidden path' })
    }

    try {
        const stat = statSync(fullPath)
        if (!stat.isFile()) throw new Error('Not a file')

        return sendStream(event, createReadStream(fullPath))
    } catch {
        console.error('❌ File not found:', fullPath)
        throw createError({ statusCode: 404, statusMessage: 'File Not Found' })
    }
})
