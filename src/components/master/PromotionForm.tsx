'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { promoteStudents } from "@/app/actions/promotion"; // Import the server action
import { useActionState } from "react";
import { Check, Loader2, AlertCircle } from "lucide-react";

type ClassType = {
    id: string;
    name: string;
}

type StudentType = {
    id: string;
    nis: string;
    name: string;
}

export function PromotionForm({ classes, students, fromClassId }: {
    classes: ClassType[],
    students: StudentType[],
    fromClassId?: string
}) {
    const router = useRouter();
    const [state, action, isPending] = useActionState(promoteStudents, null);

    // Select all by default
    // We don't necessarily need state for checkboxes if we use defaultChecked,
    // but "Select All" feature requires state.
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(students.map(s => s.id)));

    // Update selection when students change
    useEffect(() => {
        setSelectedIds(new Set(students.map(s => s.id)));
    }, [students]);

    const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val) {
            router.push(`/dashboard/master/kenaikan?from=${val}`);
        } else {
            router.push(`/dashboard/master/kenaikan`);
        }
    };

    const toggleAll = () => {
        if (selectedIds.size === students.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(students.map(s => s.id)));
        }
    };

    const toggleOne = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    // Filter "To Class" options (exclude From Class)
    const targetClasses = classes.filter(c => c.id !== fromClassId);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="max-w-md">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pilih Kelas Asal
                    </label>
                    <select
                        value={fromClassId || ""}
                        onChange={handleFromChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
                    >
                        <option value="">-- Pilih Kelas --</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {fromClassId && (
                <form action={action} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
                    <input type="hidden" name="fromClassId" value={fromClassId} />

                    {/* Status Message */}
                    {state?.message && (
                        <div className={`p-4 rounded-lg flex items-center gap-2 ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {state.success ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {state.message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-bold text-lg mb-4">Daftar Siswa ({students.length})</h3>
                            {students.length === 0 ? (
                                <p className="text-gray-500 italic">Tidak ada siswa di kelas ini.</p>
                            ) : (
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-600 flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={students.length > 0 && selectedIds.size === students.length}
                                            onChange={toggleAll}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                                        />
                                        <span className="text-sm font-medium">Pilih Semua</span>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                                        {students.map(s => (
                                            <label key={s.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="studentIds"
                                                    value={s.id}
                                                    checked={selectedIds.has(s.id)}
                                                    onChange={() => toggleOne(s.id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{s.name}</p>
                                                    <p className="text-xs text-gray-500">NIS: {s.nis}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-4">Tujuan Kenaikan</h3>
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Pindahkan ke Kelas
                                </label>
                                <select
                                    name="toClassId"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-600 mb-4"
                                >
                                    <option value="">-- Pilih Kelas Tujuan --</option>
                                    {targetClasses.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>

                                <div className="text-sm text-gray-500 mb-6">
                                    <p>• Siswa terpilih akan dipindahkan ke kelas tujuan.</p>
                                    <p>• Pastikan data tahun ajaran sudah benar.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isPending || selectedIds.size === 0}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                    Proses Kenaikan Kelas
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
