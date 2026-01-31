'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import * as XLSX from 'xlsx'

type ImportResult = {
    success: number
    failed: number
    errors: string[]
}

export async function importStudents(prevState: any, formData: FormData): Promise<ImportResult | { error: string }> {
    const file = formData.get('file') as File

    if (!file || file.size === 0) {
        return { error: 'File wajib diunggah' }
    }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const workbook = XLSX.read(buffer, { type: 'buffer' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json(sheet) as any[]

        if (rows.length === 0) {
            return { error: 'File kosong atau format salah' }
        }

        let successCount = 0
        let failCount = 0
        const errors: string[] = []

        // Pre-fetch classes to minimize DB calls
        const allClasses = await prisma.class.findMany()
        const classMap = new Map<string, string>(allClasses.map((c: any) => [c.name.toUpperCase(), c.id]))

        for (const [index, row] of rows.entries()) {
            const rowNum = index + 2 // +2 because 0-index + header row

            // Expected columns: NIS, Nama, Kelas, Kategori
            const nis = String(row['NIS'] || row['nis'] || '').trim()
            const name = String(row['Nama'] || row['nama'] || '').trim()
            const className = String(row['Kelas'] || row['kelas'] || '').trim()
            const categoryRaw = String(row['Kategori'] || row['kategori'] || '').toUpperCase()

            if (!nis || !name || !className) {
                failCount++
                errors.push(`Baris ${rowNum}: Data tidak lengkap (NIS, Nama, Kelas wajib ada)`)
                continue
            }

            // Validate Category
            const category = (categoryRaw === 'SUBSIDI') ? 'SUBSIDI' : 'REGULER'

            // Find or Create Class
            let classId = classMap.get(className.toUpperCase())
            if (!classId) {
                // For safety, let's create the class if it doesn't exist, assuming Level 1 by default or extract from name
                // But auto-creating classes might imply weird names.
                // Let's try to extract level from name (e.g. "1A" -> 1)
                const levelMatch = className.match(/\d+/)
                const level = levelMatch ? parseInt(levelMatch[0]) : 1

                try {
                    const newClass = await prisma.class.create({
                        data: {
                            name: className,
                            level: level,
                            is_active: true
                        }
                    })
                    classId = newClass.id
                    classMap.set(className.toUpperCase(), classId)
                } catch (e) {
                    failCount++
                    errors.push(`Baris ${rowNum}: Gagal membuat kelas ${className}`)
                    continue
                }
            }

            if (!classId) {
                // Should not happen due to continue above, but TS needs assurance
                failCount++
                continue
            }

            // Create Student
            try {
                // Check if exists
                const exist = await prisma.student.findUnique({ where: { nis } })
                if (exist) {
                    // Optionally update? For now, skip to avoid overwriting accidentally.
                    failCount++
                    errors.push(`Baris ${rowNum}: NIS ${nis} sudah terdaftar`)
                    continue
                }

                await prisma.student.create({
                    data: {
                        nis,
                        name,
                        class_id: classId,
                        spp_category: category,
                        is_active: true
                    }
                })
                successCount++
            } catch (e) {
                failCount++
                errors.push(`Baris ${rowNum}: Gagal menyimpan siswa`)
            }
        }

        revalidatePath('/dashboard/siswa')
        return { success: successCount, failed: failCount, errors: errors.slice(0, 5) } // Limit errors returned

    } catch (e) {
        console.error(e)
        return { error: 'Gagal memproses file excel' }
    }
}
