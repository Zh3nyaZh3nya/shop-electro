export function autoCast(value: string): any {
    if (value === 'true') return true
    if (value === 'false') return false
    if (!isNaN(Number(value)) && value.trim() !== '') return Number(value)
    return value
}