import { slugify } from '~/utils/slugify'

export function processFiles(
    input: File | string | (File | string)[],
    prefix = 'file'
): File | string | (File | string)[] {
    const files = Array.isArray(input) ? input : [input]

    const processed = files.map((file) => {
        if (typeof file === 'string') {
            return file
        }

        const ext = file.name.split('.').pop()?.toLowerCase() || (file.type.startsWith('video/') ? 'mp4' : 'webp')
        const baseName = slugify(file.name.split('.').slice(0, -1).join('-')) || prefix
        const safeName = `${baseName}-${Date.now()}.${ext}`

        return new File([file], safeName, { type: file.type })
    })

    return Array.isArray(input) ? processed : processed[0]
}

// 1 файл
export function processFileWithFlags(
    input: File | string | (File | string)[] | null | undefined,
    title = '',
    isImage = false
): { processedFile: File | null, clearImage: boolean, clearVideo: boolean } {
    const rawFile = Array.isArray(input)
        ? input[0]
        : input

    let processedFile: File | null = null
    let clearImage = false
    let clearVideo = false

    if (rawFile instanceof File) {
        const ext = rawFile.name.split('.').pop()?.toLowerCase() || (isImage ? 'webp' : 'mp4')
        const baseName = slugify(title || (isImage ? 'image' : 'video'))
        const safeName = `${baseName}-${Date.now()}.${ext}`
        processedFile = new File([rawFile], safeName, { type: rawFile.type })

        if (processedFile.type.startsWith('video/')) {
            clearImage = true
        } else if (processedFile.type.startsWith('image/')) {
            clearVideo = true
        }
    }

    return { processedFile, clearImage, clearVideo }
}
