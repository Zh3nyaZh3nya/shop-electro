type TypeDisplay =
    'card' |
    'card-color' |
    'index' |
    'card-enum' |
    'image' |
    'for-main-page' |
    'card-enum-subcategory'
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
                    title: 'Инфо-блоки',
                    icon: 'mdi-information-variant-circle-outline',
                    link: 'info-blocks',
                    type: ['card-color'],
                },
            ],
        },
        {
            title: 'Справочники',
            list: [
                {
                    title: 'Бренды',
                    icon: 'mdi-tag-multiple-outline',
                    link: 'brand-enums',
                    type: ['card-enum', 'image', 'for-main-page'],
                },
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
