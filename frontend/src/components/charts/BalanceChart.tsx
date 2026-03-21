'use client'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Transaction } from '@/types'
import { getMonthlyBalance } from '@/lib/chartHelpers'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface Props {
    transactions: Transaction[]
}

export function BalanceChart({ transactions }: Props) {
    const monthlyData = getMonthlyBalance(transactions)

    const data = {
        labels: monthlyData.map((d) => d.month),
        datasets: [
            {
                label: 'Доходы',
                data: monthlyData.map((d) => d.income),
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Расходы',
                data: monthlyData.map((d) => d.expense),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const },
        },
        scales: {
            y: {
                ticks: {
                    callback: (value: string | number) => `${(Number(value) / 1000).toFixed(0)}к ₽`,
                },
            },
        },
    }

    return <Line data={data} options={options} />
}