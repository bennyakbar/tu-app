import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { KwitansiPDF } from "@/components/pdf/KwitansiPDF";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Fix for Next.js 15+ dynamic params
) {
    const { id } = await params;
    const session = await getSession();

    // Basic security
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const receipt = await prisma.receipt.findUnique({
            where: { id },
            include: {
                student: {
                    include: {
                        class: true,
                    },
                },
                user: true, // Created by
                receipt_items: {
                    include: {
                        payment: {
                            include: {
                                fee_type: true,
                                academic_year: true,
                            },
                        },
                    },
                },
            },
        });

        if (!receipt) {
            return new NextResponse("Kwitansi tidak ditemukan", { status: 404 });
        }

        // Flatten data for PDF component
        const pdfData = {
            receipt_number: receipt.receipt_number,
            receipt_date: receipt.receipt_date,
            total_amount: Number(receipt.total_amount),
            student: receipt.student,
            created_by_user: receipt.user,
            items: receipt.receipt_items.map((ri) => ({
                id: ri.payment.id,
                amount_paid: Number(ri.payment.amount_paid),
                month: ri.payment.month,
                fee_type: ri.payment.fee_type,
                academic_year: ri.payment.academic_year,
            })),
        };

        const stream = await renderToStream(<KwitansiPDF receipt={pdfData} />);

        return new NextResponse(stream as unknown as ReadableStream, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="kwitansi-${receipt.receipt_number}.pdf"`,
            },
        });
    } catch (error) {
        console.error("PDF Gen Error:", error);
        return new NextResponse("Terjadi kesalahan saat generate PDF", {
            status: 500,
        });
    }
}
