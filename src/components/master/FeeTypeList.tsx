'use client'

import { toggleFeeTypeStatus, deleteFeeType } from "@/app/actions/master_fee"
import { Loader2, ToggleLeft, ToggleRight, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

type FeeTypeItem = {
    id: string
    name: string
    type: "RUTIN" | "NON_RUTIN" | string
    is_spp: boolean
    is_active: boolean
}

export function FeeTypeList({ data }: { data: FeeTypeItem[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleToggle = async (id: string, currentStatus: boolean) => {
        setLoadingId(id)
        await toggleFeeTypeStatus(id, currentStatus)
        setLoadingId(null)
    }

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Yakin ingin menghapus ${name}? Hanya bisa dilakukan jika belum ada transaksi.`)) {
            startTransition(async () => {
                const res = await deleteFeeType(id)
                if (res.error) toast.error(res.error)
                else toast.success(res.success)
            })
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Biaya</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Belum ada data jenis biaya.</td></tr>
                    )}
                    {data.map((item) => (
                        <tr key={item.id} className={!item.is_active ? "bg-gray-50 dark:bg-gray-900/50 opacity-75" : ""}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.type === 'RUTIN' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {item.type.replace('_', ' ')}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.is_spp ? (
                                    <span className="text-indigo-600 font-medium text-xs border border-indigo-200 bg-indigo-50 px-2 py-1 rounded">SPP Bulanan</span>
                                ) : (
                                    '-'
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {item.is_active ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Non-Aktif
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => handleDelete(item.id, item.name)}
                                        disabled={isPending}
                                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                                        title="Hapus Permanen"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleToggle(item.id, item.is_active)}
                                        disabled={loadingId !== null}
                                        className={`${item.is_active ? 'text-green-600' : 'text-gray-400'} hover:opacity-80 transition-colors inline-flex items-center p-1`}
                                        title={item.is_active ? "Nonaktifkan" : "Aktifkan"}
                                    >
                                        {loadingId === item.id ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            item.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
