import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { 
  Briefcase, 
  Image as ImageIcon, 
  MessageSquare, 
  Star, 
  FileText,
  PlusCircle,
  ExternalLink,
  Upload,
  Video
} from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();
  
  const { data: services } = trpc.services.list.useQuery();
  const { data: portfolio } = trpc.portfolio.list.useQuery();
  const { data: messages } = trpc.contact.list.useQuery();

  const stats = [
    { label: "Services", value: services?.length || 0, icon: Briefcase, color: "bg-blue-500", path: "/admin/services" },
    { label: "Portfolio", value: portfolio?.length || 0, icon: ImageIcon, color: "bg-purple-500", path: "/admin/portfolio" },
    { label: "Photography", value: portfolio?.filter(p => p.category === 'photography').length || 0, icon: ImageIcon, color: "bg-pink-500", path: "/admin/photography" },
    { label: "Messages", value: messages?.filter(m => !m.read).length || 0, icon: MessageSquare, color: "bg-orange-500", path: "/admin/messages", suffix: " unread" },
  ];

  const quickActions = [
    { label: "Add Portfolio Item", icon: PlusCircle, path: "/admin/portfolio" },
    { label: "Add Service", icon: PlusCircle, path: "/admin/services" },
    { label: "Add Photography", icon: PlusCircle, path: "/admin/photography" },
    { label: "View Website", icon: ExternalLink, path: "/", external: true },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name || 'Admin'}</h1>
          <p className="text-slate-500 mt-2">Manage your portfolio, services, and photography content.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.path}>
              <a className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow block">
                <div className="flex items-center gap-4">
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stat.value}
                      {stat.suffix && <span className="text-xs font-normal text-slate-400">{stat.suffix}</span>}
                    </p>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
              {quickActions.map((action) => (
                action.external ? (
                  <a 
                    key={action.label} 
                    href={action.path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <action.icon className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-sm">{action.label}</span>
                  </a>
                ) : (
                  <Link key={action.label} href={action.path}>
                    <a className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                      <action.icon className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-sm">{action.label}</span>
                    </a>
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Recent Messages Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Recent Messages</h2>
              <Link href="/admin/messages">
                <a className="text-sm text-blue-600 hover:underline">View all</a>
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {messages && messages.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {messages.slice(0, 5).map((msg) => (
                    <div key={msg.id} className={`p-4 hover:bg-slate-50 transition-colors ${!msg.read ? 'bg-blue-50/30' : ''}`}>
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-slate-900">{msg.name}</p>
                        <p className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-1">{msg.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500">No messages yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
