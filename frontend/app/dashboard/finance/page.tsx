"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Wallet } from "lucide-react";
import {
    fetchTransactions,
    createTransaction,
    deleteTransaction,
    Transaction,
    TransactionInput,
} from "@/services/transactionService";
import { useAuth } from "@/context/authContext";
import RoleGuard from "@/components/RoleGuard";

export default function FinancePage() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [typeFilter, setTypeFilter] = useState<"" | "revenue" | "expense">("");

    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ["transactions", typeFilter],
        queryFn: () => fetchTransactions({ type: typeFilter || undefined }),
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["transactions"] });

    const createMutation = useMutation({ mutationFn: createTransaction, onSuccess: invalidate });
    const deleteMutation = useMutation({ mutationFn: deleteTransaction, onSuccess: invalidate });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = (id: number) => {
        if (confirm("Delete this transaction?")) deleteMutation.mutate(id);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-serif font-bold text-[#0F1923]">Finance</h1>
                    <p className="text-sm text-[#7B8186] mt-1">Track income and expenses.</p>
                </div>
                {/* only Finance Officer can log expenses; Admin has view-only */}
                <RoleGuard allow={["finance_officer"]}>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        Log Expense
                    </button>
                </RoleGuard>
            </div>

            <div className="flex gap-1">
                {(["", "revenue", "expense"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                            typeFilter === t ? "bg-[#0F1923] text-white" : "bg-white border border-[#CBDDE9] text-[#7B8186]"
                        }`}
                    >
                        {t === "" ? "All" : t === "revenue" ? "Revenue" : "Expenses"}
                    </button>
                ))}
            </div>

            <div className="bg-white border border-[#CBDDE9]/60 rounded-xl overflow-hidden">
                {isLoading ? (
                    <div className="p-10 text-center text-sm text-[#7B8186]">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="bg-[#CBDDE9]/30 rounded-full p-4 mb-4">
                            <Wallet size={28} className="text-[#2872A1]" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-medium text-[#0F1923]">No transactions yet</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-[#7B8186] uppercase tracking-wide border-b border-[#CBDDE9]/60">
                                <th className="px-6 py-3 font-medium">Type</th>
                                <th className="px-6 py-3 font-medium">Category</th>
                                <th className="px-6 py-3 font-medium">Description</th>
                                <th className="px-6 py-3 font-medium">Amount</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, i) => (
                                <tr key={tx.id} className={i !== transactions.length - 1 ? "border-b border-[#CBDDE9]/40" : ""}>
                                    <td className="px-6 py-3.5">
                                        <span
                                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                                tx.type === "revenue" ? "bg-[#2872A1]/10 text-[#2872A1]" : "bg-red-50 text-red-600"
                                            }`}
                                        >
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-[#7B8186]">{tx.category || "—"}</td>
                                    <td className="px-6 py-3.5 text-[#7B8186]">{tx.description || "—"}</td>
                                    <td className="px-6 py-3.5 text-[#0F1923] font-medium">${tx.amount}</td>
                                    <td className="px-6 py-3.5 text-[#7B8186]">{new Date(tx.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-3.5">
                                        {/* only expenses can be deleted here, and only by Finance Officer — revenue is system-generated */}
                                        {tx.type === "expense" && (
                                            <RoleGuard allow={["finance_officer"]}>
                                                <button onClick={() => handleDelete(tx.id)} className="text-[#7B8186] hover:text-red-600 ml-auto block">
                                                    <Trash2 size={16} />
                                                </button>
                                            </RoleGuard>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <ExpenseModal
                    onClose={() => setIsModalOpen(false)}
                    onCreate={(data) => createMutation.mutate(data, { onSuccess: () => setIsModalOpen(false) })}
                />
            )}
        </div>
    );
}

function ExpenseModal({
    onClose,
    onCreate,
}: {
    onClose: () => void;
    onCreate: (data: TransactionInput) => void;
}) {
    const [amount, setAmount] = useState(0);
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount <= 0) {
            setError("Amount must be greater than zero");
            return;
        }
        onCreate({ amount, category, description });
    };

    return (
        <div className="fixed inset-0 bg-[#0F1923]/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
                <h2 className="text-lg font-serif font-bold text-[#0F1923] mb-4">Log Expense</h2>

                {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Amount</label>
                        <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(Number(e.target.value))} required
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] text-[#7B8186]" />
                    </div>
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Category</label>
                        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Utilities, Salaries"
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] text-[#7B8186]" />
                    </div>
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] resize-none text-[#7B8186]" />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-[#7B8186] hover:text-[#0F1923]">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium rounded-lg">
                            Log Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}