import { Database, CalendarRange, School, GraduationCap, Banknote } from "lucide-react";
import Link from "next/link";

const masters = [
    { name: "Tahun Ajaran", href: "/dashboard/master/tahun-ajaran", icon: CalendarRange, desc: "Kelola tahun ajaran aktif" },
    { name: "Kelas", href: "/dashboard/master/kelas", icon: School, desc: "Master data kelas (1-6)" },
    { name: "Tarif SPP", href: "/dashboard/master/tarif-spp", icon: Banknote, desc: "Setting nominal SPP per kelas" },
    { name: "Jenis Pembayaran", href: "/dashboard/master/biaya", icon: Banknote, desc: "Jenis tagihan lain (Kegiatan, dll)" },
    { name: "Kenaikan Kelas", href: "/dashboard/master/kenaikan", icon: GraduationCap, desc: "Proses kenaikan kelas siswa secara massal" },
]

export default function MasterPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Master Data</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {masters.map((m) => (
                    <Link key={m.name} href={m.href} className="group">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-colors h-full">
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                                <m.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{m.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{m.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
