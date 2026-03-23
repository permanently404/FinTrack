import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Header } from '@/components/layout/Header'
import { formatCurrency } from '@/lib/formatCurrency'
import { formatDate } from '@/lib/formatDate'
import type { Transaction, TransactionCategory, PaginatedResponse } from '@/types'

export const dynamic = 'force-dynamic'

const MONTH_NAMES = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

const API_URL = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

function parseMonth(month: string): { year: number; monthIndex: number; dateFrom: string; dateTo: string } | null {
    const match = month.match(/^(\d{4})-(\d{2})$/)
    if (!match) return null

    const year = parseInt(match[1])
    const monthIndex = parseInt(match[2]) - 1
    if (monthIndex < 0 || monthIndex > 11) return null

    const dateFrom = `${year}-${match[2]}-01`
    const lastDay = new Date(year, monthIndex + 1, 0).getDate()
    const dateTo = `${year}-${match[2]}-${String(lastDay).padStart(2, '0')}`

    return { year, monthIndex, dateFrom, dateTo }
}

type PageProps = { params: Promise<{ month: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { month } = await params
    const parsed = parseMonth(month)
    if (!parsed) return { title: 'Отчёт не найден — FinTrack' }

    return {
        title: `${MONTH_NAMES[parsed.monthIndex]} ${parsed.year} — FinTrack`,
        description: `Финансовый отчёт за ${MONTH_NAMES[parsed.monthIndex].toLowerCase()} ${parsed.year}`,
    }
}

async function fetchReport(dateFrom: string, dateTo: string) {
    const [transactionsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/transactions?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=1000`, { cache: 'no-store' }),
        fetch(`${API_URL}/api/transactions/stats?dateFrom=${dateFrom}&dateTo=${dateTo}`, { cache: 'no-store' }),
    ])

    if (!transactionsRes.ok || !statsRes.ok) return null

    const transactions: PaginatedResponse<Transaction> = await transactionsRes.json()
    const stats: { income: number; expense: number; balance: number } = await statsRes.json()

    return { transactions: transactions.data, stats }
}

type CategoryData = { income: number; expense: number; count: number }

function getCategoryBreakdown(transactions: Transaction[]): [TransactionCategory, CategoryData][] {
    const breakdown = {} as Record<TransactionCategory, CategoryData>

    for (const t of transactions) {
        if (!breakdown[t.category]) breakdown[t.category] = { income: 0, expense: 0, count: 0 }
        breakdown[t.category].count++
        if (t.type === 'income') breakdown[t.category].income += t.amount
        else breakdown[t.category].expense += t.amount
    }

    return (Object.entries(breakdown) as [TransactionCategory, CategoryData][])
        .sort(([, a], [, b]) => b.expense - a.expense)
}

export default async function ReportPage({ params }: PageProps) {
    const { month } = await params
    const parsed = parseMonth(month)
    if (!parsed) notFound()

    const report = await fetchReport(parsed.dateFrom, parsed.dateTo)
    if (!report) notFound()

    const { transactions, stats } = report
    const categoryBreakdown = getCategoryBreakdown(transactions)
    const monthLabel = `${MONTH_NAMES[parsed.monthIndex]} ${parsed.year}`

    const prevMonth = parsed.monthIndex === 0
        ? `${parsed.year - 1}-12`
        : `${parsed.year}-${String(parsed.monthIndex).padStart(2, '0')}`
    const nextMonth = parsed.monthIndex === 11
        ? `${parsed.year + 1}-01`
        : `${parsed.year}-${String(parsed.monthIndex + 2).padStart(2, '0')}`

    return (
        <div className="min-h-full flex flex-col">
            <div className="sticky top-0 z-10 bg-surface flex justify-between items-center p-4 md:p-6 pb-3">
                <div className="flex items-center gap-3">
                    <a href={`/reports/${prevMonth}`} className="text-muted hover:text-foreground transition-colors text-lg">&larr;</a>
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">{monthLabel}</h1>
                    <a href={`/reports/${nextMonth}`} className="text-muted hover:text-foreground transition-colors text-lg">&rarr;</a>
                </div>
                <Header />
            </div>

            <div className="flex flex-col p-4 md:px-6 pt-0 gap-4 md:gap-6">

            <div className="grid grid-cols-3 gap-2 md:gap-4">
                <Card className="p-3 md:p-4">
                    <p className="text-xs md:text-sm font-semibold text-foreground">Баланс</p>
                    <p className={`text-base md:text-xl font-bold mt-1 ${stats.balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {formatCurrency(stats.balance)}
                    </p>
                </Card>
                <Card className="p-3 md:p-4">
                    <p className="text-xs md:text-sm font-semibold text-foreground">Доходы</p>
                    <p className="text-base md:text-xl font-bold mt-1 text-green-600">{formatCurrency(stats.income)}</p>
                </Card>
                <Card className="p-3 md:p-4">
                    <p className="text-xs md:text-sm font-semibold text-foreground">Расходы</p>
                    <p className="text-base md:text-xl font-bold mt-1 text-red-500">{formatCurrency(stats.expense)}</p>
                </Card>
            </div>

            {categoryBreakdown.length > 0 && (
                <section>
                    <h2 className="text-lg font-semibold text-foreground mb-3">По категориям</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {categoryBreakdown.map(([category, data]) => (
                            <Card key={category} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Badge variant={category as TransactionCategory} />
                                    <span className="text-sm text-muted">{data.count} операций</span>
                                </div>
                                <div className="text-right">
                                    {data.expense > 0 && <p className="text-sm font-medium text-red-500">-{formatCurrency(data.expense)}</p>}
                                    {data.income > 0 && <p className="text-sm font-medium text-green-600">+{formatCurrency(data.income)}</p>}
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">Транзакции ({transactions.length})</h2>
                {transactions.length === 0 ? (
                    <Card className="p-8 text-center">
                        <p className="text-muted">Нет транзакций за этот месяц</p>
                    </Card>
                ) : (
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border text-left">
                                        <th className="p-3 font-medium text-muted">Дата</th>
                                        <th className="p-3 font-medium text-muted">Название</th>
                                        <th className="p-3 font-medium text-muted">Категория</th>
                                        <th className="p-3 font-medium text-muted text-right">Сумма</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((t) => (
                                        <tr key={t.id} className="border-b border-border last:border-0">
                                            <td className="p-3 text-muted whitespace-nowrap">{formatDate(t.date)}</td>
                                            <td className="p-3 text-foreground">{t.title}</td>
                                            <td className="p-3"><Badge variant={t.category} /></td>
                                            <td className={`p-3 text-right font-medium whitespace-nowrap ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </section>
            </div>
        </div>
    )
}
