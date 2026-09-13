import api from "./api";

export type SaleItem = {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
};

export type Sale = {
    id: number;
    customer_id: number | null;
    customer_name: string | null;
    sold_by: string;
    total_amount: number;
    created_at: string;
    items?: SaleItem[];
};

export type SaleInput = {
    customerId: number | null;
    items: { productId: number; quantity: number }[];
};

export type SaleFilters = {
    startDate?: string;
    endDate?: string;
    customerId?: string;
};

export async function fetchSales(filters: SaleFilters = {}): Promise<Sale[]> {
    const response = await api.get("/sale", { params: filters });
    return response.data.sales;
}

export async function fetchSaleById(id: number): Promise<Sale> {
    const response = await api.get(`/sale/${id}`);
    return response.data.sale;
}

export async function createSale(data: SaleInput): Promise<{ id: number; totalAmount: number }> {
    const response = await api.post("/sale", data);
    return response.data.sale;
}