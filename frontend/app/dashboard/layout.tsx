import Sidebar from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 bg-[#F7F9FA] p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}