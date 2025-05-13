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

interface IProductCard {
    id: number
    title: string
    slug: string,
    discount: boolean,
    discount_percent: number,
    price: number,
    rating: number,
    category: {
        id: number
        key: string
        value: string
        label: string
        active: boolean
        for_main_page: boolean
        image: string
    }
    subcategory: {
        id: number
        key: string
        value: string
        label: string
        active: boolean
    }
    preview_images: string[],
    reviews: [],
    installment: boolean
}

interface IProduct extends IProductCard {
    description: string
    count: number
    delivery: boolean
    specifications: {
        title: string
        specification: {
            title: string
            description: string
        }[]
    }[]
    images: string[]
}