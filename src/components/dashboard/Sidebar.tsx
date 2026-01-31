'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, CreditCard, FileText, Database, LogOut, School } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/app/actions/auth'

type Role = 'ADMIN_TU' | 'BENDAHARA' | 'YAYASAN'

interface SidebarProps {
    user: {
        name: string
        role: Role
    }
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname()

    const menus = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            roles: ['ADMIN_TU', 'BENDAHARA', 'YAYASAN']
        },
        {
            name: 'Pembayaran',
            href: '/dashboard/pembayaran',
            icon: CreditCard,
            roles: ['ADMIN_TU']
        },
        {
            name: 'Data Siswa',
            href: '/dashboard/siswa',
            icon: Users,
            roles: ['ADMIN_TU']
        },
        {
            name: 'Laporan',
            href: '/dashboard/laporan',
            icon: FileText,
            roles: ['ADMIN_TU', 'BENDAHARA']
        },
        {
            name: 'Master Data',
            href: '/dashboard/master',
            icon: Database,
            roles: ['ADMIN_TU']
        }
    ]

    const filteredMenus = menus.filter(menu => menu.roles.includes(user.role))

    return (
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
                <School className="w-6 h-6 text-indigo-600 mr-2" />
                <span className="font-bold text-lg dark:text-white">Tata Usaha</span>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="px-2 mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
                </div>
                {filteredMenus.map((menu) => {
                    const Icon = menu.icon
                    const isActive = pathname === menu.href || pathname.startsWith(`${menu.href}/`)

                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={cn(
                                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                isActive
                                    ? "bg-indigo-50 text-indigo-600 dark:bg-gray-700 dark:text-indigo-400"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            )}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            {menu.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                        {user.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.role.replace('_', ' ')}</p>
                    </div>
                </div>
                <button
                    onClick={() => logoutAction()}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Keluar
                </button>
            </div>
        </div>
    )
}
