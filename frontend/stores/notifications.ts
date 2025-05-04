import { defineStore } from 'pinia'
import { ref } from "vue"

export interface Notification {
    id: number
    title: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
}

let counter = 0

export const useNotificationStore = defineStore('notifications', () => {
    const list = ref<Notification[]>([])

    function add(notification: Omit<Notification, 'id'>) {
        const id = ++counter
        list.value.unshift({ id, ...notification })
        setTimeout(() => remove(id), 4000)
    }

    function remove(id: number) {
        list.value = list.value.filter(n => n.id !== id)
    }

    return { list, add, remove }
})
