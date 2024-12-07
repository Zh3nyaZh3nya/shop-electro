import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        theme: {
            defaultTheme: 'dark',
            themes: {
                dark: {
                    colors: {
                        primary: '#0056D2',
                        secondary: '#6C757D',
                        background: '#F8F9FA',
                        surface: '#FFFFFF',

                        success: '#4CAF50',
                        warning: '#FFC107',
                        error: '#FF5252',
                        info: '#2196F3',
                    },
                },
            },
        },
        icons: {
            defaultSet: 'mdi',
            aliases,
            sets: {
                mdi,
            },
        },
        components,
        directives,
        ssr: true,
    })
    app.vueApp.use(vuetify)
})
