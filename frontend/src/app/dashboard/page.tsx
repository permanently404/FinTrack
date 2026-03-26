import { cookies } from 'next/headers'
import { DashboardPage } from "@/components/dashboard/DashboardPage"
import type { Transaction, PaginatedResponse } from "@/types"

const API_URL = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export default async function Dashboard() {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    let initialData: PaginatedResponse<Transaction> | undefined

    try {
        const res = await fetch(`${API_URL}/api/transactions?limit=1000`, {
            cache: 'no-store',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (res.ok) initialData = await res.json()
    } catch {}

    return <DashboardPage initialData={initialData} />
}
