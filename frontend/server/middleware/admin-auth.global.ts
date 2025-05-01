import { getCookie, sendRedirect, createError, defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
    const path = event.path || ''

    const isProtectedRoute =
        (
            path.startsWith('/admin') && path !== '/admin/login'
        ) ||
        (
            path.startsWith('/api/admin') && path !== '/api/admin/login'
        )

    if (isProtectedRoute) {
        const token = getCookie(event, 'admin_token')

        if (token !== 'true') {
            if (path.startsWith('/api/')) {
                throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
            } else {
                return sendRedirect(event, '/admin/login')
            }
        }
    }
})

