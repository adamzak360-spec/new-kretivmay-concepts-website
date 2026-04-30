import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function AdminMessages() {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  // Fetch contact messages
  const { data: messages = [], refetch: refetchMessages } = trpc.contact.list.useQuery();

  // Mark as read mutation
  const markAsReadMutation = trpc.contact.markAsRead.useMutation({
    onSuccess: () => {
      refetchMessages();
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const selectedMsg = messages.find((m: any) => m.id === selectedMessage);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Contact Form Messages</h1>

        {messages.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No Messages</h2>
            <p className="text-slate-600">
              Messages from your contact form will appear here. Share your contact page link to start receiving inquiries.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-slate-50 border-b px-4 py-3">
                  <h2 className="font-semibold text-sm">
                    Messages ({messages.length})
                  </h2>
                </div>
                <div className="divide-y max-h-96 overflow-y-auto">
                  {messages.map((message: any) => (
                    <button
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message.id);
                        if (!message.read) {
                          handleMarkAsRead(message.id);
                        }
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${
                        selectedMessage === message.id
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : message.read
                            ? "bg-white"
                            : "bg-blue-50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.read ? (
                          <MailOpen className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Mail className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium truncate ${
                            message.read ? "text-slate-600" : "text-slate-900"
                          }`}>
                            {message.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {message.email}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMsg ? (
                <div className="bg-white rounded-lg shadow p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{selectedMsg.name}</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm text-slate-600">Email</label>
                        <a
                          href={`mailto:${selectedMsg.email}`}
                          className="text-blue-600 hover:underline break-all"
                        >
                          {selectedMsg.email}
                        </a>
                      </div>
                      {selectedMsg.phone && (
                        <div>
                          <label className="text-sm text-slate-600">Phone</label>
                          <a
                            href={`tel:${selectedMsg.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {selectedMsg.phone}
                          </a>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Date</label>
                      <p className="text-slate-900">
                        {formatDate(selectedMsg.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-3">Message</h3>
                    <p className="text-slate-700 whitespace-pre-wrap">
                      {selectedMsg.message}
                    </p>
                  </div>

                  <div className="border-t pt-6 flex gap-2">
                    <Button
                      onClick={() => {
                        window.location.href = `mailto:${selectedMsg.email}`;
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Reply via Email
                    </Button>
                    {selectedMsg.phone && (
                      <Button
                        onClick={() => {
                          window.location.href = `https://wa.me/${selectedMsg.phone.replace(/\D/g, "")}`;
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        WhatsApp
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-6 text-center">
                  <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">
                    Select a message to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages Table */}
        {messages.length > 0 && (
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
              <tbody className="divide-y">
                {messages.map((message: any) => (
                  <tr key={message.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3">
                      {message.read ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          <MailOpen className="w-3 h-3" />
                          Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          <Mail className="w-3 h-3" />
                          New
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium">{message.name}</td>
                    <td className="px-6 py-3 text-sm">
                      <a href={`mailto:${message.email}`} className="text-blue-600 hover:underline">
                        {message.email}
                      </a>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {message.phone ? (
                        <a href={`tel:${message.phone}`} className="text-blue-600 hover:underline">
                          {message.phone}
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {formatDate(message.createdAt)}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedMessage(message.id)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
