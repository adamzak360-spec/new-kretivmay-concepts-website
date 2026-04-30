import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ImageUpload } from "@/components/ImageUpload";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function AdminServices() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    fullDescription: "",
    bannerImageUrl: "",
    bannerImageKey: "",
    icon: "",
  });

  // Fetch services
  const { data: servicesList = [], refetch: refetchServices } = trpc.services.list.useQuery();

  // Create/Update mutations
  const createMutation = trpc.services.create.useMutation({
    onSuccess: () => {
      toast.success("Service added successfully!");
      resetForm();
      refetchServices();
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const updateMutation = trpc.services.update.useMutation({
    onSuccess: () => {
      toast.success("Service updated successfully!");
      resetForm();
      refetchServices();
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = trpc.services.delete.useMutation({
    onSuccess: () => {
      toast.success("Service deleted successfully!");
      refetchServices();
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleImageUpload = async (file: File) => {
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      
      setFormData((prev) => ({
        ...prev,
        bannerImageUrl: data.url,
        bannerImageKey: data.key,
      }));

      return { url: data.url, key: data.key };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      toast.error("Title and slug are required");
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        fullDescription: formData.fullDescription,
        bannerImageUrl: formData.bannerImageUrl,
        bannerImageKey: formData.bannerImageKey,
        icon: formData.icon,
      });
    } else {
      createMutation.mutate({
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        fullDescription: formData.fullDescription,
        bannerImageUrl: formData.bannerImageUrl,
        bannerImageKey: formData.bannerImageKey,
        icon: formData.icon,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      fullDescription: "",
      bannerImageUrl: "",
      bannerImageKey: "",
      icon: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      slug: item.slug,
      description: item.description || "",
      fullDescription: item.fullDescription || "",
      bannerImageUrl: item.bannerImageUrl || "",
      bannerImageKey: item.bannerImageKey || "",
      icon: item.icon || "",
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Services Management</h1>
          <Button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {showForm ? "Cancel" : "Add Service"}
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Service" : "Add Service"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Service Banner Image
                </label>
                <ImageUpload
                  onUpload={handleImageUpload}
                  onSuccess={(result) => {
                    setFormData((prev) => ({
                      ...prev,
                      bannerImageUrl: result.url,
                      bannerImageKey: result.key,
                    }));
                  }}
                  label="Upload Service Banner"
                  maxSize={20}
                  accept="image/*"
                />
                {formData.bannerImageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Preview:
                    </p>
                    <img
                      src={formData.bannerImageUrl}
                      alt="Preview"
                      className="max-h-48 rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-slate-800 dark:text-white"
                  placeholder="e.g., Graphic Design"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-slate-800 dark:text-white"
                  placeholder="e.g., graphic-design"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Short Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none dark:bg-slate-800 dark:text-white"
                  rows={2}
                  placeholder="Short service description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Description
                </label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, fullDescription: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none dark:bg-slate-800 dark:text-white"
                  rows={4}
                  placeholder="Detailed service description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Icon (emoji or text)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-slate-800 dark:text-white"
                  placeholder="e.g., 🎨"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingId
                      ? "Update Service"
                      : "Add Service"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        <div className="grid gap-4">
          <h2 className="text-xl font-bold">Services</h2>
          {servicesList.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No services yet. Add one to get started!
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {servicesList.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {item.bannerImageUrl && (
                    <img
                      src={item.bannerImageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                      Slug: {item.slug}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        className="flex-1"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
