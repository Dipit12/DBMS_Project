import { Link, Outlet, useLocation } from "react-router-dom";

const nav = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/products", label: "Products", icon: "📦" },
  { path: "/audit", label: "Audit Logs", icon: "📝" },
  { path: "/roles", label: "Roles", icon: "⚙️" },
];

export default function DashboardLayout({ onLogout }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex bg-[#EEF1F6] text-gray-800">

      {/* Sidebar */}
      <aside className="w-64 bg-[#0E1525] text-white flex flex-col p-6 space-y-8 shadow-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight">DB Secure</h1>

        <nav className="space-y-3 flex-1">
          {nav.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
              ${pathname === item.path ? "bg-white/15 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"}`}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 py-2 rounded-lg transition w-full"
        >
          Logout
        </button>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>

    </div>
  );
}
