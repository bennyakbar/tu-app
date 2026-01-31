'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const sppRateSchema = z.object({
    academic_year_id: z.string().min(1, "Tahun ajaran wajib dipilih"),
    class_id: z.string().min(1, "Kelas wajib dipilih"),
    category: z.enum(["REGULER", "SUBSIDI"]),
    amount: z.coerce.number().min(0, "Nominal tidak boleh negatif")
})

export async function createSppRate(prevState: any, formData: FormData) {
    const academic_year_id = formData.get("academic_year_id") as string
    const class_id = formData.get("class_id") as string
    const category = formData.get("category") as "REGULER" | "SUBSIDI"
    const amount = formData.get("amount")

    const result = sppRateSchema.safeParse({ academic_year_id, class_id, category, amount })
    if (!result.success) {
        return { error: result.error.issues[0].message }
    }

    try {
        // Check duplicate
        const existing = await prisma.sppRate.findFirst({
            where: {
                academic_year_id: result.data.academic_year_id,
                class_id: result.data.class_id,
                category: result.data.category
            }
        })

        if (existing) {
            // Update existing? Or Error? User asked for safe steps.
            // Updating is usually better UX for "Setting Rates".
            // Let's UPDATE if exists.
            await prisma.sppRate.update({
                where: { id: existing.id },
                data: { amount: result.data.amount }
            })
            revalidatePath('/dashboard/master/tarif-spp')
            return { success: "Tarif berhasil diperbarui" }
        }

        await prisma.sppRate.create({
            data: {
                academic_year_id: result.data.academic_year_id,
                class_id: result.data.class_id,
                category: result.data.category,
                amount: result.data.amount,
                is_active: true
            }
        })

        revalidatePath('/dashboard/master/tarif-spp')
        return { success: "Tarif berhasil ditambahkan" }
    } catch (e) {
        console.error(e)
        return { error: "Gagal menyimpan data tarif" }
    }
}

export async function deleteSppRate(id: string) {
    try {
        await prisma.sppRate.delete({
            where: { id }
        })
        revalidatePath('/dashboard/master/tarif-spp')
        return { success: true }
    } catch (e) {
        return { error: "Gagal menghapus tari. Tarif mungkin sudah digunakan." }
    }
}

export async function updateSppRate(prevState: any, formData: FormData) {
    const id = formData.get("id") as string
    const amount = formData.get("amount")

    if (!id || !amount) return { error: "Data tidak valid" }

    const parsedAmount = Number(amount)
    if (isNaN(parsedAmount) || parsedAmount < 0) return { error: "Nominal tidak valid" }

    try {
        await prisma.sppRate.update({
            where: { id },
            data: { amount: parsedAmount }
        })
        revalidatePath('/dashboard/master/tarif-spp')
        return { success: "Nominal tarif berhasil diperbarui" }
    } catch (e) {
        return { error: "Gagal update tarif" }
    }
}
