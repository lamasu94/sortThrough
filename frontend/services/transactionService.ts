import api from "./api";

export type Transaction = {
    id: number;
    type: "revenue" | "expense";
    amount: number;
    category: string | null;
    description: string | null;
    sale_id: number | null;
    created_by: number;
    created_at: string;
};

export type TransactionInput = {
    amount: number;
    category?: string;
    description?: string;
};

export type TransactionFilters = {
    type?: "revenue" | "expense";
    startDate?: string;
    endDate?: string;
};

export async function fetchTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
    const response = await api.get("/transactions", { params: filters });
    return response.data.transactions;
}

export async function createTransaction(data: TransactionInput): Promise<void> {
    await api.post("/transactions", data);
}

export async function updateTransaction(id: number, data: TransactionInput): Promise<void> {
    await api.put(`/transactions/${id}`, data);
}

export async function deleteTransaction(id: number): Promise<void> {
    await api.delete(`/transactions/${id}`);
}