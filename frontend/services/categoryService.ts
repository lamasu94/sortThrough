import api from "./api";

export type Category = {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
};

export type CategoryInput = {
    name: string;
    description?: string;
};


export async function fetchCategories(): Promise<Category[]> {
    const response = await api.get("/categories");
    return response.data.categories;
}


export async function fetchCategoryById(id: number): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data.category;
}


export async function createCategory(data: CategoryInput): Promise<Category> {
    const response = await api.post("/categories", data);
    return response.data.category;
}


export async function updateCategory(id: number, data: CategoryInput): Promise<void> {
    await api.put(`/categories/${id}`, data);
}


export async function deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
}