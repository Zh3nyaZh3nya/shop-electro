import { ITopBlock, Category } from "~/types";

const data: ITopBlock[] = [
    {
        id: 1,
        title: "Смартфоны",
        subtitle: "Выберите лучшие модели для повседневной жизни и работы.",
        link: "/catalog/smartphones",
        category: Category.SMARTPHONES,
        background: "#FFDDC1" // Светлый оранжевый
    },
    {
        id: 2,
        title: "Ноутбуки",
        subtitle: "Найдите подходящий ноутбук для игр, работы и учебы.",
        link: "/catalog/laptops",
        category: Category.LAPTOPS,
        background: "#C1FFD7" // Светлый зеленый
    },
    {
        id: 3,
        title: "Планшеты",
        subtitle: "Мобильные устройства для работы, учебы и развлечений.",
        link: "/catalog/tablets",
        category: Category.TABLETS,
        background: "#CCE5FF" // Светлый голубой
    },
    {
        id: 4,
        title: "Телевизоры",
        subtitle: "Откройте для себя технологии будущего с нашими телевизорами.",
        link: "/catalog/televisions",
        category: Category.TELEVISIONS,
        background: "#FFFACD" // Светлый желтый
    },
    {
        id: 5,
        title: "Наушники",
        subtitle: "Погрузитесь в мир музыки с качественным звуком.",
        link: "/catalog/headphones",
        category: Category.HEADPHONES,
        background: "#FFD1DC" // Светлый розовый
    },
    {
        id: 6,
        title: "Камеры",
        subtitle: "Для профессионалов и любителей фотографии.",
        link: "/catalog/cameras",
        category: Category.CAMERAS,
        background: "#E5CCFF" // Светлый фиолетовый
    },
    {
        id: 7,
        title: "Игровые консоли",
        subtitle: "Игровые консоли для настоящих геймеров.",
        link: "/catalog/gaming_consoles",
        category: Category.GAMING_CONSOLES,
        background: "#E3E3E3" // Светлый серый
    },
    {
        id: 8,
        title: "Бытовая техника",
        subtitle: "Современные решения для вашего дома.",
        link: "/catalog/home_appliances",
        category: Category.HOME_APPLIANCES,
        background: "#D4E6A5" // Светлый салатовый
    },
    {
        id: 9,
        title: "Умный дом",
        subtitle: "Инновации для вашего удобства и безопасности.",
        link: "/catalog/smart_home_devices",
        category: Category.SMART_HOME_DEVICES,
        background: "#BFD8D2" // Светлый бирюзовый
    },
    {
        id: 10,
        title: "Носимые устройства",
        subtitle: "Устройства для здоровья, спорта и удобства.",
        link: "/catalog/wearables",
        category: Category.WEARABLES,
        background: "#FFE4B5" // Светлый персиковый
    },
    {
        id: 11,
        title: "Аксессуары",
        subtitle: "Дополните свои устройства полезными аксессуарами.",
        link: "/catalog/accessories",
        category: Category.ACCESSORIES,
        background: "#FFF5EE" // Светлый кремовый
    },
    {
        id: 12,
        title: "Принтеры",
        subtitle: "Устройства для печати дома и в офисе.",
        link: "/catalog/printers",
        category: Category.PRINTERS,
        background: "#F5F5DC" // Светлый бежевый
    },
    {
        id: 13,
        title: "Мониторы",
        subtitle: "Качественные экраны для работы и развлечений.",
        link: "/catalog/monitors",
        category: Category.MONITORS,
        background: "#F0FFFF" // Светлый голубовато-белый
    },
    {
        id: 14,
        title: "Сетевые устройства",
        subtitle: "Для надежного и быстрого подключения к интернету.",
        link: "/catalog/networking_devices",
        category: Category.NETWORKING_DEVICES,
        background: "#F8E8C1" // Светлый золотистый
    },
    {
        id: 15,
        title: "Устройства хранения",
        subtitle: "Долговечные и надежные решения для ваших данных.",
        link: "/catalog/storage_devices",
        category: Category.STORAGE_DEVICES,
        background: "#E5E5E5" // Светлый серебристый
    }
];

export const main_blocks_ru: ITopBlock[] = data;
