'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function promoteStudents(
    prevState: any,
    formData: FormData
) {
    const fromClassId = formData.get('fromClassId') as string;
    const toClassId = formData.get('toClassId') as string;

    // getAll('studentIds') might depend on how the form submits checked items
    // If checkboxes have same name "studentIds", formData.getAll works.
    const studentIds = formData.getAll('studentIds') as string[];

    if (!fromClassId || !toClassId) {
        return { success: false, message: "Pilih kelas asal dan kelas tujuan." };
    }

    if (studentIds.length === 0) {
        return { success: false, message: "Tidak ada siswa yang dipilih." };
    }

    if (fromClassId === toClassId) {
        return { success: false, message: "Kelas asal dan tujuan tidak boleh sama." };
    }

    try {
        await prisma.student.updateMany({
            where: {
                id: { in: studentIds },
                class_id: fromClassId, // Safety check
            },
            data: {
                class_id: toClassId,
            }
        });

        revalidatePath('/dashboard/master/kelas');
        revalidatePath('/dashboard/siswa');

        return { success: true, message: `Berhasil memindahkan ${studentIds.length} siswa.` };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Gagal memproses data." };
    }
}
