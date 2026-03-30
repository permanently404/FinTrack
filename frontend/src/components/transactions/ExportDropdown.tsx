'use client'
import { useState, useRef, useEffect } from 'react'
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react'
import { useTransactionStore } from '@/store/transactionStore'
import { useNotificationStore } from '@/store/notificationStore'
import { fetchTransactions } from '@/api/transactions'

interface ExportDropdownProps {
    total: number
    disabled?: boolean
}

export function ExportDropdown({ total, disabled }: ExportDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [exportType, setExportType] = useState<'excel' | 'pdf' | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const filters = useTransactionStore((s) => s.filters)
    const addNotification = useNotificationStore((s) => s.addNotification)

    const isDisabled = disabled || total === 0 || isExporting

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    async function handleExport(type: 'excel' | 'pdf') {
        setIsExporting(true)
        setExportType(type)
        setIsOpen(false)

        try {
            const response = await fetchTransactions({ ...filters, page: 1, limit: 1000 })

            if (type === 'excel') {
                const { exportTransactionsExcel } = await import('@/lib/exportExcel')
                exportTransactionsExcel(response.data)
            } else {
                const { exportTransactionsPdf } = await import('@/lib/exportPdf')
                exportTransactionsPdf(response.data, filters)
            }

            addNotification({
                message: type === 'excel' ? 'Excel файл скачан' : 'PDF файл скачан',
                type: 'success',
            })
        } catch (error) {
            console.error('Export error:', error)
            addNotification({
                message: `Не удалось экспортировать ${type === 'excel' ? 'Excel' : 'PDF'}`,
                type: 'error',
            })
        } finally {
            setIsExporting(false)
            setExportType(null)
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isDisabled}
                className="border border-border hover:bg-white/5 rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {isExporting ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Download size={16} />
                )}
                <span className="hidden sm:inline">Экспорт</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 bg-card rounded-xl shadow-xl border border-border z-50 py-1 min-w-[180px]">
                    <button
                        onClick={() => handleExport('excel')}
                        disabled={isExporting}
                        className="w-full px-4 py-2.5 text-sm text-foreground hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-40"
                    >
                        {exportType === 'excel' ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <FileSpreadsheet size={16} />
                        )}
                        Скачать Excel
                    </button>
                    <button
                        onClick={() => handleExport('pdf')}
                        disabled={isExporting}
                        className="w-full px-4 py-2.5 text-sm text-foreground hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-40"
                    >
                        {exportType === 'pdf' ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <FileText size={16} />
                        )}
                        Скачать PDF
                    </button>
                </div>
            )}
        </div>
    )
}
