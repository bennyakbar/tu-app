'use client'

import { useActionState, useState } from 'react'
import { createSppRate } from '@/app/actions/master_spp'
import { Loader2, Plus, Info } from 'lucide-react'

type Option = { id: string, name: string }

export function SppRateForm({ years, classes }: { years: Option[], classes: Option[] }) {
    const [state, formAction, isPending] = useActionState(createSppRate, undefined)

    // Default to first year (assuming sorted active first/desc)
    const [selectedYear, setSelectedYear] = useState(years[0]?.id || "")

    return (
        <form action={formAction} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-fit">
            <h2 className="text-lg font-bold mb-4">Set Tarif SPP</h2>

            {state?.error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{state.error}</div>
            )}
            {state?.success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">{state.success}</div>
            )}

            <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-lg mb-4 flex items-start">
                <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Jika tarif untuk Kelas & Kategori tersebut sudah ada di Tahun Ajaran yang sama, nominal akan diperbarui.
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Tahun Ajaran</label>
                    <select
                        name="academic_year_id"
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        required
                    >
                        {years.map(y => (
                            <option key={y.id} value={y.id}>{y.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Kelas</label>
                    <select name="class_id" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required>
                        <option value="">Pilih Kelas...</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Kategori Siswa</label>
                    <select name="category" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required>
                        <option value="REGULER">REGULER</option>
                        <option value="SUBSIDI">SUBSIDI</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Nominal (Rp)</label>
                    <input
                        type="number"
                        name="amount"
                        placeholder="Contoh: 150000"
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                        min="0"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    Simpan Tarif
                </button>
            </div>
        </form>
    )
}
