import { Database } from "lucide-react";

export default function MasterPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="bg-indigo-100 p-4 rounded-full">
                <Database className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Master Data</h1>
            <p className="text-gray-500 max-w-sm">
                Modul manajemen Tahun Ajaran, Kelas, Kenaikan Kelas, dan Jenis Pembayaran akan diimplementasikan pada tahap selanjutnya.
            </p>
        </div>
    )
}
