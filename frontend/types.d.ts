interface TableHeader {
    title: string
    key: string
    sortable?: boolean
    align: 'start' | 'center' | 'end'
    width?: string
}

interface IBanner {
    id: number | string
    title: string
    description?: string
    slug: string
    link_video?: string
    video?: string
    image?: string
    link_text?: string
    link?: string
    link_external?: boolean
}

interface IBannerOnlyImage extends Omit<IBanner, 'link_video' | 'video'> {}

interface ICategory {
    id: number
    image: string
    key: string
    label: string
    value: string
    subcategories: {
        id: number
        key: string
        label: string
        value: string
    }
}