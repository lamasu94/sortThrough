"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchIncomeVsExpense } from "@/services/reportService";
import { fetchTransactions } from "@/services/transactionService";
import RequireRole from "@/components/RequireRole";

export default function FinanceDashboardPage() {
    const today = new Date().toISOString().split("T")[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const { data: summary = [] } = useQuery({
        queryKey: ["reports", "income-expense", monthAgo, today],
        queryFn: () => fetchIncomeVsExpense(monthAgo, today),
    });

    const { data: transactions = [] } = useQuery({ queryKey: ["transactions"], queryFn: () => fetchTransactions() });

    const revenue = summary.find((r) => r.type === "revenue")?.total ?? 0;
    const expense = summary.find((r) => r.type === "expense")?.total ?? 0;
    const netProfit = revenue - expense;

    return (
        <RequireRole allow={["finance_officer"]}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-serif font-bold text-[#0F1923]">Finance Dashboard</h1>
                    <p className="text-sm text-[#7B8186] mt-1">Revenue, expenses, and net profit — last 30 days.</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <StatCard label="Revenue" value={`$${revenue}`} />
                    <StatCard label="Expenses" value={`$${expense}`} />
                    <StatCard label="Net Profit" value={`$${netProfit}`} accent={netProfit < 0 ? "warn" : undefined} />
                </div>

                <div className="bg-white border border-[#CBDDE9]/60 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#CBDDE9]/60">
                        <p className="text-sm font-medium text-[#0F1923]">Recent Transactions</p>
                    </div>
                    {transactions.length === 0 ? (
                        <p className="p-6 text-sm text-[#7B8186]">No transactions yet.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <tbody>
                                {transactions.slice(0, 5).map((tx) => (
                                    <tr key={tx.id} className="border-b border-[#CBDDE9]/40 last:border-0">
                                        <td className="px-6 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-full ${tx.type === "revenue" ? "bg-[#2872A1]/10 text-[#2872A1]" : "bg-red-50 text-red-600"}`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-[#7B8186]">{tx.description || tx.category || "—"}</td>
                                        <td className="px-6 py-3 text-[#0F1923] font-medium text-right">${tx.amount}</td>
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