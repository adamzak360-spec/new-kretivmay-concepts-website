import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { BarChart3, FileText, Image, MessageSquare, Settings, Star } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { label: "Portfolio Items", value: "0", icon: Image },
    { label: "Services", value: "0", icon: BarChart3 },
    { label: "Blog Posts", value: "0", icon: FileText },
    { label: "Testimonials", value: "0", icon: Star },
  ];

  const menuItems = [
    { label: "Portfolio", href: "/admin/portfolio", icon: Image },
    { label: "Services", href: "/admin/services", icon: BarChart3 },
    { label: "Blog Posts", href: "/admin/blog", icon: FileText },
    { label: "Testimonials", href: "/admin/testimonials", icon: Star },
    { label: "Messages", href: "/admin/messages", icon: MessageSquare },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-slate-600 mt-2">Here's what's happening with your website.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <Icon className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link key={index} href={item.href}>
                  <a className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center gap-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                    <span className="font-semibold">{item.label}</span>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-slate-600 text-center py-8">
              No recent activity yet. Start by adding portfolio items or services!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
