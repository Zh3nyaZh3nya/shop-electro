// Enum
export enum Category {
    SMARTPHONES = 'category.smartphones',
    LAPTOPS = 'category.laptops',
    TABLETS = 'category.tablets',
    TELEVISIONS = 'category.televisions',
    HEADPHONES = 'category.headphones',
    CAMERAS = 'category.cameras',
    GAMING_CONSOLES = 'category.gaming_consoles',
    HOME_APPLIANCES = 'category.home_appliances',
    SMART_HOME_DEVICES = 'category.smart_home_devices',
    WEARABLES = 'category.wearables',
    ACCESSORIES = 'category.accessories',
    PRINTERS = 'category.printers',
    MONITORS = 'category.monitors',
    NETWORKING_DEVICES = 'category.networking_devices',
    STORAGE_DEVICES = 'category.storage_devices'
}
export enum SubCategory {
    SMARTPHONES_ANDROID = 'android',
    SMARTPHONES_IOS = 'ios',
    SMARTPHONES_ACCESSORIES = 'accessories',

    LAPTOPS_ULTRABOOKS = 'ultrabooks',
    LAPTOPS_GAMING = 'gaming-laptops',
    LAPTOPS_BUSINESS = 'business-laptops',
    LAPTOPS_ACCESSORIES = 'laptop-accessories',

    TELEVISIONS_LED = 'led',
    TELEVISIONS_OLED = 'oled',
    TELEVISIONS_SMART = 'smart-tvs',

    CAMERAS_DSLR = 'dslr',
    CAMERAS_MIRRORLESS = 'mirrorless',
    CAMERAS_ACTION = 'action-cameras',

    HOME_APPLIANCES_VACUUMS = 'vacuums',
    HOME_APPLIANCES_KITCHEN = 'kitchen-appliances',
    HOME_APPLIANCES_LAUNDRY = 'laundry-appliances',

    SMART_HOME_LIGHTING = 'lighting',
    SMART_HOME_SECURITY = 'security',
    SMART_HOME_CONTROLS = 'controls',

    GAMING_CONSOLES_HANDHELD = 'handheld',
    GAMING_CONSOLES_HOME = 'home-consoles',
    GAMING_CONSOLES_ACCESSORIES = 'console-accessories',

    WEARABLES_SMARTWATCHES = 'smartwatches',
    WEARABLES_FITNESS_TRACKERS = 'fitness-trackers',
    WEARABLES_ACCESSORIES = 'wearable-accessories',

    ACCESSORIES_KEYBOARDS = 'keyboards',
    ACCESSORIES_MICE = 'mice',
    ACCESSORIES_POWERBANKS = 'powerbanks',

    MONITORS_4K = '4k-monitors',
    MONITORS_ULTRAWIDE = 'ultrawide-monitors',
    MONITORS_GAMING = 'gaming-monitors',

    STORAGE_DEVICES_EXTERNAL = 'external-storage',
    STORAGE_DEVICES_INTERNAL = 'internal-storage',
    STORAGE_DEVICES_PORTABLE = 'portable-storage'
}

export enum Currency {
    KZT = "₸", // Казахстанский тенге
    USD = "$", // Доллар США
    EUR = "€", // Евро
    RUB = "₽", // Российский рубль
}

// Type
type HexDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type FullStrictHexColor =
    | `#${HexDigit}${HexDigit}${HexDigit}`
    | `#${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}`;

// Interface
export interface ICategory {
    id: number
    category: Category
    sub_categories: SubCategory[]
}

export interface ITopBlock {
    id: number
    title: string
    subtitle: string
    link: `/catalog/${string}`
    category: string
    background: FullStrictHexColor
}

export interface IBrand {
    id: number
    slug: string
    name: string
    logo: string
    categories: ICategory[]
}

export interface IProduct {
    id: number
    slug: string
    preview_image: [string, string, string]
    category: Category
    sub_category?: SubCategory
    images: string[]
    title: string
    price: number
    currency: Currency
    rates: number
    count_rates: number,
    is_stock: boolean
    delivery: boolean
    delivery_time?: string
}

export interface ICategoryWithProducts extends ICategory {
    sub_categories: {
        sub_category: SubCategory;
        products: IProduct[];
    }[];
}