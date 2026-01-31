'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const studentSchema = z.object({
    nis: z.string().min(3, "NIS wajib diisi"),
    name: z.string().min(3, "Nama wajib diisi"),
    class_id: z.string().min(1, "Kelas wajib dipilih"),
    spp_category: z.enum(["REGULER", "SUBSIDI"])
})

export async function createStudent(prevState: any, formData: FormData) {
    const nis = formData.get("nis") as string
    const name = formData.get("name") as string
    const class_id = formData.get("class_id") as string
    const spp_category = formData.get("spp_category") as "REGULER" | "SUBSIDI"

    const result = studentSchema.safeParse({ nis, name, class_id, spp_category })
    if (!result.success) {
        return { error: result.error.issues[0].message }
    }

    try {
        // Check duplicate NIS
        const existing = await prisma.student.findUnique({
            where: { nis: result.data.nis }
        })
        if (existing) {
            return { error: `NIS ${result.data.nis} sudah terdaftar atas nama ${existing.name}` }
        }

        await prisma.student.create({
            data: {
                nis: result.data.nis,
                name: result.data.name,
                class_id: result.data.class_id,
                spp_category: result.data.spp_category,
                is_active: true
            }
        })

        revalidatePath('/dashboard/siswa')
        return { success: "Siswa berhasil ditambahkan" }
    } catch (e) {
        console.error(e)
        return { error: "Gagal menyimpan data siswa" }
    }
}

export async function updateStudent(prevState: any, formData: FormData) {
    const id = formData.get("id") as string
    const nis = formData.get("nis") as string
    const name = formData.get("name") as string
    const class_id = formData.get("class_id") as string
    const spp_category = formData.get("spp_category") as "REGULER" | "SUBSIDI"

    if (!id) return { error: "ID tidak Valid" }

    const result = studentSchema.safeParse({ nis, name, class_id, spp_category })
    if (!result.success) {
        return { error: result.error.issues[0].message }
    }

    try {
        // Check duplicate NIS (exclude self)
        const existing = await prisma.student.findFirst({
            where: {
                nis: result.data.nis,
                NOT: { id }
            }
        })
        if (existing) {
            return { error: `NIS ${result.data.nis} sudah digunakan oleh ${existing.name}` }
        }

        await prisma.student.update({
            where: { id },
            data: {
                nis: result.data.nis,
                name: result.data.name,
                class_id: result.data.class_id,
                spp_category: result.data.spp_category,
            }
        })

        revalidatePath('/dashboard/siswa')
        return { success: "Data siswa berhasil diperbarui" }
    } catch (e) {
        console.error(e)
        return { error: "Gagal memperbarui data siswa" }
    }
}

export async function toggleStudentStatus(id: string, currentStatus: boolean) {
    try {
        await prisma.student.update({
            where: { id },
            data: { is_active: !currentStatus }
        })
        revalidatePath('/dashboard/siswa')
        return { success: true }
    } catch (e) {
        return { error: "Gagal mengubah status" }
    }
}
