"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, UserCog } from "lucide-react";
import {
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    Employee,
    EmployeeInput,
    NewEmployeeInput,
} from "@/services/employeeService";
import { useAuth } from "@/context/authContext";
import RoleGuard from "@/components/RoleGuard";

const ROLES = ["admin", "sales_officer", "finance_officer"] as const;

export default function EmployeesPage() {
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();

    const { data: employees = [], isLoading } = useQuery({
        queryKey: ["employees"],
        queryFn: fetchEmployees,
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["employees"] });

    const createMutation = useMutation({ mutationFn: createEmployee, onSuccess: invalidate });
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: EmployeeInput }) => updateEmployee(id, data),
        onSuccess: invalidate,
    });
    const deleteMutation = useMutation({ mutationFn: deleteEmployee, onSuccess: invalidate });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    const openCreateModal = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };

    const openEditModal = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        // extra client-side safety net — backend already blocks this too
        if (id === currentUser?.id) {
            alert("You cannot delete your own account.");
            return;
        }
        if (confirm("Delete this employee?")) deleteMutation.mutate(id);
    };

    return (
        <RoleGuard allow={["admin"]}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-serif font-bold text-[#0F1923]">Employees</h1>
                        <p className="text-sm text-[#7B8186] mt-1">Manage staff accounts and roles.</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        Add Employee
                    </button>
                </div>

                <div className="bg-white border border-[#CBDDE9]/60 rounded-xl overflow-hidden">
                    {isLoading ? (
                        <div className="p-10 text-center text-sm text-[#7B8186]">Loading employees...</div>
                    ) : employees.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                            <div className="bg-[#CBDDE9]/30 rounded-full p-4 mb-4">
                                <UserCog size={28} className="text-[#2872A1]" strokeWidth={1.5} />
                            </div>
                            <p className="text-sm font-medium text-[#0F1923]">No employees yet</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-[#7B8186] uppercase tracking-wide border-b border-[#CBDDE9]/60">
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Email</th>
                                    <th className="px-6 py-3 font-medium">Role</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee, i) => (
                                    <tr key={employee.id} className={i !== employees.length - 1 ? "border-b border-[#CBDDE9]/40" : ""}>
                                        <td className="px-6 py-3.5 text-[#0F1923] font-medium">
                                            {employee.name} {employee.id === currentUser?.id && <span className="text-xs text-[#7B8186]">(you)</span>}
                                        </td>
                                        <td className="px-6 py-3.5 text-[#7B8186]">{employee.email}</td>
                                        <td className="px-6 py-3.5">
                                            <span className="text-xs bg-[#CBDDE9]/40 text-[#0F1923] px-2 py-1 rounded-full">
                                                {employee.role.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => openEditModal(employee)} className="text-[#2872A1] hover:text-[#0F1923]">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(employee.id)} className="text-[#7B8186] hover:text-red-600">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {isModalOpen && (
                    <EmployeeModal
                        employee={editingEmployee}
                        onClose={() => setIsModalOpen(false)}
                        onCreate={(data) => createMutation.mutate(data, { onSuccess: () => setIsModalOpen(false) })}
                        onUpdate={(id, data) => updateMutation.mutate({ id, data }, { onSuccess: () => setIsModalOpen(false) })}
                    />
                )}
            </div>
        </RoleGuard>
    );
}

function EmployeeModal({
    employee,
    onClose,
    onCreate,
    onUpdate,
}: {
    employee: Employee | null;
    onClose: () => void;
    onCreate: (data: NewEmployeeInput) => void;
    onUpdate: (id: number, data: EmployeeInput) => void;
}) {
    const isEditing = !!employee;
    const [name, setName] = useState(employee?.name ?? "");
    const [email, setEmail] = useState(employee?.email ?? "");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<typeof ROLES[number]>(employee?.role ?? "sales_officer");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            onUpdate(employee.id, { name, email, role });
        } else {
            onCreate({ name, email, password, role });
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0F1923]/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
                <h2 className="text-lg font-serif font-bold text-[#0F1923] mb-4">
                    {isEditing ? "Edit Employee" : "Add Employee"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} required
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1]  text-[#7B8186]" />
                    </div>
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1]  text-[#7B8186]" />
                    </div>
                    {!isEditing && (
                        <div>
                            <label className="text-xs text-[#7B8186] uppercase tracking-wide">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1]  text-[#7B8186]" />
                        </div>
                    )}
                    <div>
                        <label className="text-xs text-[#7B8186] uppercase tracking-wide">Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value as typeof ROLES[number])}
                            className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none bg-white text-[#7B8186]">
                            {ROLES.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-[#7B8186] hover:text-[#0F1923]">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium rounded-lg">
                            {isEditing ? "Save Changes" : "Create Employee"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}