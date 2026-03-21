'use client'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { Transaction } from '@/types'
import { getCategoryExpenses } from '@/lib/chartHelpers'

ChartJS.register(ArcElement, Tooltip, Legend)

const categoryLabels: Record<string, string> = {
    food: 'Еда',
    transport: 'Транспорт',
    entertainment: 'Развлечения',
    health: 'Здоровье',
    shopping: 'Покупки',
    other: 'Прочее',
}

const colors = ['#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#f59e0b', '#6b7280']

export function ExpenseChart({ transactions }: { transactions: Transaction[] }) {
    const expenses = getCategoryExpenses(transactions)
    const entries = Object.entries(expenses).sort(([, a], [, b]) => b - a)

    const data = {
        labels: entries.map(([key]) => categoryLabels[key] || key),
        datasets: [
            {
                data: entries.map(([, value]) => value),
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#ffffff',
            },
        ],
    }

    return (
        <Doughnut
            data={data}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
            }}
        />
    )
}