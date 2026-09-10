import api from "./api";

export type Supplier = {
    id: number;
    company_name: string;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    created_at: string;
};

export type SupplierInput = {
    companyName: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
};

export async function fetchSuppliers(search?: string): Promise<Supplier[]> {
    const response = await api.get("/suppliers", { params: search ? { search } : {} });
    return response.data.suppliers;
}

export async function fetchSupplierById(id: number): Promise<Supplier> {
    const response = await api.get(`/suppliers/${id}`);
    return response.data.supplier;
}

export async function createSupplier(data: SupplierInput): Promise<void> {
    await api.post("/suppliers", data);
}

export async function updateSupplier(id: number, data: SupplierInput): Promise<void> {
    await api.put(`/suppliers/${id}`, data);
}

export async function deleteSupplier(id: number): Promise<void> {
    await api.delete(`/suppliers/${id}`);
}