'use client'
import { useMemo } from 'react'
import { useTransactions } from '@/api/transactions'
import { Card } from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { BalanceChart } from '@/components/charts/BalanceChart'
import { ExpenseChart } from '@/components/charts/ExpenseChart'
import { TransactionsTable } from '@/components/transactions/TransactionsTable'
import { formatCurrency } from '@/lib/formatCurrency'
import { Header } from '@/components/layout/Header'
export function DashboardPage() {
    const { data: response, isLoading } = useTransactions()

    const displayData = response?.data || []

    const totalIncome = useMemo(() => displayData.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0), [displayData])
    const totalExpense = useMemo(() => displayData.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [displayData])
    const balance = totalIncome - totalExpense

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
        )
    }

    return (
        <div className="min-h-full lg:h-full lg:overflow-hidden flex flex-col p-4 md:p-6 gap-3 md:gap-4">
            <div className="flex flex-none justify-between items-center">
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Дашборд</h1>
                <Header />
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 flex-none">
                <Card className="p-3 md:p-4">
                    <p className="text-xs md:text-sm font-semibold text-foreground">Баланс</p>
                    <p className={`text-base md:text-xl font-bold mt-1 ${balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {formatCurrency(balance)}
                    </p>
                </Card>
                <Card className="p-3 md:p-4">
                    <p className="text-xs md:text-sm font-semibold text-foreground">Доходы</p>
                    <p className="text-base md:text-xl font-bold mt-1 text-green-600">{formatCurrency(totalIncome)}</p>
                </Card>
                <Card className="p-3 md:p-4">
                    <p className="text-xs md:text-sm font-semibold text-foreground">Расходы</p>
                    <p className="text-base md:text-xl font-bold mt-1 text-red-500">{formatCurrency(totalExpense)}</p>
                </Card>
            </div>

            {/* Charts & table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:flex-1 lg:min-h-0">
                <div className="lg:col-span-2 flex flex-col gap-4 lg:min-h-0">
                    <Card title="Доходы и расходы по месяцам" className="p-4 flex flex-col lg:flex-1 lg:min-h-0">
                        <div className="relative h-48 sm:h-56 lg:h-auto lg:flex-1 lg:min-h-0">
                            <BalanceChart transactions={displayData} />
                        </div>
                    </Card>
                    <Card title="Последние транзакции" className="p-4 overflow-hidden flex-none">
                        <TransactionsTable transactions={displayData} total={displayData.length} limit={4} />
                    </Card>
                </div>

                <Card title="Расходы по категориям" className="p-4 flex flex-col lg:min-h-0">
                    <div className="relative h-56 sm:h-64 lg:h-auto lg:flex-1 lg:min-h-0 flex items-center justify-center">
                        <ExpenseChart transactions={displayData} />
                    </div>
                </Card>
            </div>
        </div>
    )
}
