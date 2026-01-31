'use client'

import { useActionState, useState } from 'react'
import { createFeeType } from '@/app/actions/master_fee'
import { Loader2, Plus, Info } from 'lucide-react'

export function FeeTypeForm() {
    const [state, formAction, isPending] = useActionState(createFeeType, undefined)
    const [type, setType] = useState<string>("NON_RUTIN")

    return (
        <form action={formAction} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-fit">
            <h2 className="text-lg font-bold mb-4">Tambah Jenis Biaya</h2>

            {state?.error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {state.error}
                </div>
            )}
            {state?.success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                    {state.success}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nama Biaya</label>
                    <input
                        name="name"
                        placeholder="Contoh: SPP, Uang Gedung, Seragam"
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Kategori</label>
                    <select
                        name="type"
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="NON_RUTIN">Non Rutin (Sekali)</option>
                        <option value="RUTIN">Rutin (Bulanan)</option>
                    </select>
                </div>

                {type === "RUTIN" && (
                    <div className="flex items-start p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                        <input
                            type="checkbox"
                            name="is_spp"
                            id="is_spp"
                            className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <div className="ml-3">
                            <label htmlFor="is_spp" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Set sebagai SPP Utama?
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Jika dicentang, sistem akan menghitung tunggakan bulanan untuk biaya ini.
                            </p>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    Simpan
                </button>
            </div>
        </form>
    )
}
