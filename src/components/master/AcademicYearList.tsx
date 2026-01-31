'use client'

import { activateAcademicYear } from "@/app/actions/master"
import { CheckCircle, Circle, Loader2 } from "lucide-react"
import { useState } from "react"

type AcademicYear = {
    id: string
    name: string
    is_active: boolean
    created_at: Date
}

export function AcademicYearList({ data }: { data: AcademicYear[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleActivate = async (id: string) => {
        if (!confirm("Aktifkan tahun ajaran ini? Tahun ajaran sebelumnya akan dinonaktifkan.")) return

        setLoadingId(id)
        await activateAcademicYear(id)
        setLoadingId(null)
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.length === 0 && (
                        <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">Belum ada data.</td></tr>
                    )}
                    {data.map((item) => (
                        <tr key={item.id} className={item.is_active ? "bg-green-50/50 dark:bg-green-900/10" : ""}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {item.is_active ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Inactive
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {item.is_active ? (
                                    <span className="text-green-600 flex items-center justify-end cursor-default">
                                        <CheckCircle className="w-5 h-5" />
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleActivate(item.id)}
                                        disabled={loadingId !== null}
                                        className="text-gray-400 hover:text-indigo-600 transition-colors flex items-center justify-end ml-auto"
                                    >
                                        {loadingId === item.id ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Circle className="w-5 h-5" />
                                        )}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
