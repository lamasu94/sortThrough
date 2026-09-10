import api from "./api";

export type Customer = {
    id: number;
    full_name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    created_at: string;
};

export type CustomerInput = {
    fullName: string;
    phone?: string;
    email?: string;
    address?: string;
};

export async function fetchCustomers(search?: string): Promise<Customer[]> {
    const response = await api.get("/customers", { params: search ? { search } : {} });
    return response.data.customers;
}

export async function fetchCustomerById(id: number): Promise<Customer> {
    const response = await api.get(`/customers/${id}`);
    return response.data.customer;
}

export async function createCustomer(data: CustomerInput): Promise<void> {
    await api.post("/customers", data);
}

export async function updateCustomer(id: number, data: CustomerInput): Promise<void> {
    await api.put(`/customers/${id}`, data);
}

export async function deleteCustomer(id: number): Promise<void> {
    await api.delete(`/customers/${id}`);
}