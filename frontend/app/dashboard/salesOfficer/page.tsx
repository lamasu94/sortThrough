// TODO: fill in with real stat cards + today's/recent sales for this officer
export default function SalesDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-serif font-bold text-[#0F1923]">Sales Dashboard</h1>
        <p className="text-sm text-[#7B8186] mt-1">
          Your sales performance and recent activity.
        </p>
      </div>

      {/* TODO: stat cards — Today's Sales, My Sales This Week, Top Product, Total Customers Served */}
      <div className="grid grid-cols-4 gap-4">
        {["Today's Sales", "This Week", "Top Product", "Customers Served"].map((label) => (
          <div key={label} className="bg-white border border-[#CBDDE9]/60 rounded-xl p-5 h-28 flex items-center justify-center">
            <span className="text-xs text-[#7B8186]">{label} — placeholder</span>
          </div>
        ))}
      </div>

      {/* TODO: quick "New Sale" shortcut + recent sales list for this officer */}
      <div className="bg-white border border-[#CBDDE9]/60 rounded-xl p-6 h-64 flex items-center justify-center">
        <span className="text-xs text-[#7B8186]">Recent sales — placeholder</span>
      </div>
    </div>
  );
}