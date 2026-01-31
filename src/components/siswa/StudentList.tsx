"use client";

import { useState, useTransition, Fragment } from "react";
import { Search, UserMinus, UserCheck, CreditCard, Pencil } from "lucide-react";
import { toggleStudentStatus } from "@/app/actions/student";
import Link from "next/link";
import { toast } from "sonner";
import { EditStudentForm } from "./EditStudentForm";

export function StudentList({ students, classes }: { students: any[], classes: any[] }) {
    const [filter, setFilter] = useState("")
    const [classFilter, setClassFilter] = useState("all")
    const [isPending, startTransition] = useTransition()
    const [editingStudent, setEditingStudent] = useState<any | null>(null);

    const filtered = students.filter(s => {
        const matchName = s.name.toLowerCase().includes(filter.toLowerCase()) || s.nis.includes(filter)
        const matchClass = classFilter === "all" || s.class_id === classFilter
        return matchName && matchClass
    })

    // Helper to check for group changes
    // Since filtered is sorted by Class -> NIS, this works perfectly.

    const handleToggle = (id: string, status: boolean) => {
        startTransition(async () => {
            const res = await toggleStudentStatus(id, status)
            if (res.error) toast.error(res.error)
            else toast.success(status ? "Siswa dinonaktifkan" : "Siswa diaktifkan")
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                        placeholder="Cari nama atau NIS..."
                        className="w-full pl-9 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <select
                    className="border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 px-4"
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                >
                    <option value="all">Semua Kelas</option>
                    {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className="border rounded-xl overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-3">Siswa</th>
                            <th className="px-6 py-3">Kelas</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    Tidak ada data siswa ditemukan
                                </td>
                            </tr>
                        ) : filtered.map((student, index) => {
                            const showHeader = index === 0 || (filtered[index - 1] && student.class.name !== filtered[index - 1].class.name);

                            return (
                                <Fragment key={student.id}>
                                    {showHeader && (
                                        <tr className="bg-gray-50/80 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700">
                                            <td colSpan={4} className="px-6 py-3">
                                                <div className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200">
                                                    <div className="h-4 w-1 bg-indigo-500 rounded-full"></div>
                                                    KELAS {student.class.name}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            <div className="text-gray-900 dark:text-white">{student.name}</div>
                                            <div className="text-gray-500 text-xs">NIS: {student.nis} • {student.spp_category}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">
                                                {student.class.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}>
                                                {student.is_active ? "Aktif" : "Non-Aktif"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    onClick={() => setEditingStudent(student)}
                                                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                                    title="Edit Data"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/dashboard/pembayaran/${student.id}`}
                                                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                                    title="Pembayaran"
                                                >
                                                    <CreditCard className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleToggle(student.id, student.is_active)}
                                                    disabled={isPending}
                                                    className={`p-1 transition-colors ${student.is_active
                                                        ? "text-gray-400 hover:text-red-600"
                                                        : "text-gray-400 hover:text-green-600"
                                                        }`}
                                                    title={student.is_active ? "Nonaktifkan" : "Aktifkan"}
                                                >
                                                    {student.is_active ? <UserMinus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {editingStudent && (
                <EditStudentForm
                    classes={classes}
                    student={editingStudent}
                    onClose={() => setEditingStudent(null)}
                />
            )}
        </div>
    );
}
