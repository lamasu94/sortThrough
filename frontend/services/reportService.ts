import api from "./api";

export type SalesReport = { totalSales: number; totalRevenue: number };
export type LowStockItem = { id: number; name: string; quantity: number; barcode: string };
export type TopProduct = { id: number; name: string; totalSold: number };
export type IncomeExpenseRow = { type: "revenue" | "expense"; total: number };

export async function fetchSalesReport(startDate: string, endDate: string): Promise<SalesReport> {
    const response = await api.get("/reports/sales", { params: { startDate, endDate } });
    return response.data.report;
}

export async function fetchLowStockReport(quantity?: number): Promise<LowStockItem[]> {
    const response = await api.get("/reports/low-stock", { params: { quantity } });
    return response.data.report;
}

export async function fetchTopProductsReport(limit?: number): Promise<TopProduct[]> {
    const response = await api.get("/reports/top-products", { params: { limit } });
    return response.data.report;
}

export async function fetchIncomeVsExpense(startDate: string, endDate: string): Promise<IncomeExpenseRow[]> {
    const response = await api.get("/reports/income-vs-expense", { params: { startDate, endDate } });
    return response.data.report;
}