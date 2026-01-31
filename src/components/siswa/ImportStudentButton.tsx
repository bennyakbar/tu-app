'use client'

import { useActionState, useEffect, useState } from "react"
import { importStudents } from "@/app/actions/import"
import { Upload, X, Loader2, FileSpreadsheet, Download } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from 'xlsx'

type ImportState = {
    success?: number
    failed?: number
    errors?: string[]
    error?: string
}

export function ImportStudentButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [state, formAction, isPending] = useActionState<ImportState | null, FormData>(importStudents as any, null)

    const downloadTemplate = () => {
        const ws = XLSX.utils.json_to_sheet([
            { NIS: '1001', Nama: 'Contoh Siswa', Kelas: '1A', Kategori: 'REGULER' },
            { NIS: '1002', Nama: 'Contoh Subsidi', Kelas: '1B', Kategori: 'SUBSIDI' },
        ])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Template")
        XLSX.writeFile(wb, "Template_Import_Siswa.xlsx")
    }

    useEffect(() => {
        if (state?.success !== undefined) {
            if (state.failed === 0) {
                toast.success(`Berhasil import ${state.success} siswa!`)
                setIsOpen(false)
            } else {
                toast.warning(`${state.success} berhasil, ${state.failed} gagal.`)
            }
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
                title="Import Excel"
            >
                <Upload className="w-4 h-4 mr-2" />
                Import
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                                Import Data Siswa
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-4">
                                <p className="font-semibold mb-2">Petunjuk:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Gunakan format Excel (.xlsx).</li>
                                    <li>Kolom wajib: <b>NIS, Nama, Kelas</b>.</li>
                                    <li>Sistem akan otomatis membuat Kelas jika belum ada.</li>
                                    <li>NIS duplikat akan dilewati.</li>
                                </ul>
                                <button
                                    onClick={downloadTemplate}
                                    className="mt-3 text-xs flex items-center bg-white border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50 transition"
                                >
                                    <Download className="w-3 h-3 mr-1" />
                                    Download Template
                                </button>
                            </div>

                            <form action={formAction} className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors bg-gray-50 dark:bg-gray-900/50">
                                    <input
                                        type="file"
                                        name="file"
                                        accept=".xlsx, .xls"
                                        required
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    <p className="text-xs text-gray-400 mt-2">Maksimal 5MB</p>
                                </div>

                                {state?.errors && state.errors.length > 0 && (
                                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs max-h-32 overflow-y-auto">
                                        <b>Error Log:</b>
                                        <ul className="list-disc list-inside mt-1">
                                            {state.errors.map((err: string, i: number) => (
                                                <li key={i}>{err}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                                    >
                                        {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Proses Import'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
