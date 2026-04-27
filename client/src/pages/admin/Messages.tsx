import DashboardLayout from "@/components/DashboardLayout";
import { Mail, MailOpen } from "lucide-react";

export default function AdminMessages() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Contact Form Messages</h1>

        {/* Messages List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-slate-50">
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No messages yet. When visitors submit the contact form, they'll appear here.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No Messages</h2>
          <p className="text-slate-600">
            Messages from your contact form will appear here. Share your contact page link to start receiving inquiries.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
