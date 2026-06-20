import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, Search, Mail, Phone, Calendar, User } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch customers
  const { data: customers = [] } = trpc.admin.customers.list.useQuery();

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-slate-600 mt-1">View and manage your registered customers</p>
        </div>

        {/* Customer Search */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Customers ({filteredCustomers.length})</h2>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-semibold text-sm text-slate-900">Customer</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-900">Contact</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-900">Location</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-900">Joined</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-900 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{customer.name || 'Anonymous'}</p>
                            <p className="text-xs text-slate-500">ID: {customer.openId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-3.5 h-3.5" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="w-3.5 h-3.5" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {customer.city && customer.country ? `${customer.city}, ${customer.country}` : 'Not provided'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-sm text-blue-600 hover:underline font-medium">
                          View Orders
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
