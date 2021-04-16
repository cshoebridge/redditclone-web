const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')

export const formatDate = (unformatted: string): string => {
    const dateObj = new Date(parseInt(unformatted));
    return `${zeroPad(dateObj.getUTCDate(), 2)}-${zeroPad(dateObj.getUTCMonth(), 2)}-${dateObj.getUTCFullYear()}`
} 