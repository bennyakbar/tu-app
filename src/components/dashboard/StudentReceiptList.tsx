'use client'

import { formatIDR } from "@/lib/utils"
import { ExternalLink, FileText } from "lucide-react"

type Receipt = {
    id: string
    receipt_number: string
    receipt_date: Date
    total_amount: string
}

export function StudentReceiptList({ receipts }: { receipts: Receipt[] }) {
    if (receipts.length === 0) return null

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-8">
            <h2 className="text-lg font-bold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Riwayat Kwitansi
            </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Kwitansi</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {receipts.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {r.receipt_number}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(r.receipt_date).toLocaleDateString('id-ID')}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-mono">
                                    {formatIDR(Number(r.total_amount))}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                    <button
                                        onClick={() => window.open(`/dashboard/kwitansi/${r.id}`, '_blank')}
                                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center text-xs font-bold"
                                    >
                                        <ExternalLink className="w-3 h-3 mr-1" />
                                        LIHAT
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
