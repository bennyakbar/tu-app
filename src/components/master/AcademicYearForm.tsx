'use client'

import { useActionState } from 'react'
import { createAcademicYear } from '@/app/actions/master'
import { Loader2, Plus } from 'lucide-react'

export function AcademicYearForm() {
    const [state, formAction, isPending] = useActionState(createAcademicYear, undefined)

    return (
        <form action={formAction} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-fit">
            <h2 className="text-lg font-bold mb-4">Tambah Tahun Ajaran</h2>

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
                    <label className="block text-sm font-medium mb-1">Nama Tahun Ajaran</label>
                    <input
                        name="name"
                        placeholder="Contoh: 2025/2026"
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>

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
