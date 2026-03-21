export function randomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomDate(monthsAgo: number): string {
    const date = new Date()
    date.setMonth(date.getMonth() - randomBetween(0, monthsAgo))
    date.setDate(randomBetween(1, 28))
    return date.toISOString().split('T')[0]
}