import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ReportForm } from "@/components/dashboard/ReportForm";
import { ReportCharts } from "@/components/dashboard/ReportCharts";
import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";

async function getStats() {
    const activeYear = await prisma.academicYear.findFirst({
        where: { is_active: true }
    });

    if (!activeYear) return { classData: [], typeData: [] };

    const payments = await prisma.payment.findMany({
        where: {
            academic_year_id: activeYear.id
        },
        include: {
            student: {
                include: { class: true }
            },
            fee_type: true
        }
    });

    // Aggregate by Class (map p: any because relation fields can be partial if not typed strictly, but here include ensures it)
    const classMap = new Map<string, number>();
    payments.forEach((p: any) => {
        const className = p.student?.class?.name || "Unknown";
        classMap.set(className, (classMap.get(className) || 0) + Number(p.amount_paid));
    });

    const classData = Array.from(classMap).map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total); // Highest first

    // Aggregate by Type
    const typeMap = new Map<string, number>();
    payments.forEach((p: any) => {
        const typeName = p.fee_type?.name || "Unknown";
        typeMap.set(typeName, (typeMap.get(typeName) || 0) + Number(p.amount_paid));
    });

    const typeData = Array.from(typeMap).map(([name, value]) => ({ name, value }));

    return { classData, typeData };
}

export default async function LaporanPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const isYayasan = session.user.role === 'YAYASAN';
    const stats = await getStats();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Laporan & Rekapitulasi</h1>

            {isYayasan && (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg flex items-center mb-6">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Akun Yayasan hanya dapat melihat Dashboard Ringkasan (View-Only).
                </div>
            )}

            {/* Quick Links */}
            <div className="grid grid-cols-1 mb-6">
                <a
                    href="/dashboard/laporan/tunggakan"
                    className="block p-4 bg-white dark:bg-gray-800 border-l-4 border-red-500 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 group-hover:text-red-600">Laporan Tunggakan SPP</h3>
                            <p className="text-gray-500 text-sm">Cek siswa yang belum melunasi kewajiban bulanan.</p>
                        </div>
                        <AlertCircle className="w-6 h-6 text-red-400 group-hover:text-red-600" />
                    </div>
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Excel Download Form */}
                <div className="md:col-span-2">
                    <ReportForm />
                </div>

                {/* Charts */}
                <div className="md:col-span-2">
                    <h2 className="text-xl font-bold mb-4 mt-4">Visualisasi Data (Tahun Ajaran Aktif)</h2>
                    {stats.classData.length > 0 ? (
                        <ReportCharts classData={stats.classData} typeData={stats.typeData} />
                    ) : (
                        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                            Belum ada data pembayaran untuk tahun ajaran aktif.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
