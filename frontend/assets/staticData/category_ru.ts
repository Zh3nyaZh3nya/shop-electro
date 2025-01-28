import { Category, SubCategory } from "~/types";
import type { ICategory } from "~/types";

export const data: ICategory[] = [
    {
        id: 1,
        category: Category.SMARTPHONES,
        sub_categories: [
            SubCategory.SMARTPHONES_ANDROID,
            SubCategory.SMARTPHONES_IOS,
            SubCategory.SMARTPHONES_ACCESSORIES
        ]
    },
    {
        id: 2,
        category: Category.LAPTOPS,
        sub_categories: [
            SubCategory.LAPTOPS_ULTRABOOKS,
            SubCategory.LAPTOPS_GAMING,
            SubCategory.LAPTOPS_BUSINESS,
            SubCategory.LAPTOPS_ACCESSORIES
        ]
    },
    {
        id: 3,
        category: Category.TABLETS,
        sub_categories: [] // У планшетов нет подкатегорий
    },
    {
        id: 4,
        category: Category.TELEVISIONS,
        sub_categories: [
            SubCategory.TELEVISIONS_LED,
            SubCategory.TELEVISIONS_OLED,
            SubCategory.TELEVISIONS_SMART
        ]
    },
    {
        id: 5,
        category: Category.HEADPHONES,
        sub_categories: [] // У наушников нет подкатегорий
    },
    {
        id: 6,
        category: Category.CAMERAS,
        sub_categories: [
            SubCategory.CAMERAS_DSLR,
            SubCategory.CAMERAS_MIRRORLESS,
            SubCategory.CAMERAS_ACTION
        ]
    },
    {
        id: 7,
        category: Category.GAMING_CONSOLES,
        sub_categories: [
            SubCategory.GAMING_CONSOLES_HANDHELD,
            SubCategory.GAMING_CONSOLES_HOME,
            SubCategory.GAMING_CONSOLES_ACCESSORIES
        ]
    },
    {
        id: 8,
        category: Category.HOME_APPLIANCES,
        sub_categories: [
            SubCategory.HOME_APPLIANCES_VACUUMS,
            SubCategory.HOME_APPLIANCES_KITCHEN,
            SubCategory.HOME_APPLIANCES_LAUNDRY
        ]
    },
    {
        id: 9,
        category: Category.SMART_HOME_DEVICES,
        sub_categories: [
            SubCategory.SMART_HOME_LIGHTING,
            SubCategory.SMART_HOME_SECURITY,
            SubCategory.SMART_HOME_CONTROLS
        ]
    },
    {
        id: 10,
        category: Category.WEARABLES,
        sub_categories: [
            SubCategory.WEARABLES_SMARTWATCHES,
            SubCategory.WEARABLES_FITNESS_TRACKERS,
            SubCategory.WEARABLES_ACCESSORIES
        ]
    },
    {
        id: 11,
        category: Category.ACCESSORIES,
        sub_categories: [
            SubCategory.ACCESSORIES_KEYBOARDS,
            SubCategory.ACCESSORIES_MICE,
            SubCategory.ACCESSORIES_POWERBANKS
        ]
    },
    {
        id: 12,
        category: Category.PRINTERS,
        sub_categories: [] // У принтеров нет подкатегорий
    },
    {
        id: 13,
        category: Category.MONITORS,
        sub_categories: [
            SubCategory.MONITORS_4K,
            SubCategory.MONITORS_ULTRAWIDE,
            SubCategory.MONITORS_GAMING
        ]
    },
    {
        id: 14,
        category: Category.NETWORKING_DEVICES,
        sub_categories: [] // У сетевых устройств нет подкатегорий
    },
    {
        id: 15,
        category: Category.STORAGE_DEVICES,
        sub_categories: [
            SubCategory.STORAGE_DEVICES_EXTERNAL,
            SubCategory.STORAGE_DEVICES_INTERNAL,
            SubCategory.STORAGE_DEVICES_PORTABLE
        ]
    },
];

export const category_ru: ICategory[] = data;