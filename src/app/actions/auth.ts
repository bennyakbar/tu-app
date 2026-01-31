'use server'

import prisma from "@/lib/prisma"
import { login } from "@/lib/auth"
import bcrypt from "bcrypt"
import { redirect } from "next/navigation"
import { z } from "zod"

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
})

export async function authenticate(prevState: any, formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate
    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
        return { error: "Format email salah atau password kosong" }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return { error: "Email atau password salah" }
        }

        if (!user.is_active) {
            return { error: "Akun ini telah dinonaktifkan" }
        }

        const match = await bcrypt.compare(password, user.password_hash)
        if (!match) {
            return { error: "Email atau password salah" }
        }

        // Login success
        // Remove sensitive data
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password_hash, ...userSafe } = user
        await login(userSafe)

    } catch (error) {
        console.error(error)
        return { error: "Terjadi kesalahan sistem, silakan coba lagi." }
    }

    redirect('/dashboard')
}

export async function logoutAction() {
    const { cookies } = await import("next/headers");
    (await cookies()).set("session", "", { expires: new Date(0) });
}
