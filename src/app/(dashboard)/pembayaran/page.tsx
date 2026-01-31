import Link from "next/link";
import prisma from "@/lib/prisma";
import { Search, User } from "lucide-react";
import { redirect } from "next/navigation";

export default async function PembayaranListPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const query = searchParams.q || "";

    // Only search if query is > 2 chars to save resources, or limit
    const students = query
        ? await prisma.student.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { nis: { contains: query } },
                ],
            },
            include: {
                class: true,
            },
            take: 10,
        })
        : [];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Cari Siswa untuk Pembayaran</h1>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <form className="relative mb-6">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="Cari nama siswa atau NIS..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900 dark:text-white outline-none"
                        autoFocus
                    />
                </form>

                <div className="space-y-2">
                    {query && students.length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                            Tidak ditemukan data siswa.
                        </p>
                    )}

                    {students.map((student) => (
                        <div
                            key={student.id}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                                    <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {student.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        NIS: {student.nis} • {student.class.name} •{" "}
                                        {student.spp_category}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={`/dashboard/pembayaran/${student.id}`}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg"
                            >
                                Pilih
                            </Link>
                        </div>
                    ))}

                    {!query && (
                        <div className="text-center text-gray-500 py-10">
                            <Search className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p>Ketik nama atau NIS untuk mulai pencarian</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
