import { defineStore } from "pinia";
import { staticData } from "assets/staticData";
import type { ICategory, IProduct, ITopBlock } from "~/types";

interface RootState {
    category: ICategory[]
    products: IProduct[]
    main_blocks: ITopBlock[]
}

export const useStore = defineStore("index", {
    state: (): RootState => ({
        category: staticData.category.ru,
        products: staticData.products.ru,
        main_blocks: staticData.main_blocks.ru
    }),
    actions: {
        updateStateLocale(locale: string): void {
            const lang: "kk" | "ru" = locale === "kk" ? "kk" : "ru";
            this.category = staticData.category[lang];
            this.products = staticData.products[lang];
            this.main_blocks = staticData.main_blocks[lang];
        },
    },
    getters: {
        GET_MAIN_BLOCKS: (state: RootState): ITopBlock[] => {
            return state.main_blocks
        },
        GET_MAIN_CATEGORY: (state: RootState): ICategory[] => {
            return state.category
                .filter((item: ICategory): boolean => item.sub_categories.length > 0)
                .slice(0, 4);
        }
    }
})