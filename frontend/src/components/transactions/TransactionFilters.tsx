'use client'
import { useTransactionStore } from '@/store/transactionStore'
import { TransactionCategory, TransactionType } from '@/types'

export function TransactionFilters() {
    const { filters, setFilters, resetFilters } = useTransactionStore()

    const inputClasses = "border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-foreground w-full sm:w-auto"

    return (
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-center">
            <input
                type="text"
                placeholder="Поиск по названию..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
                className={inputClasses}
            />

            <div className="grid grid-cols-2 sm:contents gap-3">
                <select
                    value={filters.type}
                    onChange={(e) => setFilters({ type: e.target.value as TransactionType | 'all', page: 1 })}
                    className={inputClasses}
                >
                    <option value="all">Все типы</option>
                    <option value="income">Доходы</option>
                    <option value="expense">Расходы</option>
                </select>

                <select
                    value={filters.category}
                    onChange={(e) => setFilters({ category: e.target.value as TransactionCategory | 'all', page: 1 })}
                    className={inputClasses}
                >
                    <option value="all">Все категории</option>
                    <option value="food">Еда</option>
                    <option value="transport">Транспорт</option>
                    <option value="entertainment">Развлечения</option>
                    <option value="health">Здоровье</option>
                    <option value="shopping">Покупки</option>
                    <option value="salary">Зарплата</option>
                    <option value="other">Прочее</option>
                </select>
            </div>

            <div className="grid grid-cols-2 sm:contents gap-3">
                <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ dateFrom: e.target.value, page: 1 })}
                    className={inputClasses}
                />

                <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ dateTo: e.target.value, page: 1 })}
                    className={inputClasses}
                />
            </div>

            <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors underline"
            >
                Сбросить
            </button>
        </div>
    )
}
