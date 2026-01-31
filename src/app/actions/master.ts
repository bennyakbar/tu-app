'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const academicYearSchema = z.object({
    name: z.string().min(4, "Format nama tahun ajaran minimal 4 karakter (Cth: 2025/2026)")
})

export async function createAcademicYear(prevState: any, formData: FormData) {
    const name = formData.get("name") as string

    const result = academicYearSchema.safeParse({ name })
    if (!result.success) {
        return { error: result.error.issues[0].message }
    }

    try {
        // Check duplicate
        const existing = await prisma.academicYear.findFirst({
            where: { name: result.data.name }
        })

        if (existing) {
            return { error: "Tahun ajaran sudah ada" }
        }

        await prisma.academicYear.create({
            data: {
                name: result.data.name,
                is_active: false // Default inactive
            }
        })

        revalidatePath('/dashboard/master/tahun-ajaran')
        return { success: "Berhasil ditambahkan" }
    } catch (e) {
        console.error(e)
        return { error: "Gagal menyimpan data" }
    }
}

export async function activateAcademicYear(id: string) {
    try {
        // Transaction to ensure only one is active
        await prisma.$transaction([
            // Deactivate all
            prisma.academicYear.updateMany({
                data: { is_active: false }
            }),
            // Activate target
            prisma.academicYear.update({
                where: { id },
                data: { is_active: true }
            })
        ])

        revalidatePath('/dashboard/master/tahun-ajaran')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: "Gagal mengaktifkan tahun ajaran" }
    }
}
