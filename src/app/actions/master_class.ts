'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// --- Classes Actions ---

const classSchema = z.object({
    name: z.string().min(2, "Nama kelas minimal 2 karakter"),
    level: z.coerce.number().min(1).max(6)
})

export async function createClass(prevState: any, formData: FormData) {
    const name = formData.get("name") as string
    const level = formData.get("level")

    const result = classSchema.safeParse({ name, level })
    if (!result.success) {
        return { error: result.error.issues[0].message }
    }

    try {
        // Check duplicate name
        const existing = await prisma.class.findFirst({
            where: { name: result.data.name }
        })
        if (existing) {
            return { error: `Kelas ${result.data.name} sudah ada.` }
        }

        await prisma.class.create({
            data: {
                name: result.data.name,
                level: result.data.level,
                is_active: true
            }
        })

        revalidatePath('/dashboard/master/kelas')
        return { success: "Kelas berhasil ditambahkan" }
    } catch (e) {
        console.error(e)
        return { error: "Gagal menyimpan data kelas" }
    }
}

export async function toggleClassStatus(id: string, currentStatus: boolean) {
    try {
        await prisma.class.update({
            where: { id },
            data: { is_active: !currentStatus }
        })
        revalidatePath('/dashboard/master/kelas')
        return { success: true }
    } catch (e) {
        return { error: "Gagal mengubah status" }
    }
}
