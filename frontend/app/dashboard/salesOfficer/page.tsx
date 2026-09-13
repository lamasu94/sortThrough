"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSales } from "@/services/saleService";
import { fetchTopProductsReport } from "@/services/reportService";
import { useAuth } from "@/context/authContext";
import RequireRole from "@/components/RequireRole";
import Link from "next/link";

export default function SalesDashboardPage() {
    const { user } = useAuth();
    const today = new Date().toISOString().split("T")[0];

    const { data: sales = [] } = useQuery({ queryKey: ["sales"], queryFn: () => fetchSales() });
    const { data: topProducts = [] } = useQuery({ queryKey: ["reports", "top-products"], queryFn: () => fetchTopProductsReport(5) });

    const mySales = sales.filter((s) => s.sold_by === user?.name);
    const todaysSales = mySales.filter((s) => s.created_at.startsWith(today));
    const todaysTotal = todaysSales.reduce((sum, s) => sum + Number(s.total_amount), 0);

    return (
        <RequireRole allow={["sales_officer"]}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-serif font-bold text-[#0F1923]">Sales Dashboard</h1>
                        <p className="text-sm text-[#7B8186] mt-1">Your sales performance and recent activity.</p>
                    </div>
                    <Link href="/dashboard/sales/new" className="bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium px-4 py-2.5 rounded-lg">
                        + New Sale
                    </Link>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <StatCard label="Today's Sales" value={`$${todaysTotal.toFixed(2)}`} />
                    <StatCard label="My Total Sales" value={mySales.length} />
                    <StatCard label="Top Product" value={topProducts[0]?.name ?? "—"} />
                </div>

                <div className="bg-white border border-[#CBDDE9]/60 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#CBDDE9]/60">
                        <p className="text-sm font-medium text-[#0F1923]">My Recent Sales</p>
                    </div>
                    {mySales.length === 0 ? (
                        <p className="p-6 text-sm text-[#7B8186]">No sales recorded yet.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <tbody>
                                {mySales.slice(0, 5).map((sale) => (
                                    <tr key={sale.id} className="border-b border-[#CBDDE9]/40 last:border-0">
                                        <td className="px-6 py-3 text-[#0F1923]">{sale.customer_name || "Walk-in"}</td>
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

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="bg-white border border-[#CBDDE9]/60 rounded-xl p-5">
            <p className="text-xs text-[#7B8186] uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-serif font-bold text-[#0F1923] mt-2">{value}</p>
        </div>
    );
}