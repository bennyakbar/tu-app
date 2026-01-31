'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const feeTypeSchema = z.object({
    name: z.string().min(2, "Nama biaya minimal 2 karakter"),
    type: z.enum(["RUTIN", "NON_RUTIN"]),
    is_spp: z.boolean().optional()
})

export async function createFeeType(prevState: any, formData: FormData) {
    const name = formData.get("name") as string
    const type = formData.get("type") as "RUTIN" | "NON_RUTIN"
    const is_spp = formData.get("is_spp") === "on"

    const result = feeTypeSchema.safeParse({ name, type, is_spp })
    if (!result.success) {
        return { error: result.error.issues[0].message }
    }

    // Business Rule: NON_RUTIN cannot be SPP
    if (result.data.type === "NON_RUTIN" && result.data.is_spp) {
        return { error: "Biaya Non-Rutin tidak bisa diset sebagai SPP Bulanan." }
    }

    try {
        // Check duplicate
        const existing = await prisma.feeType.findFirst({
            where: { name: result.data.name }
        })
        if (existing) {
            return { error: `Biaya ${result.data.name} sudah ada.` }
        }

        await prisma.feeType.create({
            data: {
                name: result.data.name,
                type: result.data.type,
                is_spp: result.data.is_spp || false,
                is_active: true
            }
        })

        revalidatePath('/dashboard/master/biaya')
        return { success: "Jenis biaya berhasil ditambahkan" }
    } catch (e) {
        console.error(e)
        return { error: "Gagal menyimpan data" }
    }
}

export async function toggleFeeTypeStatus(id: string, currentStatus: boolean) {
    try {
        await prisma.feeType.update({
            where: { id },
            data: { is_active: !currentStatus }
        })
        revalidatePath('/dashboard/master/biaya')
        return { success: true }
    } catch (e) {
        return { error: "Gagal mengubah status" }
    }
}

export async function deleteFeeType(id: string) {
    try {
        // Safe Delete Check: Are there payments?
        const count = await prisma.payment.count({
            where: { fee_type_id: id }
        })

        if (count > 0) {
            return { error: `Tidak bisa dihapus karena ada ${count} data pembayaran terkait. Non-aktifkan saja.` }
        }

        await prisma.feeType.delete({
            where: { id }
        })

        revalidatePath('/dashboard/master/biaya')
        return { success: "Jenis biaya berhasil dihapus permanen" }
    } catch (e) {
        return { error: "Gagal menghapus data" }
    }
}
