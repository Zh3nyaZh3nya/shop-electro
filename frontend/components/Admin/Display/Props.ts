export interface BaseItem {
    id: string | number
    title: string
    description: string
    active: boolean
}

export interface DisplayProps<T extends BaseItem = BaseItem> {
    action: 'create' | 'edit'
    last_id?: number | string
    item?: T
}