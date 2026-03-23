import { DashboardPage } from "@/components/dashboard/DashboardPage"
import type { Transaction, PaginatedResponse } from "@/types"

const API_URL = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export default async function Dashboard() {
    let initialData: PaginatedResponse<Transaction> | undefined

    try {
        const res = await fetch(`${API_URL}/api/transactions?limit=1000`, { cache: 'no-store' })
        if (res.ok) initialData = await res.json()
    } catch {}

    return <DashboardPage initialData={initialData} />
}
