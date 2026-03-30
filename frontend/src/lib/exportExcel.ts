import * as XLSX from 'xlsx'
import { Transaction } from '@/types'
import { categoryLabels, typeLabels } from './categoryLabels'
import { formatDate } from './formatDate'
import { formatCurrency } from './formatCurrency'

export function exportTransactionsExcel(transactions: Transaction[]) {
    if (transactions.length === 0) return

    const headers = ['Название', 'Категория', 'Тип', 'Дата', 'Сумма', 'Описание']

    const rows = transactions.map((t) => [
        t.title,
        categoryLabels[t.category] || t.category,
        typeLabels[t.type] || t.type,
        formatDate(t.date),
        `${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}`,
        t.description || '',
    ])

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])

    ws['!cols'] = [
        { wch: 30 }, // Название
        { wch: 15 }, // Категория
        { wch: 10 }, // Тип
        { wch: 12 }, // Дата
        { wch: 18 }, // Сумма
        { wch: 30 }, // Описание
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Транзакции')

    const date = new Date().toISOString().slice(0, 10)
    XLSX.writeFile(wb, `транзакции_${date}.xlsx`)
}
