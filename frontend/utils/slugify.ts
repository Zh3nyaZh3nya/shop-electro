export function slugify(str: unknown): string {
    if (typeof str !== 'string') {
        try {
            str = String(str ?? '')
        } catch {
            return ''
        }
    }

    const map: Record<string, string> = {
        "А": 'A', "Б": 'B', "В": 'V', "Г": 'G', "Д": 'D', "Е": 'E', "Ё": 'E', "Ж": 'Zh', "З": 'Z', "И": 'I',
        "Й": 'Y', "К": 'K', "Л": 'L', "М": 'M', "Н": 'N', "О": 'O', "П": 'P', "Р": 'R', "С": 'S', "Т": 'T',
        "У": 'U', "Ф": 'F', "Х": 'Kh', "Ц": 'Ts', "Ч": 'Ch', "Ш": 'Sh', "Щ": 'Shch', "Ъ": '', "Ы": 'Y',
        "Ь": '', "Э": 'E', "Ю": 'Yu', "Я": 'Ya',
        "а": 'a', "б": 'b', "в": 'v', "г": 'g', "д": 'd', "е": 'e', "ё": 'e', "ж": 'zh', "з": 'z', "и": 'i',
        "й": 'y', "к": 'k', "л": 'l', "м": 'm', "н": 'n', "о": 'o', "п": 'p', "р": 'r', "с": 's', "т": 't',
        "у": 'u', "ф": 'f', "х": 'kh', "ц": 'ts', "ч": 'ch', "ш": 'sh', "щ": 'shch', "ъ": '', "ы": 'y',
        "ь": '', "э": 'e', "ю": 'yu', "я": 'ya',
    }

    const transliterated = str
        .split('')
        .map(char => map[char] ?? char)
        .join('')

    return transliterated
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s.-]/g, '')
        .replace(/[.\s]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase()
}
