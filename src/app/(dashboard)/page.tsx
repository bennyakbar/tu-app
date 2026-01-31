import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatIDR } from "@/lib/utils";
import { DollarSign, Users, Calendar } from 'lucide-react';

async function getStats() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [income, students, activeYear] = await Promise.all([
        prisma.payment.aggregate({
            _sum: { amount_paid: true },
            where: {
                payment_date: {
                    gte: firstDay,
                    lt: nextMonth,
                },
            },
        }),
        prisma.student.count({ where: { is_active: true } }),
        prisma.academicYear.findFirst({ where: { is_active: true } })
    ]);

    return {
        income: income._sum.amount_paid ?? 0,
        studentCount: students,
        academicYear: activeYear?.name ?? 'Belum diset',
    };
}

export default async function DashboardPage() {
    const session = await getSession();
    const user = session?.user;
    const stats = await getStats();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Selamat Datang, {user?.name}
                </h1>
                <p className="text-gray-500 text-sm">
                    Ringkasan data untuk Tahun Ajaran {stats.academicYear}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pemasukan Bulan Ini</h3>
                        <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatIDR(Number(stats.income))}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Siswa Aktif</h3>
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.studentCount} Siswa
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tahun Ajaran Aktif</h3>
                        <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.academicYear}
                    </p>
                </div>
            </div>

            {/* Role specific content */}
            {user?.role === 'YAYASAN' && (
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold mb-4">Grafik Pemasukan (Simulasi)</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-400">
                        Grafik akan tampil di sini (Recharts)
                    </div>
                </div>
            )}
        </div>
    );
}
