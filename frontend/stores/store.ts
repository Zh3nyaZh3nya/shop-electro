import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useApi } from '~/composables/useApi'

export const useStore = defineStore('store', () => {
    const FAVORITE_KEY = 'store-favorites'
    const CART_KEY = 'store-cart'

    const categories = ref<ICategory[]>([])
    const categoriesMain = ref<Omit<ICategory, 'subcategories'>[]>([])

    const favorites = ref<IProductCard[]>(loadFromLocalStorage(FAVORITE_KEY))
    const cart = ref<IProductCard[]>(loadFromLocalStorage(CART_KEY))

    async function fetchCategories(isMain?: boolean) {
        if (!categories.value.length || !categoriesMain.value.length) {
            const { data: dataFetch } = await useApi<{ items: ICategory[] }>(
                `/categories${isMain ? '?mainPage=true' : ''}`,
                { method: 'GET' }
            )

            if (isMain) {
                categoriesMain.value = dataFetch?.value?.items.map(({ subcategories, ...rest }) => rest) || []
            } else {
                categories.value = dataFetch?.value?.items || []
            }
        }
    }

    function addProduct(storage: 'favorite' | 'cart', product: IProductCard) {
        const target = storage === 'favorite' ? favorites : cart
        if (!target.value.some(p => p.id === product.id)) {
            target.value.push({ ...product, count_cart: 1 })
        }
    }

    function removeProduct(storage: 'favorite' | 'cart', productId: number) {
        const target = storage === 'favorite' ? favorites : cart
        target.value = target.value.filter(p => p.id !== productId)
    }

    function updateCountProduct(count: number, productId: number) {
        cart.value.find(i => i.id === productId).count_cart = count
    }

    watch(favorites, (val) => saveToLocalStorage(FAVORITE_KEY, val), { deep: true })
    watch(cart, (val) => saveToLocalStorage(CART_KEY, val), { deep: true })

    return {
        categories,
        categoriesMain,
        favorites,
        cart,

        fetchCategories,
        addProduct,
        removeProduct,
        updateCountProduct
    }
})

function loadFromLocalStorage(key: string): IProductCard[] {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : []
    } catch (e) {
        console.warn(`Ошибка чтения localStorage (${key}):`, e)
        return []
    }
}

function saveToLocalStorage(key: string, data: IProductCard[]) {
    try {
        localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
        console.warn(`Ошибка записи в localStorage (${key}):`, e)
    }
}
