import { getSession } from "@/lib/auth";
import { ReportForm } from "@/components/dashboard/ReportForm";
import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default async function LaporanPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const isYayasan = session.user.role === 'YAYASAN';

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Laporan & Rekapitulasi</h1>

            {isYayasan ? (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Akun Yayasan hanya dapat melihat Dashboard Ringkasan (View-Only).
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ReportForm />

                    {/* Placeholder for future specific reports */}
                    <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
                        Fitur laporan visual lainnya akan segera hadir.
                    </div>
                </div>
            )}
        </div>
    )
}
