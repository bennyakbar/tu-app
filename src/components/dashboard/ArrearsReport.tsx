'use client'

import { getUnpaidStudents, UnpaidStudent } from "@/app/actions/report_arrears"
import { formatIDR } from "@/lib/utils"
import { Loader2, Printer, Search, AlertCircle } from "lucide-react"
import { useState, useTransition } from "react"

const MONTHS = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
]

type Props = {
    classes: { id: string, name: string }[]
    years: { id: string, name: string, is_active: boolean }[]
}

export function ArrearsReport({ classes, years }: Props) {
    // Default to Active Year and Current Month
    const activeYear = years.find(y => y.is_active) || years[0]
    const currentMonth = new Date().getMonth() + 1

    const [filter, setFilter] = useState({
        yearId: activeYear?.id || '',
        month: currentMonth,
        classId: 'all'
    })

    const [data, setData] = useState<UnpaidStudent[]>([])
    const [isPending, startTransition] = useTransition()
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = () => {
        setHasSearched(true)
        startTransition(async () => {
            const res = await getUnpaidStudents(filter.yearId, filter.month, filter.classId)
            if (res.data) {
                setData(res.data)
            } else {
                setData([])
            }
        })
    }

    const totalTunggakan = data.reduce((sum, item) => sum + item.amount, 0)

    return (
        <div className="space-y-6">
            {/* Filter Section - Hidden on Print */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 print:hidden">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tahun Ajaran</label>
                        <select
                            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-sm"
                            value={filter.yearId}
                            onChange={(e) => setFilter({ ...filter, yearId: e.target.value })}
                        >
                            {years.map(y => (
                                <option key={y.id} value={y.id}>{y.name} {y.is_active ? '(Aktif)' : ''}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Bulan</label>
                        <select
                            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-sm"
                            value={filter.month}
                            onChange={(e) => setFilter({ ...filter, month: Number(e.target.value) })}
                        >
                            {MONTHS.map(m => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Kelas</label>
                        <select
                            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-sm"
                            value={filter.classId}
                            onChange={(e) => setFilter({ ...filter, classId: e.target.value })}
                        >
                            <option value="all">Semua Kelas</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleSearch}
                        disabled={isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        Cek Tunggakan
                    </button>
                </div>
            </div>

            {/* Report Display */}
            {hasSearched && !isPending && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden print:border-0 print:shadow-none">
                    {/* Header for Print */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold uppercase tracking-wide">Laporan Tunggakan SPP</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Periode: {MONTHS.find(m => m.value === filter.month)?.label} |
                                TA: {years.find(y => y.id === filter.yearId)?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                Kelas: {filter.classId === 'all' ? 'Semua Kelas' : classes.find(c => c.id === filter.classId)?.name}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-400 uppercase">Total Potensi Tunggakan</div>
                            <div className="text-2xl font-bold text-red-600 font-mono">{formatIDR(totalTunggakan)}</div>
                            <button onClick={() => window.print()} className="mt-2 text-xs flex items-center gap-1 text-gray-500 hover:text-gray-800 print:hidden ml-auto">
                                <Printer className="w-3 h-3" /> Cetak
                            </button>
                        </div>
                    </div>

                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-10">No</th>
                                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">NIS</th>
                                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <AlertCircle className="w-8 h-8 text-green-500" />
                                            <p className="font-medium text-green-700">Tidak ada tunggakan!</p>
                                            <p className="text-xs">Semua siswa pada filter ini sudah lunas.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-3 text-gray-500">{idx + 1}</td>
                                        <td className="px-6 py-3 font-mono text-gray-600">{item.nis}</td>
                                        <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100">{item.name}</td>
                                        <td className="px-6 py-3 text-gray-500">{item.className}</td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs ${item.category === 'SUBSIDI' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right font-mono font-medium text-red-600">
                                            {formatIDR(item.amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {data.length > 0 && (
                            <tfoot className="bg-gray-50 dark:bg-gray-700/50 font-bold border-t border-gray-200">
                                <tr>
                                    <td colSpan={5} className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">TOTAL</td>
                                    <td className="px-6 py-3 text-right text-red-600 font-mono">{formatIDR(totalTunggakan)}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            )}
        </div>
    )
}
