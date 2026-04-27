import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminServices() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    fullDescription: "",
    icon: "🎨",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Service added successfully!");
    setFormData({ title: "", slug: "", description: "", fullDescription: "", icon: "🎨" });
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Services Management</h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Service
          </Button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Add Service</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Service title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="service-slug"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Short Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  rows={2}
                  placeholder="Brief description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Full Description</label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  rows={4}
                  placeholder="Detailed description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Icon (Emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="🎨"
                  maxLength={2}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Add Service
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-slate-300 hover:bg-slate-400 text-slate-900"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Slug</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Icon</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-slate-50">
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No services yet. Add one to get started!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
