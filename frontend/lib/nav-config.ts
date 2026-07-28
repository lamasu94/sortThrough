import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  Users,
  UserCog,
  ShoppingCart,
  Wallet,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

// ── Admin ──────────────────────────────────────────────
// Full control over employees, products, suppliers, customers.
// Oversight (read) access to Sales & Finance. Sees all reports.
export const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Categories", href: "/dashboard/categories", icon: Tags },
  { label: "Suppliers", href: "/dashboard/suppliers", icon: Truck },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Employees", href: "/dashboard/employees", icon: UserCog },
  { label: "Sales", href: "/dashboard/sales", icon: ShoppingCart },
  { label: "Finance", href: "/dashboard/finance", icon: Wallet },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

// ── Sales Officer ──────────────────────────────────────
// Full control over Sales & Customers. View-only on Products/
// Suppliers/Categories (needed to build a sale). Sales reports only.
export const salesNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "New Sale", href: "/dashboard/sales/new", icon: ShoppingCart },
  { label: "Sales History", href: "/dashboard/sales", icon: FileText },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Suppliers", href: "/dashboard/suppliers", icon: Truck },
  { label: "Reports", href: "/dashboard/reports/sales", icon: FileText },
];

// ── Finance Officer ────────────────────────────────────
// Full control over Finance (income/expenses). View-only on
// Products/Suppliers/Customers/Sales for context. Financial reports only.
export const financeNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Finance", href: "/dashboard/finance", icon: Wallet },
  { label: "Sales", href: "/dashboard/sales", icon: ShoppingCart },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Suppliers", href: "/dashboard/suppliers", icon: Truck },
  { label: "Reports", href: "/dashboard/reports/finance", icon: FileText },
];

// ── Lookup by role ─────────────────────────────────────
export type Role = "admin" | "sales_officer" | "finance_officer";

export const navItemsByRole: Record<Role, NavItem[]> = {
  admin: adminNavItems,
  sales_officer: salesNavItems,
  finance_officer: financeNavItems,
};