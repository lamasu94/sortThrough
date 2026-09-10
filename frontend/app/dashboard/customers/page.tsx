"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Users, Search } from "lucide-react";
import {
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    Customer,
    CustomerInput,
} from "@/services/customerService";
import RoleGuard from "@/components/RoleGuard";

export default function CustomersPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");

    const { data: customers = [], isLoading } = useQuery({
        queryKey: ["customers", search],
        queryFn: () => fetchCustomers(search),
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["customers"] });

    const createMutation = useMutation({ mutationFn: createCustomer, onSuccess: invalidate });
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: CustomerInput }) => updateCustomer(id, data),
        onSuccess: invalidate,
    });
    const deleteMutation = useMutation({ mutationFn: deleteCustomer, onSuccess: invalidate });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    const openCreateModal = () => {
        setEditingCustomer(null);
        setIsModalOpen(true);
    };

    const openEditModal = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Delete this customer?")) deleteMutation.mutate(id);
    };

    // NOTE: Create/Edit -> admin + sales_officer. Delete -> admin only.
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-serif font-bold text-[#0F1923]">Customers</h1>
                    <p className="text-sm text-[#7B8186] mt-1">Manage your customer records.</p>
                </div>
                <RoleGuard allow={["admin", "sales_officer"]}>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        Add Customer
                    </button>
                </RoleGuard>
            </div>

            <div className="flex items-center bg-white border border-[#CBDDE9] rounded-lg px-4 py-2.5 max-w-md">
                <Search size={16} className="text-[#7B8186] mr-2" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customers..."
                    className="w-full outline-none text-sm bg-transparent placeholder:text-[#7B8186]  text-[#7B8186]"
                />
            </div>

            <div className="bg-white border border-[#CBDDE9]/60 rounded-xl overflow-hidden">
                {isLoading ? (
                    <div className="p-10 text-center text-sm text-[#7B8186]">Loading customers...</div>
                ) : customers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="bg-[#CBDDE9]/30 rounded-full p-4 mb-4">
                            <Users size={28} className="text-[#2872A1]" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-medium text-[#0F1923]">No customers yet</p>
                        <p className="text-sm text-[#7B8186] mt-1">Add your first customer to get started.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-[#7B8186] uppercase tracking-wide border-b border-[#CBDDE9]/60">
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">Phone</th>
                                <th className="px-6 py-3 font-medium">Email</th>
                                <th className="px-6 py-3 font-medium">Address</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer, i) => (
                                <tr
                                    key={customer.id}
                                    className={i !== customers.length - 1 ? "border-b border-[#CBDDE9]/40" : ""}
                                >
                                    <td className="px-6 py-3.5 text-[#0F1923] font-medium">{customer.full_name}</td>
                                    <td className="px-6 py-3.5 text-[#7B8186]">{customer.phone || "—"}</td>
                                    <td className="px-6 py-3.5 text-[#7B8186]">{customer.email || "—"}</td>
                                    <td className="px-6 py-3.5 text-[#7B8186]">{customer.address || "—"}</td>
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center justify-end gap-3">
                                            <RoleGuard allow={["admin", "sales_officer"]}>
                                                <button onClick={() => openEditModal(customer)} className="text-[#2872A1] hover:text-[#0F1923]">
                                                    <Pencil size={16} />
                                                </button>
                                            </RoleGuard>
                                            <RoleGuard allow={["admin"]}>
                                                <button onClick={() => handleDelete(customer.id)} className="text-[#7B8186] hover:text-red-600">
                                                    <Trash2 size={16} />
                                                </button>
                                            </RoleGuard>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <CustomerModal
                    customer={editingCustomer}
                    onClose={() => setIsModalOpen(false)}
                    onCreate={(data) => createMutation.mutate(data, { onSuccess: () => setIsModalOpen(false) })}
                    onUpdate={(id, data) => updateMutation.mutate({ id, data }, { onSuccess: () => setIsModalOpen(false) })}
                />
            )}
        </div>
    );
}

function CustomerModal({
    customer,
    onClose,
    onCreate,
    onUpdate,
}: {
    customer: Customer | null;
    onClose: () => void;
    onCreate: (data: CustomerInput) => void;
    onUpdate: (id: number, data: CustomerInput) => void;
}) {
    const isEditing = !!customer;
    const [fullName, setFullName] = useState(customer?.full_name ?? "");
    const [phone, setPhone] = useState(customer?.phone ?? "");
    const [email, setEmail] = useState(customer?.email ?? "");
    const [address, setAddress] = useState(customer?.address ?? "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { fullName, phone, email, address };
        if (isEditing) onUpdate(customer.id, data);
        else onCreate(data);
    };

    return (
        <div className="fixed inset-0 bg-[#0F1923]/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
                <h2 className="text-lg font-serif font-bold text-[#0F1923] mb-4">
                    {isEditing ? "Edit Customer" : "Add Customer"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Full Name</label>
                        <input value={fullName} onChange={(e) => setFullName(e.target.value)} required
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1]  text-[#7B8186]" />
                    </div>
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Phone</label>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)}
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] text-[#7B8186]" />
                    </div>
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1]  text-[#7B8186]" />
                    </div>
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Address</label>
                        <input value={address} onChange={(e) => setAddress(e.target.value)}
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1]  text-[#7B8186]" />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-[#7B8186] hover:text-[#0F1923] ">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium rounded-lg">
                            {isEditing ? "Save Changes" : "Create Customer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}