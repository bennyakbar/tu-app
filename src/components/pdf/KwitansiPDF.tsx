/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { formatIDR } from '@/lib/utils';

// Register font (optional, using standard fonts for now for speed/reliability)
// Font.register({ family: 'Helvetica', src: '...' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 20, // Reduced from 30
        fontSize: 9, // Reduced from 10
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        marginBottom: 10, // Reduced from 20
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingBottom: 5, // Reduced
        alignItems: 'center',
    },
    logo: {
        width: 60,
        height: 60,
        marginRight: 15,
    },
    schoolInfo: {
        flexDirection: 'column',
    },
    schoolName: {
        fontSize: 14, // Reduced from 16
        fontWeight: 'bold',
        marginBottom: 2,
    },
    schoolAddress: {
        fontSize: 8, // Reduced
        color: '#555',
    },
    title: {
        fontSize: 12, // Reduced from 14
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10, // Reduced from 20
        textDecoration: 'underline',
    },
    metaContainer: {
        marginBottom: 10,
    },
    label: {
        width: 80,
        fontWeight: 'bold',
        color: '#555',
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginBottom: 5,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableColHeader: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: '#f0f0f0',
    },
    tableCol: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableCellHeader: {
        margin: 3, // Reduced from 5
        fontSize: 8,
        fontWeight: 'bold',
    },
    tableCell: {
        margin: 3, // Reduced from 5
        fontSize: 8,
    },
    totalRow: {
        flexDirection: 'row',
        marginTop: 5, // Reduced
        justifyContent: 'flex-end',
    },
    totalLabel: {
        fontWeight: 'bold',
        marginRight: 10,
        fontSize: 10,
    },
    totalValue: {
        fontWeight: 'bold',
        fontSize: 10,
    },
    footer: {
        marginTop: 10, // Reduced significantly from 40
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signature: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 150,
    },
    signLine: {
        width: 120,
        borderBottomWidth: 1,
        marginTop: 40, // Reduced from 50
    },
    signName: {
        marginTop: 5,
        fontWeight: 'bold',
    }
});

interface KwitansiProps {
    receipt: {
        receipt_number: string;
        receipt_date: Date;
        total_amount: number;
        student: {
            name: string;
            nis: string;
            class: { name: string };
        };
        created_by_user: {
            name: string;
        };
        items: {
            id: string;
            amount_paid: number;
            month: number | null;
            fee_type: { name: string };
            academic_year: { name: string };
        }[];
    };
}

const getMonthName = (num: number) => {
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return months[num - 1] || "-";
};

export const KwitansiPDF = ({ receipt }: KwitansiProps) => (
    <Document>
        <Page size="A5" orientation="landscape" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Image
                    style={styles.logo}
                    src={process.cwd() + '/public/logo_sekolah.png'}
                />
                <View style={styles.schoolInfo}>
                    <Text style={styles.schoolName}>MI NURUL FALAH</Text>
                    <Text style={styles.schoolAddress}>Jl. Sukamenak Indah, Sayati, Kec. Margahayu</Text>
                    <Text style={styles.schoolAddress}>Kabupaten Bandung, Jawa Barat 40228</Text>
                </View>
            </View>

            <Text style={styles.title}>KWITANSI PEMBAYARAN</Text>

            {/* Meta Info - Vertical Layout */}
            <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.label}>No. Kwitansi</Text>
                        <Text>: {receipt.receipt_number}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.label}>Tanggal</Text>
                        <Text>: {new Date(receipt.receipt_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <Text style={styles.label}>Sudah Terima Dari</Text>
                    <Text>: {receipt.student.name} ({receipt.student.nis})</Text>
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <Text style={styles.label}>Kelas</Text>
                    <Text>: {receipt.student.class.name}</Text>
                </View>
            </View>

            {/* Table */}
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={[styles.tableColHeader, { width: '40%' }]}>
                        <Text style={styles.tableCellHeader}>Keterangan Pembayaran</Text>
                    </View>
                    <View style={[styles.tableColHeader, { width: '20%' }]}>
                        <Text style={styles.tableCellHeader}>Tahun Ajar</Text>
                    </View>
                    <View style={[styles.tableColHeader, { width: '15%' }]}>
                        <Text style={styles.tableCellHeader}>Bulan</Text>
                    </View>
                    <View style={[styles.tableColHeader, { width: '25%' }]}>
                        <Text style={styles.tableCellHeader}>Jumlah</Text>
                    </View>
                </View>

                {receipt.items.map((item) => (
                    <View style={styles.tableRow} key={item.id}>
                        <View style={[styles.tableCol, { width: '40%' }]}>
                            <Text style={styles.tableCell}>{item.fee_type.name}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                            <Text style={styles.tableCell}>{item.academic_year.name}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '15%' }]}>
                            <Text style={styles.tableCell}>{item.month ? getMonthName(item.month) : '-'}</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '25%' }]}>
                            <Text style={styles.tableCell}>{formatIDR(Number(item.amount_paid))}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Total */}
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Bayar:</Text>
                <Text style={styles.totalValue}>{formatIDR(Number(receipt.total_amount))}</Text>
            </View>

            {/* Footer / Signature */}
            <View style={styles.footer}>
                <View style={styles.signature} />
                <View style={styles.signature}>
                    <Text style={{ marginBottom: 40 }}>Kab. Bandung, {new Date(receipt.receipt_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                    <Text style={{ marginBottom: 5 }}>Penerima,</Text>
                    <View style={styles.signLine} />
                    <Text style={styles.signName}>{receipt.created_by_user.name}</Text>
                </View>
            </View>

        </Page>
    </Document>
);
