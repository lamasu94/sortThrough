"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/productService";
import { fetchSales } from "@/services/saleService";
import { fetchLowStockReport } from "@/services/reportService";
import RequireRole from "@/components/RequireRole";

export default function AdminDashboardPage() {
    const today = new Date().toISOString().split("T")[0];

    const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: () => fetchProducts() });
    const { data: sales = [] } = useQuery({ queryKey: ["sale"], queryFn: () => fetchSales() });
    const { data: lowStock = [] } = useQuery({ queryKey: ["reports", "low-stock"], queryFn: () => fetchLowStockReport(10) });

    const todaysSales = sales.filter((s) => s.created_at.startsWith(today));
    const todaysTotal = todaysSales.reduce((sum, s) => sum + Number(s.total_amount), 0);

    return (
        <RequireRole allow={["admin"]}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-serif font-bold text-[#0F1923]">Admin Dashboard</h1>
                    <p className="text-sm text-[#7B8186] mt-1">Overview across products, sales, and finance.</p>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <StatCard label="Total Products" value={products.length} />
                    <StatCard label="Today's Sales" value={`$${todaysTotal.toFixed(2)}`} />
                    <StatCard label="Low Stock" value={lowStock.length} accent={lowStock.length > 0 ? "warn" : undefined} />
                    <StatCard label="Total Sales" value={sales.length} />
                </div>

                <div className="bg-white border border-[#CBDDE9]/60 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#CBDDE9]/60">
                        <p className="text-sm font-medium text-[#0F1923]">Recent Sales</p>
                    </div>
                    {sales.length === 0 ? (
                        <p className="p-6 text-sm text-[#7B8186]">No sales yet.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <tbody>
                                {sales.slice(0, 5).map((sale) => (
                                    <tr key={sale.id} className="border-b border-[#CBDDE9]/40 last:border-0">
                                        <td className="px-6 py-3 text-[#0F1923]">{sale.customer_name || "Walk-in"}</td>
                                        <td className="px-6 py-3 text-[#7B8186]">{sale.sold_by}</td>
                                        <td className="px-6 py-3 text-[#0F1923] font-medium text-right">${sale.total_amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </RequireRole>
    );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: "warn" }) {
    return (
        <div className="bg-white border border-[#CBDDE9]/60 rounded-xl p-5">
            <p className="text-xs text-[#7B8186] uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-serif font-bold mt-2 ${accent === "warn" ? "text-red-600" : "text-[#0F1923]"}`}>
                {value}
            </p>
        </div>
    );
}