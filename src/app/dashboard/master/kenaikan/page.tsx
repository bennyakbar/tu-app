import prisma from "@/lib/prisma";
import { PromotionForm } from "@/components/master/PromotionForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const runtime = "nodejs";

export default async function PromotionPage(props: {
    searchParams: Promise<{ from?: string }>;
}) {
    const searchParams = await props.searchParams;
    const fromClassId = searchParams?.from;

    const classes = await prisma.class.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' }
    });

    const students = fromClassId
        ? await prisma.student.findMany({
            where: { class_id: fromClassId, is_active: true },
            orderBy: { name: 'asc' },
            select: { id: true, nis: true, name: true }
        })
        : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/master"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Kenaikan Kelas</h1>
                    <p className="text-gray-500">Proses pemindahan siswa ke kelas berikutnya</p>
                </div>
            </div>

            <PromotionForm
                classes={classes}
                students={students}
                fromClassId={fromClassId}
            />
        </div>
    );
}
