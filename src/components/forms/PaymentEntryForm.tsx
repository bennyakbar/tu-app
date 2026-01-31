'use client'

import { useActionState, useEffect, useState } from 'react'
import { createPayment } from '@/app/actions/payment'
import { formatIDR } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

// types
type FeeType = { id: string, name: string, is_spp: boolean, type: string }
type SppRate = { amount: string } // decimal string

interface PaymentEntryFormProps {
    studentId: string
    academicYearId: string
    feeTypes: FeeType[]
    sppRate?: string
}

const MONTHS = [
    { val: 7, label: 'Juli' }, { val: 8, label: 'Agustus' }, { val: 9, label: 'September' },
    { val: 10, label: 'Oktober' }, { val: 11, label: 'November' }, { val: 12, label: 'Desember' },
    { val: 1, label: 'Januari' }, { val: 2, label: 'Februari' }, { val: 3, label: 'Maret' },
    { val: 4, label: 'April' }, { val: 5, label: 'Mei' }, { val: 6, label: 'Juni' },
]

export function PaymentEntryForm({ studentId, academicYearId, feeTypes, sppRate }: PaymentEntryFormProps) {
    const [state, formAction, isPending] = useActionState(createPayment, undefined)
    const [selectedFeeId, setSelectedFeeId] = useState(feeTypes.find(f => f.is_spp)?.id || '')
    const [amount, setAmount] = useState('')

    const selectedFee = feeTypes.find(f => f.id === selectedFeeId)
    const isSpp = selectedFee?.is_spp

    // Auto set amount if SPP
    useEffect(() => {
        if (isSpp && sppRate) {
            setAmount(sppRate)
        } else if (isSpp) {
            setAmount('')
        }
    }, [isSpp, sppRate])

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4">Input Pembayaran Baru</h2>

            <form action={formAction} className="space-y-4">
                <input type="hidden" name="student_id" value={studentId} />
                <input type="hidden" name="academic_year_id" value={academicYearId} />

                {/* Status Message */}
                {state?.error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{state.error}</div>}
                {state?.success && <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">{state.success}</div>}

                <div>
                    <label className="block text-sm font-medium mb-1">Jenis Pembayaran</label>
                    <select
                        name="fee_type_id"
                        className="w-full p-2 border rounded-lg dark:bg-gray-700"
                        value={selectedFeeId}
                        onChange={(e) => setSelectedFeeId(e.target.value)}
                    >
                        {feeTypes.map(f => (
                            <option key={f.id} value={f.id}>{f.name} {f.is_spp ? '(Rutin)' : ''}</option>
                        ))}
                    </select>
                </div>

                {isSpp && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Bulan</label>
                        <select name="month" className="w-full p-2 border rounded-lg dark:bg-gray-700" required>
                            <option value="">Pilih Bulan...</option>
                            {MONTHS.map(m => (
                                <option key={m.val} value={m.val}>{m.label}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1">Nominal (Rp)</label>
                    <input
                        name="amount_paid"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700"
                        placeholder="0"
                        required
                    />
                    {isSpp && <p className="text-xs text-gray-500 mt-1">Tarif SPP: {sppRate ? formatIDR(sppRate) : 'Belum diset'}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center"
                >
                    {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Simpan Pembayaran
                </button>
            </form>
        </div>
    )
}
