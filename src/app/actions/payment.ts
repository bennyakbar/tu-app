'use server'

import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const paymentSchema = z.object({
    student_id: z.string(),
    fee_type_id: z.string(),
    academic_year_id: z.string(),
    month: z.coerce.number().optional(),
    amount_paid: z.coerce.number().min(1),
})

export async function createPayment(prevState: any, formData: FormData) {
    const session = await getSession()
    if (!session) return { error: "Unauthorized" }

    const data = {
        student_id: formData.get("student_id"),
        fee_type_id: formData.get("fee_type_id"),
        academic_year_id: formData.get("academic_year_id"),
        month: formData.get("month"), // can be null/empty
        amount_paid: formData.get("amount_paid"),
    }

    const result = paymentSchema.safeParse(data)
    if (!result.success) {
        return { error: "Data tidak valid" }
    }

    const { student_id, fee_type_id, academic_year_id, month, amount_paid } = result.data

    try {
        // 1. Check duplicate for SPP (Rutin)
        if (month) {
            const existing = await prisma.payment.findFirst({
                where: {
                    student_id,
                    fee_type_id,
                    academic_year_id,
                    month
                }
            })
            if (existing) {
                return { error: "Pembayaran untuk bulan ini sudah ada!" }
            }
        }

        // 2. Create Payment
        await prisma.payment.create({
            data: {
                student_id,
                fee_type_id,
                academic_year_id,
                month: month || null,
                amount_paid,
                payment_date: new Date(),
                created_by: session.user.id
            }
        })

        revalidatePath(`/dashboard/pembayaran/${student_id}`)
        return { success: "Pembayaran berhasil disimpan" }

    } catch (error) {
        console.error(error)
        return { error: "Gagal menyimpan pembayaran" }
    }
}

export async function createReceipt(studentId: string, paymentIds: string[]) {
    const session = await getSession()
    if (!session) return { error: "Unauthorized" }

    if (!paymentIds.length) return { error: "Pilih minimal satu pembayaran" }

    try {
        // 1. Generate Receipt Number
        const date = new Date()
        const yyyymm = date.toISOString().slice(0, 7).replace('-', '') // 202501

        // Count receipts this month for sequence
        // Note: This is simple sequence, might have race conditions in high concurrency but acceptable for single-school TU (1-3 users).
        const count = await prisma.receipt.count({
            where: {
                receipt_number: { startsWith: `MINF-${yyyymm}` }
            }
        })
        const sequence = (count + 1).toString().padStart(4, '0')
        const receiptNumber = `MINF-${yyyymm}-${sequence}`

        // 2. Get Total Amount
        const payments = await prisma.payment.findMany({
            where: { id: { in: paymentIds } }
        })
        const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount_paid), 0)

        // 3. Create Receipt Header
        const receipt = await prisma.receipt.create({
            data: {
                receipt_number: receiptNumber,
                student_id: studentId,
                receipt_date: new Date(),
                total_amount: totalAmount,
                created_by: session.user.id,
                receipt_items: {
                    create: paymentIds.map(id => ({ payment_id: id }))
                }
            }
        })

        revalidatePath(`/dashboard/pembayaran/${studentId}`)
        return { success: true, receiptId: receipt.id }

    } catch (e) {
        console.error(e)
        return { error: "Gagal membuat kwitansi" }
    }
}
