import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@/assets/fonts/fonts.css';
import { defaults } from '@/utils/vuetify/defaults'
import { VFileUpload } from 'vuetify/labs/VFileUpload'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        theme: {
            defaultTheme: 'dark',
            themes: {
                dark: {
                    colors: {
                        primary: '#22b0f3',
                        'dark-primary': '#4238f5',
                        'light-primary': '#34beff',
                        grey: '#AFBBC6',
                        secondary: '#212121',
                        background: '#f7f7f7',
                        surface: '#F7F8FA',
                        error: '#DC3545',
                        success: '#28A745',
                        'admin-background': "#09090b",
                        'admin-primary': "#f59e0b",
                        'admin-red': "#ff6f6f",
                        'admin-grey': "#71717a",
                        'admin-grey-light-1': '#a1a1aa',
                        'admin-grey-light-2': '#474747',
                        'admin-grey-dark-1': '#18181b',
                        'admin-grey-dark-2': '#100e0e',
                        'admin-error': '#ef4444'
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
        components: {
            ...components,
            VFileUpload,
        },
        directives,
        ssr: true,
    })
    app.vueApp.use(vuetify)
})
