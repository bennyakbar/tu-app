import prisma from "@/lib/prisma"
import { ArrearsReport } from "@/components/dashboard/ArrearsReport"
import { FileWarning } from "lucide-react"

export default async function TunggakanPage() {
    // Fetch Filter Data
    const classes = await prisma.class.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' },
        select: { id: true, name: true }
    })

    const years = await prisma.academicYear.findMany({
        orderBy: { name: 'desc' },
        select: { id: true, name: true, is_active: true }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg text-red-600">
                    <FileWarning className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Laporan Tunggakan</h1>
                    <p className="text-gray-500 text-sm">Cek siswa yang belum melunasi SPP bulanan.</p>
                </div>
            </div>

            <ArrearsReport classes={classes} years={years} />
        </div>
    )
}
