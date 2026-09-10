"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Truck, Search } from "lucide-react";
import {
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    Supplier,
    SupplierInput,
} from "@/services/supplierService";
import RoleGuard from "@/components/RoleGuard";

export default function SuppliersPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");

    const { data: suppliers = [], isLoading } = useQuery({
        queryKey: ["suppliers", search],
        queryFn: () => fetchSuppliers(search),
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["suppliers"] });

    const createMutation = useMutation({ mutationFn: createSupplier, onSuccess: invalidate });
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: SupplierInput }) => updateSupplier(id, data),
        onSuccess: invalidate,
    });
    const deleteMutation = useMutation({ mutationFn: deleteSupplier, onSuccess: invalidate });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

    const openCreateModal = () => {
        setEditingSupplier(null);
        setIsModalOpen(true);
    };

    const openEditModal = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Delete this supplier?")) deleteMutation.mutate(id);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-serif font-bold text-[#0F1923]">Suppliers</h1>
                    <p className="text-sm text-[#7B8186] mt-1">Manage your product suppliers.</p>
                </div>
                <RoleGuard allow={["admin"]}>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        Add Supplier
                    </button>
                </RoleGuard>
            </div>

            <div className="flex items-center bg-white border border-[#CBDDE9] rounded-lg px-4 py-2.5 max-w-md">
                <Search size={16} className="text-[#7B8186] mr-2" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search suppliers..."
                    className="w-full outline-none text-sm bg-transparent placeholder:text-[#7B8186]  text-[#7B8186]"
                />
            </div>

            <div className="bg-white border border-[#CBDDE9]/60 rounded-xl overflow-hidden">
                {isLoading ? (
                    <div className="p-10 text-center text-sm text-[#7B8186]">Loading suppliers...</div>
                ) : suppliers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="bg-[#CBDDE9]/30 rounded-full p-4 mb-4">
                            <Truck size={28} className="text-[#2872A1]" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-medium text-[#0F1923]">No suppliers yet</p>
                        <p className="text-sm text-[#7B8186] mt-1">Add your first supplier to get started.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-[#7B8186] uppercase tracking-wide border-b border-[#CBDDE9]/60">
                                <th className="px-6 py-3 font-medium">Company</th>
                                <th className="px-6 py-3 font-medium">Contact</th>
                                <th className="px-6 py-3 font-medium">Email</th>
                                <th className="px-6 py-3 font-medium">Phone</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((supplier, i) => (
                                <tr
                                    key={supplier.id}
                                    className={i !== suppliers.length - 1 ? "border-b border-[#CBDDE9]/40" : ""}
                                >
                                    <td className="px-6 py-3.5 text-[#0F1923] font-medium">{supplier.company_name}</td>
                                    <td className="px-6 py-3.5 text-[#7B8186]">{supplier.contact_person || "—"}</td>
                                    <td className="px-6 py-3.5 text-[#7B8186]">{supplier.email || "—"}</td>
                                    <td className="px-6 py-3.5 text-[#7B8186]">{supplier.phone || "—"}</td>
                                    <td className="px-6 py-3.5">
                                        <RoleGuard allow={["admin"]}>
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => openEditModal(supplier)} className="text-[#2872A1] hover:text-[#0F1923]">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(supplier.id)} className="text-[#7B8186] hover:text-red-600">
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
                <SupplierModal
                    supplier={editingSupplier}
                    onClose={() => setIsModalOpen(false)}
                    onCreate={(data) => createMutation.mutate(data, { onSuccess: () => setIsModalOpen(false) })}
                    onUpdate={(id, data) => updateMutation.mutate({ id, data }, { onSuccess: () => setIsModalOpen(false) })}
                />
            )}
        </div>
    );
}

function SupplierModal({
    supplier,
    onClose,
    onCreate,
    onUpdate,
}: {
    supplier: Supplier | null;
    onClose: () => void;
    onCreate: (data: SupplierInput) => void;
    onUpdate: (id: number, data: SupplierInput) => void;
}) {
    const isEditing = !!supplier;
    const [companyName, setCompanyName] = useState(supplier?.company_name ?? "");
    const [contactPerson, setContactPerson] = useState(supplier?.contact_person ?? "");
    const [email, setEmail] = useState(supplier?.email ?? "");
    const [phone, setPhone] = useState(supplier?.phone ?? "");
    const [address, setAddress] = useState(supplier?.address ?? "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { companyName, contactPerson, email, phone, address };
        if (isEditing) onUpdate(supplier.id, data);
        else onCreate(data);
    };

    return (
        <div className="fixed inset-0 bg-[#0F1923]/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
                <h2 className="text-lg font-serif font-bold text-[#0F1923] mb-4">
                    {isEditing ? "Edit Supplier" : "Add Supplier"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Company Name</label>
                        <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1]  text-[#7B8186]" />
                    </div>
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Contact Person</label>
                        <input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)}
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1]  text-[#7B8186]" />
                    </div>
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1]  text-[#7B8186]" />
                    </div>
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Phone</label>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)}
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1]  text-[#7B8186]" />
                    </div>
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Address</label>
                        <input value={address} onChange={(e) => setAddress(e.target.value)}
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1]  text-[#7B8186]" />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-[#7B8186] hover:text-[#0F1923]">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium rounded-lg">
                            {isEditing ? "Save Changes" : "Create Supplier"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}