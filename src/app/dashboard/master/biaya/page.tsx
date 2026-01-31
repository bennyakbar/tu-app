import prisma from "@/lib/prisma";
import { FeeTypeForm } from "@/components/master/FeeTypeForm";
import { FeeTypeList } from "@/components/master/FeeTypeList";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export default async function FeeTypesPage() {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN_TU') {
        redirect('/dashboard');
    }

    const feeTypes = await prisma.feeType.findMany({
        orderBy: { created_at: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/master"
                    className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors bg-white p-2 rounded-lg shadow-sm border"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-2xl font-bold">Master Jenis Pembayaran</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <FeeTypeForm />
                </div>
                <div className="md:col-span-2">
                    <FeeTypeList data={feeTypes} />
                </div>
            </div>
        </div>
    )
}
