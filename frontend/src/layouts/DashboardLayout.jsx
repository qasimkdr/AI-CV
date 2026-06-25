import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}) {
  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#dcf7ff_0,#f8fafc_34%,#ecfdf5_100%)]">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute left-10 top-24 h-56 w-56 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute bottom-16 right-12 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-3xl" />
      </div>

      <DashboardHeader />

      <div className="relative z-10 mx-auto flex max-w-7xl gap-2 px-4 pb-8 pt-4 md:px-6 lg:px-8">
        <Sidebar />

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
