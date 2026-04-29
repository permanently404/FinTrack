'use client'
import { useState } from 'react'
import { useAddTransaction } from '@/api/transactions'
import { TransactionCategory, TransactionType } from '@/types'

function getLocalDateString() {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function AddTransactionModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [form, setForm] = useState({
        title: '',
        amount: '',
        type: 'expense' as TransactionType,
        category: 'other' as TransactionCategory,
        date: getLocalDateString(),
    })

    const { mutate: addTransaction, isPending } = useAddTransaction()

    function handleSubmit() {
        if (!form.title || !form.amount) return

        addTransaction(
            {
                title: form.title,
                amount: Number(form.amount),
                type: form.type,
                category: form.category,
                date: form.date,
            },
            {
                onSuccess: () => {
                    setIsOpen(false)
                    setForm({ title: '', amount: '', type: 'expense', category: 'other', date: getLocalDateString() })
                },
            }
        )
    }

    const inputClasses = "w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-foreground"

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
            >
                <span className="hidden sm:inline">+ Добавить транзакцию</span>
                <span className="sm:hidden">+ Добавить</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
                    <div className="bg-card rounded-t-2xl sm:rounded-xl p-5 sm:p-6 w-full sm:max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-5 sm:mb-6">Новая транзакция</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor='name' className="block text-sm font-medium text-muted mb-1">Название</label>
                                <input
                                    id='name'
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Например: Пятёрочка"
                                    className={inputClasses}
                                />
                            </div>

                            <div>
                                <label htmlFor='amount' className="block text-sm font-medium text-muted mb-1">Сумма (₽)</label>
                                <input
                                    id='amount'
                                    type="number"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    placeholder="1000"
                                    className={inputClasses}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor='type' className="block text-sm font-medium text-muted mb-1">Тип</label>
                                    <select
                                        id='type'
                                        value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}
                                        className={inputClasses}
                                    >
                                        <option value="expense">Расход</option>
                                        <option value="income">Доход</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor='category' className="block text-sm font-medium text-muted mb-1">Категория</label>
                                    <select
                                        id='category'
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value as TransactionCategory })}
                                        className={inputClasses}
                                    >
                                        <option value="food">Еда</option>
                                        <option value="transport">Транспорт</option>
                                        <option value="entertainment">Развлечения</option>
                                        <option value="health">Здоровье</option>
                                        <option value="shopping">Покупки</option>
                                        <option value="salary">Зарплата</option>
                                        <option value="other">Прочее</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor='date' className="block text-sm font-medium text-muted mb-1">Дата</label>
                                <input
                                    id='date'
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isPending || !form.title || !form.amount}
                                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                                {isPending ? 'Сохранение...' : 'Сохранить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
