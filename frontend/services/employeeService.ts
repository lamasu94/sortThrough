import api from "./api";

export type Employee = {
    id: number;
    name: string;
    email: string;
    role: "admin" | "sales_officer" | "finance_officer";
    avatar: string | null;
    created_at: string;
};

export type EmployeeInput = {
    name: string;
    email: string;
    role: "admin" | "sales_officer" | "finance_officer";
};

export type NewEmployeeInput = {
    name: string;
    email: string;
    password: string;
    role: "admin" | "sales_officer" | "finance_officer";
};

// creating an employee is really just registering a user — reuses /auth/register
export async function createEmployee(data: NewEmployeeInput): Promise<void> {
    await api.post("/auth/register", data);
}

export async function fetchEmployees(): Promise<Employee[]> {
    const response = await api.get("/users");
    return response.data.users;
}

export async function fetchEmployeeById(id: number): Promise<Employee> {
    const response = await api.get(`/users/${id}`);
    return response.data.user;
}

export async function updateEmployee(id: number, data: EmployeeInput): Promise<void> {
    await api.put(`/users/${id}`, data);
}

export async function deleteEmployee(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
}