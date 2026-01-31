'use client'

import { useActionState, useState, useEffect } from 'react'
import { createStudent } from '@/app/actions/student'
import { Loader2, Plus, X } from 'lucide-react'
import { toast } from "sonner"

type ClassOption = {
    id: string
    name: string
}

export function StudentForm({ classes, onSuccess }: { classes: ClassOption[], onSuccess?: () => void }) {
    const [state, formAction, isPending] = useActionState(createStudent, undefined)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (state?.success) {
            toast.success(state.success)
            setIsOpen(false)
            if (onSuccess) onSuccess()
        } else if (state?.error) {
            // This is the notification for duplicate NIS
            toast.error(state.error)
        }
    }, [state, onSuccess])

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
            >
                {isOpen ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {isOpen ? 'Batal' : 'Tambah Siswa'}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Tambah Siswa Baru</h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form action={formAction} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">NIS</label>
                                <input name="nis" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required placeholder="Nomor Induk Siswa" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                                <input name="name" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required placeholder="Nama Siswa" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Kelas</label>
                                <select name="class_id" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required>
                                    <option value="">Pilih Kelas...</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Kategori SPP</label>
                                <select name="spp_category" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required>
                                    <option value="REGULER">REGULER</option>
                                    <option value="SUBSIDI">SUBSIDI</option>
                                </select>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
