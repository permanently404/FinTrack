import { categoryLabels, typeLabels } from '@/lib/categoryLabels'

const variants = {
    income: 'bg-green-100 text-green-700',
    expense: 'bg-red-100 text-red-700',
    food: 'bg-orange-100 text-orange-700',
    transport: 'bg-blue-100 text-blue-700',
    entertainment: 'bg-purple-100 text-purple-700',
    health: 'bg-pink-100 text-pink-700',
    shopping: 'bg-yellow-100 text-yellow-700',
    salary: 'bg-green-100 text-green-700',
    other: 'bg-gray-100 text-gray-700',
}

const labels: Record<string, string> = { ...categoryLabels, ...typeLabels }

interface BadgeProps {
    variant: keyof typeof variants
}

export function Badge({ variant }: BadgeProps) {
    return (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${variants[variant]}`}>
            {labels[variant]}
        </span>
    )
}