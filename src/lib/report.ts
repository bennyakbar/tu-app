import prisma from "@/lib/prisma";
import { formatIDR } from "@/lib/utils";
import * as XLSX from "xlsx";

export async function generateExcelReport(month: number, year: number) {
    // 1. Get Active Academic Year
    const academicYear = await prisma.academicYear.findFirst({
        where: { is_active: true },
    });

    if (!academicYear) throw new Error("Tahun ajaran aktif belum diset");

    // 2. Get Payments (Income)
    // Logic: Get all payments made in the selected month/year filter
    // This is "Pemasukan SPP Bulan Berjalan" (Revenue in specific month)
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const payments = await prisma.payment.findMany({
        where: {
            payment_date: {
                gte: startDate,
                lte: endDate,
            },
            fee_type: {
                is_spp: true, // Only SPP as per user requirement "Total pemasukan SPP bulan berjalan"
                type: "RUTIN",
            },
        },
        include: {
            student: { include: { class: true } },
            fee_type: true
        }
    });

    // 3. Calculate Arrears (Tunggakan)
    // Logic: 
    // - Get all active students
    // - For each student, check their SPP Rate
    // - Count how many months have passed in current academic year vs how many SPP payments they made.
    // - NOTE: Implementation simplifiers: 
    //   - Assumption: Arrears calculation is complex. 
    //   - Simple Logic: 
    //     If current month is X, student should have paid X times. 
    //     Total Should Pay = X * Rate
    //     Total Paid = Sum(amount_paid) for SPP in this academic year
    //     Arrears = Total Should Pay - Total Paid

    // Determine "Current Month Index" relative to Academic Year start.
    // Using simple calendar year month for now. If Academic Year starts July:
    // Month 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6
    // But USER REQ: "Tunggakan dihitung per bulan".
    // Let's assume standard school year: July starts.
    // We need to calculate how many months have passed up to "Now".

    const now = new Date(); // Use current date for "Tunggakan Saat Ini"
    // If report is historical, maybe we shouldn't calculate historical arrears (too complex).
    // Let's stick to "Current Tunggakan Status".

    const students = await prisma.student.findMany({
        where: { is_active: true },
        include: { class: true }
    });

    const studentsReport = [];

    for (const s of students) {
        // Get Rate
        const rate = await prisma.sppRate.findFirst({
            where: {
                academic_year_id: academicYear.id,
                class_id: s.class_id,
                category: s.spp_category
            }
        });

        const rateAmount = rate ? Number(rate.amount) : 0;

        // Get Total Paid SPP for this Academic Year
        const paid = await prisma.payment.aggregate({
            _sum: { amount_paid: true },
            where: {
                student_id: s.id,
                academic_year_id: academicYear.id,
                fee_type: { is_spp: true }
            }
        });
        const totalPaid = Number(paid._sum.amount_paid || 0);

        // Function to calculate months passed since July of start year
        // Assuming Academic Year name format "2025/2026"
        const startYear = parseInt(academicYear.name.split('/')[0]);
        // Jul (7) -> start
        // Logic: 
        // Diff in months from Start Date (July 1st, StartYear) to NOW.
        const startSem = new Date(startYear, 6, 1); // July 1st

        let monthsPassed = (now.getFullYear() - startSem.getFullYear()) * 12 + (now.getMonth() - startSem.getMonth()) + 1;
        if (monthsPassed < 0) monthsPassed = 0; // Future academic year?

        const totalShouldPay = monthsPassed * rateAmount;
        const arrears = Math.max(0, totalShouldPay - totalPaid);

        studentsReport.push({
            nis: s.nis,
            nama: s.name,
            kelas: s.class.name,
            kategori: s.spp_category,
            tarif: rateAmount,
            total_wajib: totalShouldPay,
            total_bayar: totalPaid,
            tunggakan: arrears,
            status: arrears > 0 ? "BELUM LUNAS" : "LUNAS"
        });
    }

    // 4. Create Excel Buffer
    const wb = XLSX.utils.book_new();

    // Sheet 1: Pemasukan (Income Log)
    const incomeData = payments.map(p => ({
        Tanggal: p.payment_date.toISOString().split('T')[0],
        NIS: p.student.nis,
        Nama: p.student.name,
        Kelas: p.student.class.name,
        Bulan_Bayar: p.month,
        Jumlah: Number(p.amount_paid)
    }));
    const ws1 = XLSX.utils.json_to_sheet(incomeData);
    XLSX.utils.book_append_sheet(wb, ws1, "Pemasukan SPP");

    // Sheet 2: Tunggakan (Arrears Report)
    const arrearsData = studentsReport.map(s => ({
        ...s,
        tarif: formatIDR(s.tarif),
        total_wajib: formatIDR(s.total_wajib),
        total_bayar: formatIDR(s.total_bayar),
        tunggakan: formatIDR(s.tunggakan)
    }));
    const ws2 = XLSX.utils.json_to_sheet(arrearsData);
    XLSX.utils.book_append_sheet(wb, ws2, "Laporan Tunggakan");

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return buf;
}
