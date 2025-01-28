import type { IProduct, ICategoryWithProducts, ICategory } from "~/types";

export function combineCategoriesWithProducts(
    categories: ICategory[],
    products: IProduct[]
): ICategoryWithProducts[] {
    return categories.map((category) => {
        const sub_categories = category.sub_categories.map((sub_category) => {
            const relatedProducts = products.filter(
                (product) =>
                    product.category === category.category &&
                    product.sub_category === sub_category
            );

            return {
                sub_category,
                products: relatedProducts,
            };
        });

        const relatedProducts = products.filter(
            (product) =>
                product.category === category.category &&
                product.sub_category === null
        );

        if (relatedProducts.length > 0) {
            sub_categories.push({
                sub_category: null,
                products: relatedProducts,
            });
        }

        return {
            ...category,
            sub_categories,
        };
    });
}