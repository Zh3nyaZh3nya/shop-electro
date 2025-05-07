export interface BaseItem {
    id: string | number
    title: string
    slug: string
    description: string
    active: boolean
    for_main_page?: boolean
    link?: string
    link_text?: string
    link_external?: boolean
    image?: File | string
    video?: File | string
    link_video?: string
}

export interface BaseItemEnum {
    id: string | number
    image?: File | string | null
    key: string
    value: string
    label: string
    active: boolean
    for_main_page?: boolean
    subcategories?: {
        id: string | number
        key: string
        value: string
        label: string
        active: boolean
    }[]
}

export interface DisplayProps<T extends BaseItem | BaseItemEnum = BaseItem> {
    action: 'create' | 'edit'
    is_for_main_page?: boolean
    isImage?: boolean
    is_video?: boolean
    is_link?: boolean
    is_subcategory?: boolean
    last_id?: number | string
    item?: T
}

export const rules = {
    required: (v: any) => !!v || 'Обязательно',
    imageOnly: (v: File | null) => {
        if (!v) return true
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        return allowedTypes.includes(v.type) || 'Допустимы только изображения JPG, PNG, WEBP'
    },
    videoOnly: (v: File | null) => {
        if (!v) return true
        const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg']
        return allowedTypes.includes(v.type) || 'Допустимы только видео MP4, WEBM, OGG'
    },
    imageOrVideoOnly: (v: File | null) => {
        if (!v) return true
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/webp',
            'video/mp4', 'video/webm', 'video/ogg'
        ]
        return allowedTypes.includes(v.type) || 'Допустимы изображения JPG/PNG/WEBP и видео MP4/WEBM/OGG'
    }
}

export type BaseEmitFn<T = BaseItem | BaseItemEnum> = {
    (e: 'updateData', value: T): void
    (e: 'remove', value: { id: string | number }): void
}