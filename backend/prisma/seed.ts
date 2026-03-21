import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Category = 'food' | 'transport' | 'entertainment' | 'health' | 'shopping' | 'salary' | 'other'
type TransactionType = 'income' | 'expense'

const TITLES: Record<Category, string[]> = {
    food: ['Пятёрочка', 'ВкусВилл', 'Яндекс Еда', 'Кофе', 'Ресторан'],
    transport: ['Метро', 'Яндекс Такси', 'Бензин', 'Каршеринг'],
    entertainment: ['Кино', 'Netflix', 'Spotify', 'Steam', 'Концерт'],
    health: ['Аптека', 'Клиника', 'Спортзал', 'Витамины'],
    shopping: ['Wildberries', 'OZON', 'Одежда', 'Электроника'],
    salary: ['Зарплата', 'Аванс', 'Премия', 'Фриланс'],
    other: ['Перевод', 'Прочее', 'Разное'],
}

const EXPENSE_CATEGORIES: Category[] = ['food', 'transport', 'entertainment', 'health', 'shopping', 'other']
const INCOME_CATEGORIES: Category[] = ['salary']

function randomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function generateDate(): string {
    const now = new Date()
    const daysAgo = randomBetween(0, 180)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    return date.toISOString().slice(0, 10)
}

function generateTransaction() {
    const isIncome = Math.random() < 0.2
    const type: TransactionType = isIncome ? 'income' : 'expense'
    const category: Category = isIncome
        ? randomItem(INCOME_CATEGORIES)
        : randomItem(EXPENSE_CATEGORIES)

    return {
        title: randomItem(TITLES[category]),
        amount: isIncome ? randomBetween(10000, 80000) : randomBetween(100, 8000),
        type,
        category,
        date: generateDate(),
    }
}

async function main() {
    console.log('Очищаем таблицу...')
    await prisma.transaction.deleteMany()

    console.log('Создаём 80 транзакций...')
    const data = Array.from({ length: 80 }, generateTransaction)
    await prisma.transaction.createMany({ data })

    console.log('Готово!')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
