'use client'

import { useActionState, useEffect } from "react";
import { downloadReportAction } from "@/app/actions/report";
import { Loader2, FileSpreadsheet } from "lucide-react";

export function ReportForm() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, action, isPending] = useActionState(downloadReportAction, undefined);

    useEffect(() => {
        if (state?.success && state.data) {
            // Trigger download
            const link = document.createElement('a');
            link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${state.data}`;
            link.download = state.filename || 'report.xlsx';
            link.click();
        }
    }, [state]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-md">
            <h2 className="text-lg font-bold mb-4 flex items-center">
                <FileSpreadsheet className="w-5 h-5 mr-2 text-green-600" />
                Download Laporan Excel
            </h2>

            {state?.error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {state.error}
                </div>
            )}

            <form action={action} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Bulan</label>
                        <select name="month" className="w-full p-2 border rounded-lg dark:bg-gray-700" defaultValue={new Date().getMonth() + 1}>
                            {months.map(m => (
                                <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('id-ID', { month: 'long' })}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tahun</label>
                        <select name="year" className="w-full p-2 border rounded-lg dark:bg-gray-700">
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Download .xlsx'}
                </button>
            </form>
        </div>
    )
}
