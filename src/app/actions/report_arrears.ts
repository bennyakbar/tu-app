'use server'

import prisma from "@/lib/prisma"

export type UnpaidStudent = {
    id: string
    nis: string
    name: string
    className: string
    category: string
    amount: number
}

export async function getUnpaidStudents(
    academicYearId: string,
    month: number,
    classId?: string
) {
    if (!academicYearId || !month) return { error: "Filter tidak lengkap" }

    try {
        // 1. Get Active Rates for this Year
        const rates = await prisma.sppRate.findMany({
            where: { academic_year_id: academicYearId },
            include: { class: true }
        })

        // Map Rate: ClassID -> Category -> Amount
        // Map<classId, Map<category, amount>>
        const rateMap = new Map<string, Map<string, number>>()
        rates.forEach(r => {
            if (!rateMap.has(r.class_id)) {
                rateMap.set(r.class_id, new Map())
            }
            rateMap.get(r.class_id)!.set(r.category, Number(r.amount))
        })

        // 2. Get Students (Active Only)
        // If classId provided, filter.
        const students = await prisma.student.findMany({
            where: {
                is_active: true,
                ...(classId && classId !== 'all' ? { class_id: classId } : {})
            },
            include: { class: true },
            orderBy: [
                { class: { level: 'asc' } },
                { class: { name: 'asc' } },
                { name: 'asc' }
            ]
        })

        // 3. Get Payments for this Month & Year (SPP Only)
        const payments = await prisma.payment.findMany({
            where: {
                academic_year_id: academicYearId,
                month: month,
                fee_type: { is_spp: true }
            },
            select: { student_id: true }
        })

        const paidIds = new Set(payments.map(p => p.student_id))

        // 4. Filter Unpaid and Attach Amount
        const unpaidList: UnpaidStudent[] = []

        for (const s of students) {
            if (paidIds.has(s.id)) continue

            // Find Rate
            const classRates = rateMap.get(s.class_id)
            let amount = 0
            if (classRates) {
                amount = classRates.get(s.spp_category) || 0
            }

            unpaidList.push({
                id: s.id,
                nis: s.nis,
                name: s.name,
                className: s.class.name,
                category: s.spp_category,
                amount
            })
        }

        return { data: unpaidList }

    } catch (e) {
        console.error(e)
        return { error: "Gagal memuat data tunggakan" }
    }
}
