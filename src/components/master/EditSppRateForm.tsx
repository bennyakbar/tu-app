'use client'

import { useActionState, useEffect } from "react"
import { updateSppRate } from "@/app/actions/master_spp"
import { Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { formatIDR } from "@/lib/utils"

type SppRateItem = {
    id: string
    academic_year: { name: string }
    class: { name: string }
    category: string
    amount: string
}

export function EditSppRateForm({ rate, onClose }: { rate: SppRateItem, onClose: () => void }) {
    const [state, action, isPending] = useActionState(updateSppRate, null)

    // We handle success via effect
    useEffect(() => {
        if (state?.success) {
            toast.success(state.success)
            onClose()
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state, onClose])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Edit Nominal Tarif</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Tahun Ajaran:</span>
                        <span className="font-medium">{rate.academic_year.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Kelas:</span>
                        <span className="font-medium">{rate.class.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Kategori:</span>
                        <span className="font-medium">{rate.category}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Nominal Lama:</span>
                        <span className="font-medium">{formatIDR(Number(rate.amount))}</span>
                    </div>
                </div>

                <form action={action} className="space-y-4">
                    <input type="hidden" name="id" value={rate.id} />

                    <div>
                        <label className="block text-sm font-medium mb-1">Nominal Baru (Rp)</label>
                        <input
                            name="amount"
                            type="number"
                            defaultValue={rate.amount}
                            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 font-mono text-lg"
                            required
                            min="0"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
