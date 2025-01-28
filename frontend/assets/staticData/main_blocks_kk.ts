import { ITopBlock, Category } from "~/types";

const data: ITopBlock[] = [
    {
        id: 1,
        title: "Смартфондар",
        subtitle: "Күнделікті өмір мен жұмыс үшін ең жақсы үлгілерді таңдаңыз.",
        link: "/catalog/smartphones",
        category: Category.SMARTPHONES,
        background: "#FFDDC1" // Ашық қызғылт сары
    },
    {
        id: 2,
        title: "Ноутбуктер",
        subtitle: "Ойынға, жұмысқа және оқуға арналған ноутбукті табыңыз.",
        link: "/catalog/laptops",
        category: Category.LAPTOPS,
        background: "#C1FFD7" // Ашық жасыл
    },
    {
        id: 3,
        title: "Планшеттер",
        subtitle: "Жұмысқа, оқуға және ойын-сауыққа арналған мобильді құрылғылар.",
        link: "/catalog/tablets",
        category: Category.TABLETS,
        background: "#CCE5FF" // Ашық көк
    },
    {
        id: 4,
        title: "Теледидарлар",
        subtitle: "Болашақ технологияларын біздің теледидарлармен ашыңыз.",
        link: "/catalog/televisions",
        category: Category.TELEVISIONS,
        background: "#FFFACD" // Ашық сары
    },
    {
        id: 5,
        title: "Құлаққаптар",
        subtitle: "Жоғары сапалы дыбыспен музыканың әлеміне еніңіз.",
        link: "/catalog/headphones",
        category: Category.HEADPHONES,
        background: "#FFD1DC" // Ашық қызғылт
    },
    {
        id: 6,
        title: "Камералар",
        subtitle: "Фотосурет әуесқойлары мен мамандарға арналған.",
        link: "/catalog/cameras",
        category: Category.CAMERAS,
        background: "#E5CCFF" // Ашық күлгін
    },
    {
        id: 7,
        title: "Ойын консольдері",
        subtitle: "Нағыз геймерлерге арналған ойын консольдері.",
        link: "/catalog/gaming_consoles",
        category: Category.GAMING_CONSOLES,
        background: "#E3E3E3" // Ашық сұр
    },
    {
        id: 8,
        title: "Тұрмыстық техника",
        subtitle: "Үйіңіз үшін заманауи шешімдер.",
        link: "/catalog/home_appliances",
        category: Category.HOME_APPLIANCES,
        background: "#D4E6A5" // Ашық жасыл-сары
    },
    {
        id: 9,
        title: "Ақылды үй",
        subtitle: "Қолайлылық пен қауіпсіздік үшін инновациялар.",
        link: "/catalog/smart_home_devices",
        category: Category.SMART_HOME_DEVICES,
        background: "#BFD8D2" // Ашық көгілдір
    },
    {
        id: 10,
        title: "Киілетін құрылғылар",
        subtitle: "Денсаулық, спорт және ыңғайлылыққа арналған құрылғылар.",
        link: "/catalog/wearables",
        category: Category.WEARABLES,
        background: "#FFE4B5" // Ашық шабдалы
    },
    {
        id: 11,
        title: "Аксессуарлар",
        subtitle: "Құрылғыларыңызды пайдалы аксессуарлармен толықтырыңыз.",
        link: "/catalog/accessories",
        category: Category.ACCESSORIES,
        background: "#FFF5EE" // Ашық крем түсі
    },
    {
        id: 12,
        title: "Принтерлер",
        subtitle: "Үйде және кеңседе басып шығаруға арналған құрылғылар.",
        link: "/catalog/printers",
        category: Category.PRINTERS,
        background: "#F5F5DC" // Ашық бежевый
    },
    {
        id: 13,
        title: "Мониторлар",
        subtitle: "Жұмыс пен ойын-сауыққа арналған сапалы экрандар.",
        link: "/catalog/monitors",
        category: Category.MONITORS,
        background: "#F0FFFF" // Ашық көгілдір-ақ
    },
    {
        id: 14,
        title: "Желілік құрылғылар",
        subtitle: "Интернетке сенімді және жылдам қосылу үшін.",
        link: "/catalog/networking_devices",
        category: Category.NETWORKING_DEVICES,
        background: "#F8E8C1" // Ашық алтын түсі
    },
    {
        id: 15,
        title: "Деректер сақтау құрылғылары",
        subtitle: "Деректеріңіз үшін сенімді және ұзақ мерзімді шешімдер.",
        link: "/catalog/storage_devices",
        category: Category.STORAGE_DEVICES,
        background: "#E5E5E5" // Ашық күміс түсі
    }
];

export const main_blocks_kk: ITopBlock[] = data;
