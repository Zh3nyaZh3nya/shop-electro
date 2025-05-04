export interface BaseItem {
    id: string | number
    title: string
    description: string
    active: boolean
    for_main_page?: boolean
}

export interface BaseItemEnum {
    id: string | number
    image?: File | string | null
    key: string
    value: string
    label: string
    for_main_page?: boolean
}

export interface DisplayProps<T extends BaseItem | BaseItemEnum = BaseItem> {
    action: 'create' | 'edit'
    is_for_main_page?: boolean
    isImage?: boolean
    last_id?: number | string
    item?: T
}

export const rules = {
    required: (v: any) => !!v || 'Обязательно',
    imageOnly: (v: File | null) => {
        if (!v) return true
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        return allowedTypes.includes(v.type) || 'Допустимы только изображения JPG, PNG, WEBP'
    }
}

export type BaseEmitFn<T = BaseItem | BaseItemEnum> = {
    (e: 'updateData', value: T): void
    (e: 'remove', value: { id: string | number }): void
}