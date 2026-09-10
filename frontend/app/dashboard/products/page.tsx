"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Package, Search } from "lucide-react";
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductImageUrl,
    Product,
    ProductInput,
} from "@/services/productService";
import { fetchCategories } from "@/services/categoryService";
import { fetchSuppliers } from "@/services/supplierService";
import RoleGuard from "@/components/RoleGuard";
import Image from "next/image";

export default function ProductsPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const { data: products = [], isLoading } = useQuery({
        queryKey: ["products", search, categoryFilter],
        queryFn: () => fetchProducts({ search, categoryId: categoryFilter || undefined }),
    });

    // needed for the filter dropdown AND the create/edit form's dropdowns
    const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
    const { data: suppliers = [] } = useQuery({ queryKey: ["suppliers"], queryFn: () => fetchSuppliers() });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["products"] });

    const createMutation = useMutation({ mutationFn: createProduct, onSuccess: invalidate });
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: ProductInput }) => updateProduct(id, data),
        onSuccess: invalidate,
    });
    const deleteMutation = useMutation({ mutationFn: deleteProduct, onSuccess: invalidate });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const openCreateModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Delete this product?")) deleteMutation.mutate(id);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-serif font-bold text-[#0F1923]">Products</h1>
                    <p className="text-sm text-[#7B8186] mt-1">Manage your product inventory.</p>
                </div>
                <RoleGuard allow={["admin"]}>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        Add Product
                    </button>
                </RoleGuard>
            </div>

            {/* Search + Filter */}
            <div className="flex gap-3">
                <div className="flex items-center bg-white border border-[#CBDDE9] rounded-lg px-4 py-2.5 max-w-md flex-1">
                    <Search size={16} className="text-[#7B8186] mr-2" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or barcode..."
                        className="w-full outline-none text-sm bg-transparent placeholder:text-[#7B8186]  text-[#7B8186]"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border border-[#CBDDE9] rounded-lg px-3 py-2.5 text-sm outline-none bg-white text-[#7B8168]"
                >
                    <option value=""> 
                        All Categories
                    </option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id} className="text-[#7B8168]">
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-white border border-[#CBDDE9]/60 rounded-xl overflow-hidden">
                {isLoading ? (
                    <div className="p-10 text-center text-sm text-[#7B8186]">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="bg-[#CBDDE9]/30 rounded-full p-4 mb-4">
                            <Package size={28} className="text-[#2872A1]" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-medium text-[#0F1923]">No products yet</p>
                        <p className="text-sm text-[#7B8186] mt-1">Add your first product to get started.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-[#7B8186] uppercase tracking-wide border-b border-[#CBDDE9]/60">
                                <th className="px-6 py-3 font-medium">Product</th>
                                <th className="px-6 py-3 font-medium">Barcode</th>
                                <th className="px-6 py-3 font-medium">Price</th>
                                <th className="px-6 py-3 font-medium">Stock</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, i) => (
                                <tr key={product.id} className={i !== products.length - 1 ? "border-b border-[#CBDDE9]/40" : ""}>
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#CBDDE9]/40 shrink-0">
                                                <Image
                                                    src={getProductImageUrl(product.image)}
                                                    alt={product.name}
                                                    width={36}
                                                    height={36}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-[#0F1923] font-medium">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 text-[#7B8186] font-mono text-xs">{product.barcode}</td>
                                    <td className="px-6 py-3.5 text-[#0F1923]">${product.selling_price}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={product.quantity < 10 ? "text-red-600 font-medium" : "text-[#7B8186]"}>
                                            {product.quantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <RoleGuard allow={["admin"]}>
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => openEditModal(product)} className="text-[#2872A1] hover:text-[#0F1923]">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="text-[#7B8186] hover:text-red-600">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </RoleGuard>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <ProductModal
                    product={editingProduct}
                    categories={categories}
                    suppliers={suppliers}
                    onClose={() => setIsModalOpen(false)}
                    onCreate={(data) => createMutation.mutate(data, { onSuccess: () => setIsModalOpen(false) })}
                    onUpdate={(id, data) => updateMutation.mutate({ id, data }, { onSuccess: () => setIsModalOpen(false) })}
                />
            )}
        </div>
    );
}

function ProductModal({
    product,
    categories,
    suppliers,
    onClose,
    onCreate,
    onUpdate,
}: {
    product: Product | null;
    categories: { id: number; name: string }[];
    suppliers: { id: number; company_name: string }[];
    onClose: () => void;
    onCreate: (data: ProductInput) => void;
    onUpdate: (id: number, data: ProductInput) => void;
}) {
    const isEditing = !!product;
    const [name, setName] = useState(product?.name ?? "");
    const [categoryId, setCategoryId] = useState(product?.category_id?.toString() ?? "");
    const [supplierId, setSupplierId] = useState(product?.supplier_id?.toString() ?? "");
    const [buyingPrice, setBuyingPrice] = useState(product?.buying_price ?? 0);
    const [sellingPrice, setSellingPrice] = useState(product?.selling_price ?? 0);
    const [quantity, setQuantity] = useState(product?.quantity ?? 0);
    const [description, setDescription] = useState(product?.description ?? "");
    const [barcode, setBarcode] = useState(product?.barcode ?? "");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (sellingPrice <= buyingPrice) {
            setError("Selling price must be greater than buying price");
            return;
        }
        if (quantity < 0) {
            setError("Quantity cannot be negative");
            return;
        }

        const data: ProductInput = {
            name, categoryId, supplierId, buyingPrice, sellingPrice, quantity, description, barcode, imageFile,
        };

        if (isEditing) onUpdate(product.id, data);
        else onCreate(data);
    };

    return (
        <div className="fixed inset-0 bg-[#0F1923]/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl w-full max-w-lg p-6 my-8">
                <h2 className="text-lg font-serif font-bold text-[#0F1923] mb-4">
                    {isEditing ? "Edit Product" : "Add Product"}
                </h2>

                {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} required
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] text-[#7B8186] " />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-[#7B8186] uppercase tracking-wide">Category</label>
                            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required
                                className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] bg-white text-[#7B8186]">
                                <option value="">Select...</option>
                                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-[#7B8186] uppercase tracking-wide">Supplier</label>
                            <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required
                                className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] bg-white text-[#7B8186]">
                                <option value="">Select...</option>
                                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.company_name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 ">
                        <div>
                            <label className="text-xs text-[#7B8186] uppercase tracking-wide">Buying Price</label>
                            <input type="number" step="0.01" value={buyingPrice} onChange={(e) => setBuyingPrice(Number(e.target.value))} required
                                className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] text-[#7B8186]" />
                        </div>
                        <div>
                            <label className="text-xs text-[#7B8186] uppercase tracking-wide">Selling Price</label>
                            <input type="number" step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} required
                                className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] text-[#7B8186]" />
                        </div>
                        <div>
                            <label className="text-xs text-[#7B8186] uppercase tracking-wide">Quantity</label>
                            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required
                                className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] text-[#7B8186]" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Barcode</label>
                        <input value={barcode} onChange={(e) => setBarcode(e.target.value)} required
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1]  text-[#7B8186]" />
                    </div>

                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] resize-none  text-[#7B8186]" />
                    </div>

                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">
                            Image {isEditing && "(leave empty to keep current)"}
                        </label>
                        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                            className="w-full mt-1 text-sm text-[#7B8186]" />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-[#7B8186] hover:text-[#0F1923]">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium rounded-lg">
                            {isEditing ? "Save Changes" : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}