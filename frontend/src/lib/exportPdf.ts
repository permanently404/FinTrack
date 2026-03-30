import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Transaction, TransactionFilters } from '@/types'
import { categoryLabels, typeLabels } from './categoryLabels'
import { formatDate } from './formatDate'
import { formatCurrency } from './formatCurrency'
import { robotoRegularBase64 } from './fonts/roboto-regular'

function setupFont(doc: jsPDF) {
    doc.addFileToVFS('Roboto-Regular.ttf', robotoRegularBase64)
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
    doc.setFont('Roboto')
}

function buildFilterSummary(filters: TransactionFilters): string {
    const parts: string[] = []

    if (filters.type !== 'all') {
        parts.push(`Тип: ${typeLabels[filters.type] || filters.type}`)
    }
    if (filters.category !== 'all') {
        parts.push(`Категория: ${categoryLabels[filters.category] || filters.category}`)
    }
    if (filters.dateFrom) {
        parts.push(`С: ${formatDate(filters.dateFrom)}`)
    }
    if (filters.dateTo) {
        parts.push(`По: ${formatDate(filters.dateTo)}`)
    }
    if (filters.search) {
        parts.push(`Поиск: "${filters.search}"`)
    }

    return parts.length > 0 ? parts.join(' | ') : 'Все транзакции'
}

export function exportTransactionsPdf(transactions: Transaction[], filters: TransactionFilters) {
    if (transactions.length === 0) return

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    setupFont(doc)

    // Header
    doc.setFontSize(18)
    doc.text('Отчёт по транзакциям', 14, 18)

    doc.setFontSize(10)
    doc.setTextColor(107, 114, 128) // text-muted gray
    const exportDate = `Дата экспорта: ${formatDate(new Date().toISOString().slice(0, 10))}`
    doc.text(exportDate, 14, 26)

    const filterText = buildFilterSummary(filters)
    doc.text(`Фильтры: ${filterText}`, 14, 32)
    doc.text(`Всего: ${transactions.length} транзакций`, 14, 38)

    doc.setTextColor(0, 0, 0) // reset to black

    // Table
    const columns = ['Название', 'Категория', 'Тип', 'Дата', 'Сумма', 'Описание']

    const rows = transactions.map((t) => [
        t.title,
        categoryLabels[t.category] || t.category,
        typeLabels[t.type] || t.type,
        formatDate(t.date),
        `${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}`,
        t.description || '',
    ])

    const totalPages = { count: 0 }

    autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 44,
        styles: {
            font: 'Roboto',
            fontSize: 9,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [34, 197, 94], // #22c55e — primary green
            textColor: [255, 255, 255],
            fontStyle: 'normal',
        },
        columnStyles: {
            0: { cellWidth: 70 },  // Название
            1: { cellWidth: 30 },  // Категория
            2: { cellWidth: 25 },  // Тип
            3: { cellWidth: 30 },  // Дата
            4: { cellWidth: 35, halign: 'right' }, // Сумма
            5: { cellWidth: 'auto' }, // Описание
        },
        showHead: 'everyPage',
        didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 4) {
                const text = String(data.cell.raw)
                if (text.startsWith('+')) {
                    data.cell.styles.textColor = [34, 197, 94]  // green
                } else {
                    data.cell.styles.textColor = [239, 68, 68]  // red
                }
            }
        },
        didDrawPage: () => {
            totalPages.count++
        },
    })

    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(107, 114, 128)
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        doc.text(
            `Страница ${i} из ${pageCount}`,
            pageWidth / 2,
            pageHeight - 8,
            { align: 'center' },
        )
    }

    const date = new Date().toISOString().slice(0, 10)
    doc.save(`транзакции_${date}.pdf`)
}
