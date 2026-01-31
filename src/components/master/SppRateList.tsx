'use client'

import { deleteSppRate } from "@/app/actions/master_spp"
import { formatIDR } from "@/lib/utils"
import { Loader2, Trash2 } from "lucide-react"
import { useState } from "react"

type SppRateItem = {
    id: string
    academic_year: { name: string }
    class: { name: string }
    category: string
    amount: string // serialized from Decimal
}

export function SppRateList({ data }: { data: SppRateItem[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus tarif ini?")) return
        setLoadingId(id)
        await deleteSppRate(id)
        setLoadingId(null)
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Ajaran</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Belum ada data tarif.</td></tr>
                    )}
                    {data.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {item.academic_year.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.class.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.category === 'SUBSIDI' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                    {item.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono font-medium">
                                {formatIDR(item.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    disabled={loadingId !== null}
                                    className="text-red-600 hover:text-red-800 transition-colors inline-flex items-center"
                                >
                                    {loadingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
