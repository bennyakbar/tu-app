import prisma from "@/lib/prisma";
import { StudentForm } from "@/components/siswa/StudentForm";
import { StudentList } from "@/components/siswa/StudentList";
import { ImportStudentButton } from "@/components/siswa/ImportStudentButton";
import { Users } from "lucide-react";

export const runtime = "nodejs";

export default async function SiswaPage() {
    const students = await prisma.student.findMany({
        include: { class: true },
        orderBy: [
            { class: { level: 'asc' } },
            { class: { name: 'asc' } },
            { nis: 'asc' }
        ]
    });

    const classes = await prisma.class.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' },
        select: { id: true, name: true }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold">Data Siswa</h1>
                </div>
                <div className="flex gap-2">
                    <ImportStudentButton />
                    <StudentForm classes={classes} />
                </div>
            </div>

            <StudentList students={students} classes={classes} />
        </div>
    )
}
