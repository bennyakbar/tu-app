import { PrismaClient, Role, StudentCategory, FeeTypeCategory } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    // 1. Create Users
    const passwordHash = await bcrypt.hash('123456', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@tu.com' },
        update: {},
        create: {
            name: 'Admin Tata Usaha',
            email: 'admin@tu.com',
            password_hash: passwordHash,
            role: Role.ADMIN_TU,
        },
    })

    const bendahara = await prisma.user.upsert({
        where: { email: 'bendahara@tu.com' },
        update: {},
        create: {
            name: 'Ibu Bendahara',
            email: 'bendahara@tu.com',
            password_hash: passwordHash,
            role: Role.BENDAHARA,
        },
    })

    const yayasan = await prisma.user.upsert({
        where: { email: 'yayasan@tu.com' },
        update: {},
        create: {
            name: 'Ketua Yayasan',
            email: 'yayasan@tu.com',
            password_hash: passwordHash,
            role: Role.YAYASAN,
        },
    })

    console.log({ admin, bendahara, yayasan })

    // 2. Create Academic Year
    const ta = await prisma.academicYear.create({
        data: {
            name: '2025/2026',
            is_active: true,
        },
    })

    // 3. Create Classes
    const kelas1 = await prisma.class.create({
        data: { name: 'Kelas 1', level: 1 },
    })
    const kelas2 = await prisma.class.create({
        data: { name: 'Kelas 2', level: 2 },
    })

    // 4. Create Fee Types (SPP & Buku)
    const spp = await prisma.feeType.create({
        data: {
            name: 'SPP Bulanan',
            type: FeeTypeCategory.RUTIN,
            is_spp: true,
        },
    })

    const uangBuku = await prisma.feeType.create({
        data: {
            name: 'Uang Buku Paket',
            type: FeeTypeCategory.NON_RUTIN,
            is_spp: false,
        },
    })

    // 5. Create SPP Rates
    await prisma.sppRate.create({
        data: {
            class_id: kelas1.id,
            academic_year_id: ta.id,
            category: StudentCategory.REGULER,
            amount: 100000,
        },
    })

    await prisma.sppRate.create({
        data: {
            class_id: kelas1.id,
            academic_year_id: ta.id,
            category: StudentCategory.SUBSIDI,
            amount: 50000,
        },
    })

    // 6. Create Students
    const s1 = await prisma.student.create({
        data: {
            nis: '2025001',
            name: 'Budi Santoso',
            class_id: kelas1.id,
            spp_category: StudentCategory.REGULER,
        }
    })

    const s2 = await prisma.student.create({
        data: {
            nis: '2025002',
            name: 'Siti Aminah',
            class_id: kelas1.id,
            spp_category: StudentCategory.SUBSIDI,
        }
    })

    const s3 = await prisma.student.create({ // Belum bayar
        data: {
            nis: '2025003',
            name: 'Ahmad Dahlan',
            class_id: kelas2.id,
            spp_category: StudentCategory.REGULER,
        }
    })

    // 7. Create Dummy Payment (S1 sudah bayar Juli)
    await prisma.payment.create({
        data: {
            student_id: s1.id,
            fee_type_id: spp.id,
            academic_year_id: ta.id,
            month: 7, // Juli
            amount_paid: 100000,
            payment_date: new Date(),
            created_by: admin.id,
        }
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
