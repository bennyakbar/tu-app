'use client'

import { useActionState } from 'react'
import { authenticate } from '@/app/actions/auth'
import { KeyRound, Mail, School } from 'lucide-react'

export default function LoginPage() {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
            <div className="max-w-md w-full">
                {/* Logo / Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 mb-4">
                        <School className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Tata Usaha
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Masuk untuk mengelola administrasi sekolah
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                    <form action={formAction} className="space-y-6">

                        {/* Error Alert */}
                        {errorMessage?.error && (
                            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                                <span>⚠️</span>
                                {errorMessage.error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="admin@tu.com"
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900 dark:text-white transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <KeyRound className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900 dark:text-white transition-all outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isPending ? 'Memproses...' : 'Masuk Sistem'}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} Aplikasi Tata Usaha Sekolah Dasar
                </div>
            </div>
        </div>
    )
}
