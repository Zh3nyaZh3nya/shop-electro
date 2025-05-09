type TypeDisplay =
    'card' | //
    'index' | // главная страница в админке
    'card-enum' | // энамы
    'image' | // если нужно добавить изображения
    'for-main-page' | // если нужно отобразить на главной (/api/:module?mainPage=true)
    'card-enum-subcategory' | // если нужно добавить подкатегории
    'video' | // если нужно добавить видео
    'link' | // если нужно добавить ссылки
    'product'
type AdminMenuItem =
    | {
    title: string
    icon: string
    link: string
    type: TypeDisplay[]
    enums?: string[] // <- Какие энамы нужны для модуля (берутся из item'а у которого в link есть приписка enums)
}
    | {
    title: string
    list: {
        title: string
        icon: string
        link: string
        type: TypeDisplay[]
        enums?: string[] // <- Какие энамы нужны для модуля (берутся из item'а у которого в link есть приписка enums)
    }[]
}

export const useAdminMenu = () => {
    const menu: AdminMenuItem[] = [
        {
            icon: 'mdi-home-outline',
            title: 'Инфопанель',
            link: '',
            type: ['index'],
        },
        {
            icon: 'mdi-map-marker-outline',
            title: 'Города',
            link: 'cities',
            type: ['card-enum'],
        },
        {
            title: 'Главная страница',
            list: [
                {
                    title: 'Баннер',
                    icon: 'mdi-folder-multiple-image',
                    link: 'main-banner',
                    type: ['card', 'image', 'video', 'link', 'for-main-page'],
                },
                {
                    title: 'Предложения',
                    icon: 'mdi-offer',
                    link: 'main-offer',
                    type: ['card', 'image', 'link', 'for-main-page'],
                },
            ],
        },
        {
            title: 'Товары',
            list: [
                {
                    title: 'Телевизоры',
                    icon: 'mdi-television',
                    link: 'televizory',
                    type: ['product', 'for-main-page', 'image'],
                    enums: ['categories'],
                },
                {
                    title: 'Компьютерная техника',
                    icon: 'mdi-laptop',
                    link: 'kompyuternaya-tekhnika',
                    type: ['product', 'for-main-page', 'image'],
                    enums: ['categories'],
                },
                {
                    title: 'Крупная бытовая техника',
                    icon: 'mdi-fridge-industrial',
                    link: 'krupnaya-bytovaya-tekhnika',
                    type: ['product', 'for-main-page', 'image'],
                    enums: ['categories'],
                },
                {
                    title: 'Встраиваемая техника',
                    icon: 'mdi-washing-machine',
                    link: 'vstraivaemaya-tekhnika',
                    type: ['product', 'for-main-page', 'image'],
                    enums: ['categories'],
                },
                {
                    title: 'Малая бытовая техника',
                    icon: 'mdi-kettle-steam-outline',
                    link: 'malaya-bytovaya-tekhnika',
                    type: ['product', 'for-main-page', 'image'],
                    enums: ['categories'],
                },
                {
                    title: 'Климатическая техника',
                    icon: 'mdi-hvac',
                    link: 'klimaticheskaya-tekhnika',
                    type: ['product', 'for-main-page', 'image'],
                    enums: ['categories'],
                },
                {
                    title: 'Акссесуары',
                    icon: 'mdi-bag-personal-outline',
                    link: 'akssesuary',
                    type: ['product', 'for-main-page', 'image'],
                    enums: ['categories'],
                },
            ],
        },
        {
            title: 'Справочники',
            list: [
                {
                    icon: 'mdi-format-list-bulleted',
                    title: 'Категории',
                    link: 'categories',
                    type: ['card-enum-subcategory', 'for-main-page', 'image'],
                },
            ],
        },
    ]

    const flat = menu.flatMap(item =>
        'list' in item ? item.list : [item]
    )

    const getByPage = (slug: string | undefined) => {
        if (slug === undefined || slug === '') return flat.find(i => i.link === '')
        return flat.find(i => i.link === slug)
    }

    return { menu, flat, getByPage }
}
