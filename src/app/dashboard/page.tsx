import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatIDR } from "@/lib/utils";
import { DollarSign, Users, Calendar } from 'lucide-react';

import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

async function getStats() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Get 6 months history
    const historyStart = new Date();
    historyStart.setMonth(historyStart.getMonth() - 5);
    historyStart.setDate(1);

    const [income, students, activeYear, historicalPayments] = await Promise.all([
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
        prisma.academicYear.findFirst({ where: { is_active: true } }),
        prisma.payment.findMany({
            where: { payment_date: { gte: historyStart } },
            select: { payment_date: true, amount_paid: true }
        })
    ]);

    // Process History
    const monthlyData = new Map<string, number>();

    // Initialize last 6 months with 0
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const label = d.toLocaleString('id-ID', { month: 'short' });
        monthlyData.set(label, 0);
    }

    // Fill data
    historicalPayments.forEach((p: any) => {
        const label = p.payment_date.toLocaleString('id-ID', { month: 'short' });
        if (monthlyData.has(label)) {
            monthlyData.set(label, (monthlyData.get(label) || 0) + Number(p.amount_paid));
        }
    });

    const chartData = Array.from(monthlyData).map(([name, total]) => ({ name, total }));

    return {
        income: income._sum.amount_paid ?? 0,
        studentCount: students,
        academicYear: activeYear?.name ?? 'Belum diset',
        chartData
    };
}

export default async function DashboardPage() {
    const session = await getSession();
    const user = session?.user;
    const stats = await getStats();

    return (
        <div className="space-y-8">
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

            <DashboardCharts data={stats.chartData} />

        </div>
    );
}
