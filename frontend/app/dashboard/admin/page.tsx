// TODO: fill in with real stat cards, chart, and recent transactions
// (see earlier dashboard-page.tsx draft for full Admin layout reference)
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-serif font-bold text-[#0F1923]">Admin Dashboard</h1>
        <p className="text-sm text-[#7B8186] mt-1">
          Overview across products, sales, and finance.
        </p>
      </div>

      {/* TODO: stat cards — Total Products, Total Sales, Low Stock, Revenue */}
      <div className="grid grid-cols-4 gap-4">
        {["Total Products", "Total Sales", "Low Stock", "Revenue"].map((label) => (
          <div key={label} className="bg-white border border-[#CBDDE9]/60 rounded-xl p-5 h-28 flex items-center justify-center">
            <span className="text-xs text-[#7B8186]">{label} — placeholder</span>
          </div>
        ))}
      </div>

      {/* TODO: sales overview chart + low stock list */}
      <div className="bg-white border border-[#CBDDE9]/60 rounded-xl p-6 h-64 flex items-center justify-center">
        <span className="text-xs text-[#7B8186]">Sales overview + low stock — placeholder</span>
      </div>

      {/* TODO: recent transactions table (all employees) */}
      <div className="bg-white border border-[#CBDDE9]/60 rounded-xl p-6 h-48 flex items-center justify-center">
        <span className="text-xs text-[#7B8186]">Recent transactions — placeholder</span>
      </div>
    </div>
  );
}