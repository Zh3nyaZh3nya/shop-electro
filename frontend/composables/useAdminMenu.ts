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
            icon: 'mdi-home-outline',
            title: 'test',
            link: 'test',
        },
        {
            title: 'Главная страница',
            list: [
                {
                    title: 'Предложения',
                    icon: 'mdi-offer',
                    link: 'offers',
                    type: 'card-color',
                },
                {
                    title: 'test',
                    icon: 'mdi-offer',
                    link: 'testtest',
                    type: 'card-color',
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
