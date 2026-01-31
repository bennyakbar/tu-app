'use client'

import { useActionState, useEffect } from "react"
import { updateStudent } from "@/app/actions/student"
import { Loader2, X } from "lucide-react"
import { toast } from "sonner"

type ClassType = {
    id: string
    name: string
}

type StudentType = {
    id: string
    name: string
    nis: string
    class_id: string
    spp_category: "REGULER" | "SUBSIDI" | string
}

export function EditStudentForm({
    classes,
    student,
    onClose
}: {
    classes: ClassType[],
    student: StudentType,
    onClose: () => void
}) {
    // Wrap server action with type safety for existing state shape
    const [state, action, isPending] = useActionState(updateStudent, null)

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
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Edit Data Siswa</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form action={action} className="space-y-4">
                    <input type="hidden" name="id" value={student.id} />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">NIS</label>
                            <input
                                name="nis"
                                defaultValue={student.nis}
                                className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                            <input
                                name="name"
                                defaultValue={student.name}
                                className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Kelas</label>
                        <select
                            name="class_id"
                            defaultValue={student.class_id}
                            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
                            required
                        >
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Kategori SPP</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="spp_category"
                                    value="REGULER"
                                    defaultChecked={student.spp_category === 'REGULER'}
                                />
                                <span>Reguler</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="spp_category"
                                    value="SUBSIDI"
                                    defaultChecked={student.spp_category === 'SUBSIDI'}
                                />
                                <span>Subsidi</span>
                            </label>
                        </div>
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
