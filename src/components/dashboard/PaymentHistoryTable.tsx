'use client'

import { useState } from 'react'
import { createReceipt } from '@/app/actions/payment'
import { formatIDR, formatDate } from '@/lib/utils'
import { Loader2, Printer, CheckCircle } from 'lucide-react'

type Payment = {
    id: string
    payment_date: Date
    amount_paid: any
    month: number | null
    fee_type: { name: string }
    receipt_items: any[]
}

export function PaymentHistoryTable({ payments, studentId }: { payments: Payment[], studentId: string }) {
    const [selected, setSelected] = useState<string[]>([])
    const [isProcessing, setIsProcessing] = useState(false)

    const handleCheck = (id: string) => {
        if (selected.includes(id)) setSelected(selected.filter(s => s !== id))
        else setSelected([...selected, id])
    }

    const handleCreateReceipt = async () => {
        if (!confirm(`Buat kwitansi untuk ${selected.length} transaksi?`)) return

        setIsProcessing(true)
        const res = await createReceipt(studentId, selected)
        setIsProcessing(false)

        if (res.success) {
            setSelected([])
            // Open PDF in new tab
            window.open(`/dashboard/kwitansi/${res.receiptId}`, '_blank')
        } else {
            alert(res.error)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Riwayat Pembayaran</h2>
                {selected.length > 0 && (
                    <button
                        onClick={handleCreateReceipt}
                        disabled={isProcessing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm flex items-center"
                    >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Printer className="w-4 h-4 mr-2" />}
                        Cetak Kwitansi ({selected.length})
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b dark:border-gray-700 text-gray-500">
                            <th className="py-3 px-2 w-10">#</th>
                            <th className="py-3 px-2">Tanggal</th>
                            <th className="py-3 px-2">Uraian</th>
                            <th className="py-3 px-2">Bulan</th>
                            <th className="py-3 px-2 text-right">Jumlah</th>
                            <th className="py-3 px-2 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {payments.length === 0 && (
                            <tr><td colSpan={6} className="py-4 text-center text-gray-500">Belum ada data pembayaran.</td></tr>
                        )}
                        {payments.map(p => {
                            const isPrinted = p.receipt_items.length > 0
                            return (
                                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="py-3 px-2">
                                        {!isPrinted && (
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(p.id)}
                                                onChange={() => handleCheck(p.id)}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                        )}
                                    </td>
                                    <td className="py-3 px-2">{formatDate(p.payment_date)}</td>
                                    <td className="py-3 px-2">{p.fee_type.name}</td>
                                    <td className="py-3 px-2">{p.month ? p.month : '-'}</td>
                                    <td className="py-3 px-2 text-right font-medium">{formatIDR(p.amount_paid.toString())}</td>
                                    <td className="py-3 px-2 text-center">
                                        {isPrinted ? (
                                            <span className="inline-flex items-center text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Tercetak
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-500">Draft</span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
