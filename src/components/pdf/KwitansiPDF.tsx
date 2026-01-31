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
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingBottom: 10,
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    schoolInfo: {
        flexDirection: 'column',
    },
    schoolName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    schoolAddress: {
        fontSize: 9,
        color: '#555',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        textDecoration: 'underline',
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    metaGroup: {
        flexDirection: 'column',
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        width: 80,
        fontWeight: 'bold',
        color: '#555',
    },
    value: {
        flex: 1,
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: '#f0f0f0',
    },
    tableCol: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableCellHeader: {
        margin: 5,
        fontSize: 9,
        fontWeight: 'bold',
    },
    tableCell: {
        margin: 5,
        fontSize: 9,
    },
    totalRow: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'flex-end',
    },
    totalLabel: {
        fontWeight: 'bold',
        marginRight: 10,
        fontSize: 12,
    },
    totalValue: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    footer: {
        marginTop: 40,
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
        marginTop: 50,
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

export const KwitansiPDF = ({ receipt }: KwitansiProps) => (
    <Document>
        <Page size="A5" orientation="landscape" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                {/* Placeholder Logo - In real app, use absolute path or base64 */}
                <View style={{ width: 50, height: 50, backgroundColor: '#ddd', marginRight: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 8 }}>LOGO</Text>
                </View>
                <View style={styles.schoolInfo}>
                    <Text style={styles.schoolName}>SD ISLAM NURUL FALAH</Text>
                    <Text style={styles.schoolAddress}>Jl. Contoh No. 123, Jakarta Selatan</Text>
                    <Text style={styles.schoolAddress}>Telp: (021) 12345678</Text>
                </View>
            </View>

            <Text style={styles.title}>KWITANSI PEMBAYARAN</Text>

            {/* Meta Info */}
            <View style={styles.metaContainer}>
                <View style={styles.metaGroup}>
                    <View style={styles.metaRow}>
                        <Text style={styles.label}>No. Kwitansi</Text>
                        <Text style={styles.value}>: {receipt.receipt_number}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.label}>Tanggal</Text>
                        <Text style={styles.value}>: {new Date(receipt.receipt_date).toLocaleDateString('id-ID')}</Text>
                    </View>
                </View>
                <View style={styles.metaGroup}>
                    <View style={styles.metaRow}>
                        <Text style={styles.label}>Sudah Terima Dari</Text>
                        <Text style={styles.value}>: {receipt.student.name} ({receipt.student.nis})</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.label}>Kelas</Text>
                        <Text style={styles.value}>: {receipt.student.class.name}</Text>
                    </View>
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
                            <Text style={styles.tableCell}>{item.month ? item.month : '-'}</Text>
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
                <View style={styles.signature}>
                    {/* Space for future use */}
                </View>
                <View style={styles.signature}>
                    <Text>Jakarta, {new Date(receipt.receipt_date).toLocaleDateString('id-ID')}</Text>
                    <Text>Penerima,</Text>
                    <View style={styles.signLine} />
                    <Text style={styles.signName}>{receipt.created_by_user.name}</Text>
                </View>
            </View>

        </Page>
    </Document>
);
