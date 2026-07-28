// TODO: fill in with real revenue/expense stat cards + income vs expense chart
export default function FinanceDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-serif font-bold text-[#0F1923]">Finance Dashboard</h1>
        <p className="text-sm text-[#7B8186] mt-1">
          Revenue, expenses, and net profit overview.
        </p>
      </div>

      {/* TODO: stat cards — Total Revenue, Total Expenses, Net Profit, Revenue MTD */}
      <div className="grid grid-cols-4 gap-4">
        {["Total Revenue", "Total Expenses", "Net Profit", "Revenue · MTD"].map((label) => (
          <div key={label} className="bg-white border border-[#CBDDE9]/60 rounded-xl p-5 h-28 flex items-center justify-center">
            <span className="text-xs text-[#7B8186]">{label} — placeholder</span>
          </div>
        ))}
      </div>

      {/* TODO: income vs expense trend chart */}
      <div className="bg-white border border-[#CBDDE9]/60 rounded-xl p-6 h-64 flex items-center justify-center">
        <span className="text-xs text-[#7B8186]">Income vs expense trend — placeholder</span>
      </div>

      {/* TODO: recent transactions (from unified transactions table) */}
      <div className="bg-white border border-[#CBDDE9]/60 rounded-xl p-6 h-48 flex items-center justify-center">
        <span className="text-xs text-[#7B8186]">Recent transactions — placeholder</span>
      </div>
    </div>
  );
}