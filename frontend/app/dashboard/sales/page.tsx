"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, X } from "lucide-react";
import { fetchSales, fetchSaleById, Sale } from "@/services/saleService";
import Link from "next/link";

export default function SalesHistoryPage() {
    const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);

    const { data: sales = [], isLoading } = useQuery({
        queryKey: ["sales"],
        queryFn: () => fetchSales(),
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-serif font-bold text-[#0F1923]">Sales History</h1>
                    <p className="text-sm text-[#7B8186] mt-1">All completed sales.</p>
                </div>
                <Link
                    href="/dashboard/sales/new"
                    className="bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                >
                    + New Sale
                </Link>
            </div>

            <div className="bg-white border border-[#CBDDE9]/60 rounded-xl overflow-hidden">
                {isLoading ? (
                    <div className="p-10 text-center text-sm text-[#7B8186]">Loading sales...</div>
                ) : sales.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="bg-[#CBDDE9]/30 rounded-full p-4 mb-4">
                            <ShoppingCart size={28} className="text-[#2872A1]" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-medium text-[#0F1923]">No sales yet</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-[#7B8186] uppercase tracking-wide border-b border-[#CBDDE9]/60">
                                <th className="px-6 py-3 font-medium">Customer</th>
                                <th className="px-6 py-3 font-medium">Sold By</th>
                                <th className="px-6 py-3 font-medium">Total</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((sale, i) => (
                                <tr
                                    key={sale.id}
                                    onClick={() => setSelectedSaleId(sale.id)}
                                    className={`cursor-pointer hover:bg-[#CBDDE9]/10 ${i !== sales.length - 1 ? "border-b border-[#CBDDE9]/40" : ""}`}
                                >
                                    <td className="px-6 py-3.5 text-[#0F1923] font-medium">{sale.customer_name || "Walk-in"}</td>
                                    <td className="px-6 py-3.5 text-[#7B8186]">{sale.sold_by}</td>
                                    <td className="px-6 py-3.5 text-[#0F1923] font-medium">${sale.total_amount}</td>
                                    <td className="px-6 py-3.5 text-[#7B8186]">{new Date(sale.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedSaleId && (
                <SaleDetailModal saleId={selectedSaleId} onClose={() => setSelectedSaleId(null)} />
            )}
        </div>
    );
}

function SaleDetailModal({ saleId, onClose }: { saleId: number; onClose: () => void }) {
    const { data: sale, isLoading } = useQuery({
        queryKey: ["sales", saleId],
        queryFn: () => fetchSaleById(saleId),
    });

    return (
        <div className="fixed inset-0 bg-[#0F1923]/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-serif font-bold text-[#0F1923]">Sale #{saleId}</h2>
                    <button onClick={onClose} className="text-[#7B8186] hover:text-[#0F1923]">
                        <X size={18} />
                    </button>
                </div>

                {isLoading || !sale ? (
                    <p className="text-sm text-[#7B8186]">Loading...</p>
                ) : (
                    <>
                        <div className="text-sm text-[#7B8186] mb-4 space-y-1">
                            <p>Customer: <span className="text-[#0F1923]">{sale.customer_name || "Walk-in"}</span></p>
                            <p>Sold by: <span className="text-[#0F1923]">{sale.sold_by}</span></p>
                            <p>Date: <span className="text-[#0F1923]">{new Date(sale.created_at).toLocaleString()}</span></p>
                        </div>

                        <div className="border-t border-[#CBDDE9]/60 pt-3 space-y-2">
                            {sale.items?.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-[#0F1923]">{item.product_name} × {item.quantity}</span>
                                    <span className="text-[#7B8186]">${item.subtotal}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-[#CBDDE9]/60 mt-3 pt-3 flex justify-between font-medium">
                            <span className="text-[#0F1923]">Total</span>
                            <span className="text-[#0F1923]">${sale.total_amount}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}