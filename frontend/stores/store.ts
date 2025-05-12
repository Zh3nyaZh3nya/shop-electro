import { defineStore } from 'pinia'
import { ref } from "vue"
import { useApi } from "~/composables/useApi";

export const useStore = defineStore('store', () => {
    const categories = ref<ICategory[]>([])
    const categoriesMain = ref<Omit<ICategory, 'subcategories'>[]>([])

    async function fetchCategories(isMain?: boolean) {
        if(!categories.value.length || !categoriesMain.value.length) {
            const { data: dataFetch } = await useApi<{ items: ICategory[] }>(
                `/categories${isMain ? '?mainPage=true' : ''}`,
                { method: 'GET' }
            )

            if(isMain) {
                categoriesMain.value = dataFetch?.value?.items.map(({ subcategories, ...rest }) => rest) || []
            } else {
                categories.value = dataFetch?.value?.items || []
            }
        }

    }

    return {
        categories,
        categoriesMain,

        fetchCategories,
    }
})