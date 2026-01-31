import prisma from "@/lib/prisma";
import { SppRateForm } from "@/components/master/SppRateForm";
import { SppRateList } from "@/components/master/SppRateList";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export default async function SppRatePage() {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN_TU') {
        redirect('/dashboard');
    }

    // Fetch dependencies for Form
    const years = await prisma.academicYear.findMany({
        orderBy: { name: 'desc' },
        select: { id: true, name: true }
    });

    const classes = await prisma.class.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' },
        select: { id: true, name: true }
    });

    // Fetch Rates for List
    const rawRates = await prisma.sppRate.findMany({
        include: {
            academic_year: true,
            class: true
        },
        orderBy: [
            { academic_year: { name: 'desc' } },
            { class: { name: 'asc' } }
        ]
    });

    // Serialize Decimal
    const rates = rawRates.map(r => ({
        ...r,
        amount: r.amount.toString()
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/master"
                    className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors bg-white p-2 rounded-lg shadow-sm border"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-2xl font-bold">Setting Tarif SPP</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <SppRateForm years={years} classes={classes} />
                </div>
                <div className="md:col-span-2">
                    <SppRateList data={rates} />
                </div>
            </div>
        </div>
    )
}
