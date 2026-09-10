import api from "./api";

export type Product = {
    id: number;
    name: string;
    category_id: number | null;
    supplier_id: number | null;
    buying_price: number;
    selling_price: number;
    quantity: number;
    description: string | null;
    image: string | null;
    barcode: string;
    created_at: string;
};

export type ProductInput = {
    name: string;
    categoryId: string;
    supplierId: string;
    buyingPrice: number;
    sellingPrice: number;
    quantity: number;
    description?: string;
    barcode: string;
    imageFile?: File | null;
};

export type ProductFilters = {
    search?: string;
    categoryId?: string;
    supplierId?: string;
};

// converts ProductInput into FormData — required since multer expects multipart/form-data
function toFormData(data: ProductInput): FormData {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("categoryId", data.categoryId);
    formData.append("supplierId", data.supplierId);
    formData.append("buyingPrice", String(data.buyingPrice));
    formData.append("sellingPrice", String(data.sellingPrice));
    formData.append("quantity", String(data.quantity));
    formData.append("description", data.description ?? "");
    formData.append("barcode", data.barcode);
    if (data.imageFile) {
        formData.append("image", data.imageFile);
    }
    return formData;
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
    const response = await api.get("/products", { params: filters });
    return response.data.products;
}

export async function fetchProductById(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data.product;
}

export async function createProduct(data: ProductInput): Promise<void> {
    // NOTE: don't manually set Content-Type here — the browser sets the correct
    // multipart boundary automatically when you pass FormData
    await api.post("/products", toFormData(data));
}

export async function updateProduct(id: number, data: ProductInput): Promise<void> {
    await api.put(`/products/${id}`, toFormData(data));
}

export async function deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
}

export function getProductImageUrl(image: string | null): string {
    return image ? `http://localhost:5000/uploads/products/${image}` : "/placeholder-product.svg";
}