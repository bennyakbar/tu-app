'use server'

import { generateExcelReport } from "@/lib/report";
import { getSession } from "@/lib/auth";

export async function downloadReportAction(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session || session.user.role === 'YAYASAN') {
        // Yayasan View Only (cannot export) - Check Logic
        // PRD Says: Yayasan = View-only (tanpa export)
        // So we block here.
        if (session?.user?.role === 'YAYASAN') return { error: "Akses ditolak" };
    }

    const month = parseInt(formData.get("month") as string);
    const year = parseInt(formData.get("year") as string);

    try {
        const buf = await generateExcelReport(month, year);
        // Base64 encode to send back to client component to trigger download
        return {
            success: true,
            data: buf.toString('base64'),
            filename: `Laporan_TU_${year}_${month}.xlsx`
        };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || "Gagal membuat laporan" };
    }
}
