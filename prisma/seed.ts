import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
    const email = "admin@sekolah.id";
    const existing = await prisma.user.findUnique({ where: { email } });

    if (!existing) {
        const password_hash = await bcrypt.hash("admin123", 10);
        await prisma.user.create({
            data: {
                name: "Administrator TU",
                email,
                password_hash,
                role: "ADMIN_TU",
                is_active: true,
            },
        });
        console.log("Created Admin User: admin@sekolah.id / admin123");
    } else {
        console.log("Admin User already exists.");
    }

    // Seed Bendahara
    const bendaharaEmail = "bendahara@sekolah.id";
    const existingBendahara = await prisma.user.findUnique({ where: { email: bendaharaEmail } });
    if (!existingBendahara) {
        const password_hash = await bcrypt.hash("bendahara123", 10);
        await prisma.user.create({
            data: {
                name: "Staff Bendahara",
                email: bendaharaEmail,
                password_hash,
                role: "BENDAHARA",
                is_active: true,
            },
        });
        console.log("Created Bendahara: bendahara@sekolah.id / bendahara123");
    }

    // Seed Yayasan
    const yayasanEmail = "yayasan@sekolah.id";
    const existingYayasan = await prisma.user.findUnique({ where: { email: yayasanEmail } });
    if (!existingYayasan) {
        const password_hash = await bcrypt.hash("yayasan123", 10);
        await prisma.user.create({
            data: {
                name: "Ketua Yayasan",
                email: yayasanEmail,
                password_hash,
                role: "YAYASAN",
                is_active: true,
            },
        });
        console.log("Created Yayasan: yayasan@sekolah.id / yayasan123");
    }

    // Optional: Seed Academic Year if empty
    const year = await prisma.academicYear.findFirst();
    if (!year) {
        await prisma.academicYear.create({
            data: { name: "2025/2026", is_active: true }
        });
        console.log("Created Default Academic Year: 2025/2026");
    }

    // Seed Demo Data
    const c1 = await prisma.class.upsert({
        where: { id: 'class-1a' },
        update: {},
        create: { id: 'class-1a', name: '1A', level: 1, is_active: true }
    });

    const spp = await prisma.feeType.upsert({
        where: { id: 'fee-spp' },
        update: {},
        create: { id: 'fee-spp', name: 'SPP Bulanan', type: 'RUTIN', is_spp: true, is_active: true }
    });

    await prisma.student.upsert({
        where: { nis: '1001' },
        update: {},
        create: { nis: '1001', name: 'Ahmad Siswa', class_id: c1.id, spp_category: 'REGULER', is_active: true }
    });

    await prisma.student.upsert({
        where: { nis: '1002' },
        update: {},
        create: { nis: '1002', name: 'Budi Pelajar', class_id: c1.id, spp_category: 'SUBSIDI', is_active: true }
    });

    console.log("Seeded Demo Data: Students (1001, 1002), Class 1A, Fee SPP.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
