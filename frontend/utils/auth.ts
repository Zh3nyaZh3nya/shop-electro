import { getCookie, createError, H3Event } from 'h3'

export function requireAdmin(event: H3Event) {
    const token = getCookie(event, 'admin_token')
    if (token !== 'true') {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
}
