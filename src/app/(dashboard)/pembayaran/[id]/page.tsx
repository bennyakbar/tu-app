import prisma from "@/lib/prisma";
import { formatIDR } from "@/lib/utils";
import { PaymentEntryForm } from "@/components/forms/PaymentEntryForm";
import { PaymentHistoryTable } from "@/components/dashboard/PaymentHistoryTable";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StudentPaymentPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: studentId } = await params;

    const activeYear = await prisma.academicYear.findFirst({
        where: { is_active: true },
    });

    if (!activeYear) {
        return (
            <div className="p-8 text-center text-red-600">
                Tahun ajaran aktif belum diatur oleh Admin.
            </div>
        );
    }

    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { class: true },
    });

    if (!student) return notFound();

    const feeTypes = await prisma.feeType.findMany({
        where: { is_active: true },
    });

    // Safe fetch SPP Rate
    const sppRate = await prisma.sppRate.findFirst({
        where: {
            academic_year_id: activeYear.id,
            class_id: student.class_id,
            category: student.spp_category,
        },
    });

    const payments = await prisma.payment.findMany({
        where: { student_id: studentId },
        include: {
            fee_type: true,
            receipt_items: true,
        },
        orderBy: { payment_date: "desc" },
    });

    // Calculate Summary
    const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount_paid), 0);

    return (
        <div className="space-y-6">
            <Link
                href="/dashboard/pembayaran"
                className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Pencarian
            </Link>

            {/* Header Info */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold">{student.name}</h1>
                        <p className="opacity-90 mt-1">
                            NIS: {student.nis} • {student.class.name} •{" "}
                            {student.spp_category}
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-wide opacity-80">
                            Total Dibayar (Semua Periode)
                        </p>
                        <p className="text-xl font-mono font-bold">
                            {formatIDR(totalPaid)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Input Form */}
                <div className="lg:col-span-1">
                    <PaymentEntryForm
                        studentId={studentId}
                        academicYearId={activeYear.id}
                        feeTypes={feeTypes}
                        sppRate={sppRate?.amount?.toString()}
                    />
                </div>

                {/* Right: History Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
                        <PaymentHistoryTable payments={payments} studentId={studentId} />
                    </div>
                </div>
            </div>
        </div>
    );
}
