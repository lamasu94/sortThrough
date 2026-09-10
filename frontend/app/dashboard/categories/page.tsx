"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    Category,
    CategoryInput,
} from "@/services/categoryService";
import RoleGuard from "@/components/RoleGuard";

export default function CategoriesPage() {
    const queryClient = useQueryClient();

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: CategoryInput }) => updateCategory(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const openCreateModal = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Delete this category?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-serif font-bold text-[#0F1923]">Categories</h1>
                    <p className="text-sm text-[#7B8186] mt-1">Organize your products into categories.</p>
                </div>
                <RoleGuard allow={["admin"]}>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        Add Category
                    </button>
                </RoleGuard>
            </div>

            <div className="bg-white border border-[#CBDDE9]/60 rounded-xl overflow-hidden">
                {isLoading ? (
                    <div className="p-10 text-center text-sm text-[#7B8186]">Loading categories...</div>
                ) : categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="bg-[#CBDDE9]/30 rounded-full p-4 mb-4">
                            <FolderOpen size={28} className="text-[#2872A1]" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-medium text-[#0F1923]">No categories yet</p>
                        <p className="text-sm text-[#7B8186] mt-1">
                            Create your first category to start organizing products.
                        </p>
                        <RoleGuard allow={["admin"]}>
                            <button
                                onClick={openCreateModal}
                                className="mt-4 text-sm font-medium text-[#2872A1] hover:text-[#0F1923] transition-colors"
                            >
                                + Add Category
                            </button>
                        </RoleGuard>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-[#7B8186] uppercase tracking-wide border-b border-[#CBDDE9]/60">
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">Description</th>
                                <th className="px-6 py-3 font-medium">Created</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, i) => (
                                <tr
                                    key={category.id}
                                    className={i !== categories.length - 1 ? "border-b border-[#CBDDE9]/40" : ""}
                                >
                                    <td className="px-6 py-3.5 text-[#0F1923] font-medium">{category.name}</td>
                                    <td className="px-6 py-3.5 text-[#7B8186]">{category.description || "—"}</td>
                                    <td className="px-6 py-3.5 text-[#7B8186]">{category.created_at}</td>
                                    <td className="px-6 py-3.5">
                                        <RoleGuard allow={["admin"]}>
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => openEditModal(category)}
                                                    className="text-[#2872A1] hover:text-[#0F1923] transition-colors"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="text-[#7B8186] hover:text-red-600 transition-colors"
                                                >
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
                <CategoryModal
                    category={editingCategory}
                    onClose={() => setIsModalOpen(false)}
                    onCreate={(data) => createMutation.mutate(data, { onSuccess: () => setIsModalOpen(false) })}
                    onUpdate={(id, data) =>
                        updateMutation.mutate({ id, data }, { onSuccess: () => setIsModalOpen(false) })
                    }
                />
            )}
        </div>
    );
}

function CategoryModal({
    category,
    onClose,
    onCreate,
    onUpdate,
}: {
    category: Category | null;
    onClose: () => void;
    onCreate: (data: CategoryInput) => void;
    onUpdate: (id: number, data: CategoryInput) => void;
}) {
    const isEditing = !!category;
    const [name, setName] = useState(category?.name ?? "");
    const [description, setDescription] = useState(category?.description ?? "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            onUpdate(category.id, { name, description });
        } else {
            onCreate({ name, description });
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0F1923]/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
                <h2 className="text-lg font-serif font-bold text-[#0F1923] mb-4">
                    {isEditing ? "Edit Category" : "Add Category"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Electronics"
                            required
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] placeholder:text-[#7B8186]  text-[#7B8186]"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description"
                            rows={3}
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] resize-none placeholder:text-[#7B8186]  text-[#7B8186]"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-[#7B8186] hover:text-[#0F1923] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            {isEditing ? "Save Changes" : "Create Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}