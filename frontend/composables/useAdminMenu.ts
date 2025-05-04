type TypeDisplay = 'card' | 'card-color' | 'index'
type AdminMenuItem =
    | {
    title: string
    icon: string
    link: string
    type: TypeDisplay
}
    | {
    title: string
    list: {
        title: string
        icon: string
        link: string
        type: TypeDisplay
    }[]
}

export const useAdminMenu = () => {
    const menu: AdminMenuItem[] = [
        {
            icon: 'mdi-home-outline',
            title: 'Инфопанель',
            link: '',
            type: 'index',
        },
        {
            title: 'Главная страница',
            list: [
                {
                    title: 'Инфо-блоки',
                    icon: 'mdi-information-variant-circle-outline',
                    link: 'info-blocks',
                    type: 'card-color',
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
                    type: 'card',
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
