"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    fetchSalesReport,
    fetchLowStockReport,
    fetchTopProductsReport,
    fetchIncomeVsExpense,
} from "@/services/reportService";
import { useAuth } from "@/context/authContext";

const TABS = [
    { key: "sales", label: "Sales", roles: ["admin", "sales_officer"] },
    { key: "low-stock", label: "Low Stock", roles: ["admin", "sales_officer"] },
    { key: "top-products", label: "Top Products", roles: ["admin", "sales_officer"] },
    { key: "income-expense", label: "Income vs Expense", roles: ["admin", "finance_officer"] },
] as const;

export default function ReportsPage() {
    const { user } = useAuth();
    const visibleTabs = TABS.filter((tab) => user && tab.roles.includes(user.role));
    const [activeTab, setActiveTab] = useState<string>(visibleTabs[0]?.key ?? "sales");

    // default date range: last 30 days
    const today = new Date().toISOString().split("T")[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(monthAgo);
    const [endDate, setEndDate] = useState(today);

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-serif font-bold text-[#0F1923]">Reports</h1>

            <div className="flex gap-1 border-b border-[#CBDDE9]/60">
                {visibleTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab.key
                                ? "border-[#2872A1] text-[#0F1923]"
                                : "border-transparent text-[#7B8186] hover:text-[#0F1923]"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {(activeTab === "sales" || activeTab === "income-expense") && (
                <div className="flex gap-3 items-end">
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">From</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                            className="block mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none" />
                    </div>
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">To</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                            className="block mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none" />
                    </div>
                </div>
            )}

            {activeTab === "sales" && <SalesReportView startDate={startDate} endDate={endDate} />}
            {activeTab === "low-stock" && <LowStockReportView />}
            {activeTab === "top-products" && <TopProductsReportView />}
            {activeTab === "income-expense" && <IncomeExpenseReportView startDate={startDate} endDate={endDate} />}
        </div>
    );
}

function SalesReportView({ startDate, endDate }: { startDate: string; endDate: string }) {
    const { data, isLoading } = useQuery({
        queryKey: ["reports", "sales", startDate, endDate],
        queryFn: () => fetchSalesReport(startDate, endDate),
    });

    if (isLoading) return <p className="text-sm text-[#7B8186]">Loading...</p>;

    return (
        <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="bg-white border border-[#CBDDE9]/60 rounded-xl p-5">
                <p className="text-xs text-[#7B8186] uppercase tracking-wide">Total Sales</p>
                <p className="text-2xl font-serif font-bold text-[#0F1923] mt-2">{data?.totalSales ?? 0}</p>
            </div>
            <div className="bg-white border border-[#CBDDE9]/60 rounded-xl p-5">
                <p className="text-xs text-[#7B8186] uppercase tracking-wide">Total Revenue</p>
                <p className="text-2xl font-serif font-bold text-[#0F1923] mt-2">${data?.totalRevenue ?? 0}</p>
            </div>
        </div>
    );
}

function LowStockReportView() {
    const { data = [], isLoading } = useQuery({
        queryKey: ["reports", "low-stock"],
        queryFn: () => fetchLowStockReport(10),
    });

    if (isLoading) return <p className="text-sm text-[#7B8186]">Loading...</p>;
    if (data.length === 0) return <p className="text-sm text-[#7B8186]">No low-stock products right now.</p>;

    return (
        <div className="bg-white border border-[#CBDDE9]/60 rounded-xl overflow-hidden max-w-lg">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-xs text-[#7B8186] uppercase tracking-wide border-b border-[#CBDDE9]/60">
                        <th className="px-6 py-3 font-medium">Product</th>
                        <th className="px-6 py-3 font-medium">Stock Left</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, i) => (
                        <tr key={item.id} className={i !== data.length - 1 ? "border-b border-[#CBDDE9]/40" : ""}>
                            <td className="px-6 py-3.5 text-[#0F1923]">{item.name}</td>
                            <td className="px-6 py-3.5 text-red-600 font-medium">{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TopProductsReportView() {
    const { data = [], isLoading } = useQuery({
        queryKey: ["reports", "top-products"],
        queryFn: () => fetchTopProductsReport(10),
    });

    if (isLoading) return <p className="text-sm text-[#7B8186]">Loading...</p>;
    if (data.length === 0) return <p className="text-sm text-[#7B8186]">No sales data yet.</p>;

    return (
        <div className="bg-white border border-[#CBDDE9]/60 rounded-xl overflow-hidden max-w-lg">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-xs text-[#7B8186] uppercase tracking-wide border-b border-[#CBDDE9]/60">
                        <th className="px-6 py-3 font-medium">Product</th>
                        <th className="px-6 py-3 font-medium">Units Sold</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, i) => (
                        <tr key={item.id} className={i !== data.length - 1 ? "border-b border-[#CBDDE9]/40" : ""}>
                            <td className="px-6 py-3.5 text-[#0F1923]">{item.name}</td>
                            <td className="px-6 py-3.5 text-[#2872A1] font-medium">{item.totalSold}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function IncomeExpenseReportView({ startDate, endDate }: { startDate: string; endDate: string }) {
    const { data = [], isLoading } = useQuery({
        queryKey: ["reports", "income-expense", startDate, endDate],
        queryFn: () => fetchIncomeVsExpense(startDate, endDate),
    });

    if (isLoading) return <p className="text-sm text-[#7B8186]">Loading...</p>;

    const revenue = data.find((row) => row.type === "revenue")?.total ?? 0;
    const expense = data.find((row) => row.type === "expense")?.total ?? 0;
    const netProfit = revenue - expense;

    return (
        <div className="grid grid-cols-3 gap-4 max-w-2xl">
            <div className="bg-white border border-[#CBDDE9]/60 rounded-xl p-5">
                <p className="text-xs text-[#7B8186] uppercase tracking-wide">Revenue</p>
                <p className="text-2xl font-serif font-bold text-[#0F1923] mt-2">${revenue}</p>
            </div>
            <div className="bg-white border border-[#CBDDE9]/60 rounded-xl p-5">
                <p className="text-xs text-[#7B8186] uppercase tracking-wide">Expenses</p>
                <p className="text-2xl font-serif font-bold text-[#0F1923] mt-2">${expense}</p>
            </div>
            <div className="bg-white border border-[#CBDDE9]/60 rounded-xl p-5">
                <p className="text-xs text-[#7B8186] uppercase tracking-wide">Net Profit</p>
                <p className={`text-2xl font-serif font-bold mt-2 ${netProfit >= 0 ? "text-[#2872A1]" : "text-red-600"}`}>
                    ${netProfit}
                </p>
            </div>
        </div>
    );
}