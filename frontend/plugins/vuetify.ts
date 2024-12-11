import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@/assets/fonts/fonts.css';
import { defaults } from '@/utils/vuetify/defaults'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        theme: {
            defaultTheme: 'dark',
            themes: {
                dark: {
                    colors: {
                        primary: '#FF6F00',
                        'lite-primary': '#f79448',
                        secondary: '#333',
                        background: '#f7f7f7',
                        surface: '#F7F8FA',
                        error: '#DC3545',
                        success: '#28A745',
                    },
                },
            },
        },
        defaults,
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
