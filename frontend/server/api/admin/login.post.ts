import { readBody, setCookie, createError, defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { login, password } = body

    const ADMIN_LOGIN = 'admin'
    const ADMIN_PASSWORD = '123456'

    if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
        setCookie(event, 'admin_token', 'true', {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24,
        })
        return { success: true }
    }

    const errors: Record<string, string> = {}
    if (login !== ADMIN_LOGIN) errors.login = 'Неверный логин'
    if (password !== ADMIN_PASSWORD) errors.password = 'Неверный пароль'

    throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
        data: errors,
    })
})
