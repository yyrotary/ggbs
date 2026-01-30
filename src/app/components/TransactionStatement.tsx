import React from "react";
import { Diamond } from "lucide-react";

interface TransactionStatementProps {
    customer: {
        customerName: string;
        customerNo: string;
        phone: string;
        address?: string;
    };
    transactions: any[];
    supplierInfo?: any;
    onClose: () => void;
}

export default function TransactionStatement({ customer, transactions, supplierInfo, onClose }: TransactionStatementProps) {
    const today = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

    const handlePrint = () => {
        window.print();
    };

    const totalAmount = transactions.reduce((sum, tx) => sum + (tx.totalAmount || 0), 0);

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 overflow-y-auto animate-in fade-in duration-200 print:bg-white print:overflow-visible print:p-0">
            {/* Sticky Toolbar for Controls - Hidden in Print */}
            <div className="sticky top-0 z-50 w-full bg-[#1a1a1a]/95 backdrop-blur-md border-b border-[#D4AF37]/30 p-4 flex justify-between items-center shadow-2xl no-print">
                <div className="flex items-center gap-3 text-white">
                    <div className="p-2 bg-[#D4AF37] rounded-lg text-black">
                        <Diamond size={20} />
                    </div>
                    <span className="font-bold text-lg">인쇄 미리보기</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                    >
                        닫기 (Close)
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b8952b] text-[#0D0B14] rounded-xl font-black shadow-lg hover:shadow-[#D4AF37]/20 transition-all flex items-center gap-2"
                    >
                        <Diamond size={18} className="fill-[#0D0B14]" />
                        인쇄하기 (Print)
                    </button>
                </div>
            </div>

            {/* Scrollable Document Container */}
            <div className="min-h-full flex items-start justify-center p-8 print:p-0 print:block">
                {/* A4 Paper */}
                <div className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] p-10 md:p-14 shadow-2xl overflow-hidden print:max-w-none print:w-full print:min-h-0 print:shadow-none print:overflow-visible print-area relative mx-auto my-4 scale-100 origin-top">

                    {/* Document Header */}
                    <header className="border-b-[3px] border-black pb-6 mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-serif font-black tracking-widest mb-2">거 래 명 세 서</h1>
                            <p className="text-sm font-medium text-gray-500">Transaction Statement</p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-1">
                                <Diamond className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                                <span className="text-xl font-bold tracking-tight">{supplierInfo?.supplier_name || "금가보석"}</span>
                            </div>
                            <p className="text-xs text-gray-500">Tel: {supplierInfo?.supplier_phone || "010-0000-0000"}</p>
                            <p className="text-xs text-gray-500">{supplierInfo?.supplier_address || "서울시 종로구 돈화문로"}</p>
                        </div>
                    </header>

                    {/* Info Section */}
                    <div className="grid grid-cols-2 gap-8 mb-10 text-sm">
                        {/* Customer Info */}
                        <div className="border border-gray-300 p-4 rounded-sm">
                            <h3 className="font-bold border-b border-gray-300 pb-2 mb-3 text-lg flex justify-between">
                                공급받는자 <span className="font-normal text-xs mt-1">(Customer)</span>
                            </h3>
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="py-1 text-gray-500 w-16">성 명</td>
                                        <td className="font-bold text-lg">{customer.customerName}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 text-gray-500">연 락 처</td>
                                        <td>{customer.phone}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 text-gray-500">고객번호</td>
                                        <td>{customer.customerNo}</td>
                                    </tr>
                                    {customer.address && (
                                        <tr>
                                            <td className="py-1 text-gray-500 align-top">주 소</td>
                                            <td>{customer.address}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Supplier Info (Fixed) */}
                        <div className="border border-gray-300 p-4 rounded-sm bg-gray-50 print:bg-transparent">
                            <h3 className="font-bold border-b border-gray-300 pb-2 mb-3 text-lg flex justify-between">
                                공급자 <span className="font-normal text-xs mt-1">(Supplier)</span>
                            </h3>
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="py-1 text-gray-500 w-16">상 호</td>
                                        <td className="font-bold">{supplierInfo?.supplier_name || "금가보석"}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 text-gray-500">대 표 자</td>
                                        <td>{supplierInfo?.supplier_ceo || "홍 길 동"}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 text-gray-500">사업자번호</td>
                                        <td>{supplierInfo?.supplier_reg_no || "123-45-67890"}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 text-gray-500 align-top">주 소</td>
                                        <td>{supplierInfo?.supplier_address || "서울시 종로구 돈화문로 123"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="text-right mb-4">
                        <p className="font-medium text-gray-600">발행일: <span className="font-bold text-black">{today}</span></p>
                    </div>

                    {/* Table */}
                    <div className="mb-8">
                        <table className="w-full text-sm border-collapse border border-black">
                            <thead>
                                <tr className="bg-gray-100 print:bg-gray-100/50">
                                    <th className="border border-black py-2 px-2 w-[12%]">날짜</th>
                                    <th className="border border-black py-2 px-2 w-[8%]">구분</th>
                                    <th className="border border-black py-2 px-2">품목</th>
                                    <th className="border border-black py-2 px-2 w-[10%] text-right">단가</th>
                                    <th className="border border-black py-2 px-2 w-[8%] text-center">수량</th>
                                    <th className="border border-black py-2 px-2 w-[12%] text-right">공급가액</th>
                                    <th className="border border-black py-2 px-2 w-[10%] text-right">세액</th>
                                    <th className="border border-black py-2 px-2 w-[12%] text-right">합계</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx, idx) => (
                                    <tr key={idx}>
                                        <td className="border border-black py-2 px-2 text-center text-xs">{tx.saleDate}</td>
                                        <td className="border border-black py-2 px-2 text-center text-xs">{tx.transactionType || "판매"}</td>
                                        <td className="border border-black py-2 px-2 font-medium">{tx.productName}</td>
                                        <td className="border border-black py-2 px-2 text-right">{tx.unitPrice?.toLocaleString()}</td>
                                        <td className="border border-black py-2 px-2 text-center">{tx.quantity}</td>
                                        <td className="border border-black py-2 px-2 text-right">{tx.supplyAmount?.toLocaleString()}</td>
                                        <td className="border border-black py-2 px-2 text-right">{tx.vat?.toLocaleString()}</td>
                                        <td className="border border-black py-2 px-2 text-right font-bold">{tx.totalAmount?.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {/* Empty rows filler if needed, skipping for now */}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-50 print:bg-gray-50/50 font-bold">
                                    <td colSpan={3} className="border border-black py-3 px-2 text-center">합 계 (Total)</td>
                                    <td colSpan={5} className="border border-black py-3 px-2 text-right text-lg">
                                        ₩ {totalAmount.toLocaleString()}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Remarks if any */}
                    <div className="mb-12 border border-black p-4 min-h-[100px] rounded-sm">
                        <p className="font-bold text-xs text-gray-500 mb-2 uppercase">비고 / Remarks</p>
                        <p className="whitespace-pre-wrap leading-relaxed text-sm">
                            {transactions.map(t => t.remarks).filter(Boolean).join("\n") || "특이사항 없음"}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-8 border-t border-gray-300 mt-auto">
                        <p className="text-lg font-serif font-bold mb-8">위와 같이 거래하였음을 확인합니다.</p>
                        <div className="flex justify-end gap-16 px-10">
                            <div className="text-center">
                                <p className="mb-4 text-sm text-gray-500">공급자 (서명/인)</p>
                                <p className="font-serif font-black text-xl">{supplierInfo?.supplier_ceo || "홍 길 동"}</p>
                            </div>
                            <div className="text-center">
                                <p className="mb-4 text-sm text-gray-500">공급받는자 (서명/인)</p>
                                <p className="font-serif font-black text-xl text-gray-300">Signature</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
