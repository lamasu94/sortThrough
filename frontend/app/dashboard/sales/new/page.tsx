"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Search, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { fetchProducts, Product } from "@/services/productService";
import { fetchCustomers, Customer } from "@/services/customerService";
import { createSale } from "@/services/saleService";

// one line in the cart — a product plus how many the user wants to sell
type CartLine = { product: Product; quantity: number };

export default function NewSalePage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [productSearch, setProductSearch] = useState("");
    const [customerId, setCustomerId] = useState<string>("");
    const [cart, setCart] = useState<CartLine[]>([]);
    const [error, setError] = useState("");

    const { data: products = [] } = useQuery({
        queryKey: ["products", productSearch],
        queryFn: () => fetchProducts({ search: productSearch }),
    });

    const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: () => fetchCustomers() });

    const saleMutation = useMutation({
        mutationFn: createSale,
        onSuccess: () => {
            // a completed sale changes stock AND creates a transaction —
            // both of those cached lists are now stale too
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            router.push("/dashboard/sales");
        },
        onError: (err: any) => {
            setError(err.response?.data?.error || "Failed to create sale");
        },
    });

    // add a product to the cart, or increase its quantity if it's already there
    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((line) => line.product.id === product.id);
            if (existing) {
                return prev.map((line) =>
                    line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, delta: number) => {
        setCart((prev) =>
            prev
                .map((line) =>
                    line.product.id === productId
                        ? { ...line, quantity: Math.max(1, line.quantity + delta) }
                        : line
                )
        );
    };

    const removeFromCart = (productId: number) => {
        setCart((prev) => prev.filter((line) => line.product.id !== productId));
    };

    // recalculated on every render — always reflects the current cart, no separate "total" state to keep in sync
    const total = cart.reduce((sum, line) => sum + line.product.selling_price * line.quantity, 0);

    const handleCompleteSale = () => {
        setError("");
        if (cart.length === 0) {
            setError("Add at least one product to the cart");
            return;
        }

        saleMutation.mutate({
            customerId: customerId ? Number(customerId) : null,
            items: cart.map((line) => ({ productId: line.product.id, quantity: line.quantity })),
        });
    };

    return (
        <div className="grid grid-cols-3 gap-6 h-full">
            {/* Left: product search + results */}
            <div className="col-span-2 space-y-4">
                <h1 className="text-xl font-serif font-bold text-[#0F1923]">New Sale</h1>

                <div className="flex items-center bg-white border border-[#CBDDE9] rounded-lg px-4 py-2.5">
                    <Search size={16} className="text-[#7B8186] mr-2" />
                    <input
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search products to add..."
                        className="w-full outline-none text-sm bg-transparent  text-[#7B8186] placeholder:text-[#7B8186]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {products.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            disabled={product.quantity === 0}
                            className="text-left bg-white border border-[#CBDDE9]/60 rounded-lg p-4 hover:border-[#2872A1] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <p className="text-sm font-medium text-[#0F1923]">{product.name}</p>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-sm text-[#2872A1] font-medium">${product.selling_price}</span>
                                <span className="text-xs text-[#7B8186]">{product.quantity} in stock</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: cart */}
            <div className="bg-white border border-[#CBDDE9]/60 rounded-xl p-5 flex flex-col h-fit sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                    <ShoppingCart size={18} className="text-[#0F1923]" />
                    <h2 className="font-serif font-bold text-[#0F1923]">Cart</h2>
                </div>

                <div>
                    <label className="text-xs text-[#7B8186] uppercase tracking-wide">Customer (optional)</label>
                    <select
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        className="w-full mt-1 mb-4 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none bg-white  text-[#7B8186]"
                    >
                        <option value="">Walk-in customer</option>
                        {customers.map((c: Customer) => (
                            <option key={c.id} value={c.id}>{c.full_name}</option>
                        ))}
                    </select>
                </div>

                {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md mb-3">{error}</p>}

                {cart.length === 0 ? (
                    <p className="text-sm text-[#7B8186] text-center py-8">No items yet — click a product to add it.</p>
                ) : (
                    <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                        {cart.map((line) => (
                            <div key={line.product.id} className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-sm text-[#0F1923] truncate">{line.product.name}</p>
                                    <p className="text-xs text-[#7B8186]">${line.product.selling_price} each</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={() => updateQuantity(line.product.id, -1)} className="text-[#7B8186] hover:text-[#0F1923]">
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-sm w-5 text-center">{line.quantity}</span>
                                    <button onClick={() => updateQuantity(line.product.id, 1)} className="text-[#7B8186] hover:text-[#0F1923]">
                                        <Plus size={14} />
                                    </button>
                                    <button onClick={() => removeFromCart(line.product.id)} className="text-[#7B8186] hover:text-red-600 ml-1">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="border-t border-[#CBDDE9]/60 pt-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#0F1923]">Total</span>
                    <span className="text-lg font-serif font-bold text-[#0F1923]">${total.toFixed(2)}</span>
                </div>

                <button
                    onClick={handleCompleteSale}
                    disabled={saleMutation.isPending}
                    className="w-full mt-4 bg-[#2872A1] hover:bg-[#0F1923] text-white text-sm font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                    {saleMutation.isPending ? "Processing..." : "Complete Sale"}
                </button>
            </div>
        </div>
    );
}