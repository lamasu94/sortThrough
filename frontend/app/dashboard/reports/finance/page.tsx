"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchIncomeVsExpense } from "@/services/reportService";

export default function FinanceReportsPage() {
    const today = new Date().toISOString().split("T")[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(monthAgo);
    const [endDate, setEndDate] = useState(today);

    const { data = [], isLoading } = useQuery({
        queryKey: ["reports", "income-expense", startDate, endDate],
        queryFn: () => fetchIncomeVsExpense(startDate, endDate),
    });

    const revenue = data.find((row) => row.type === "revenue")?.total ?? 0;
    const expense = data.find((row) => row.type === "expense")?.total ?? 0;
    const netProfit = revenue - expense;

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-serif font-bold text-[#0F1923]">Financial Reports</h1>

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

            {isLoading ? (
                <p className="text-sm text-[#7B8186]">Loading...</p>
            ) : (
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
            )}
        </div>
    );
}