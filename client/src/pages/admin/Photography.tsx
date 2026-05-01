import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ImageUpload } from "@/components/ImageUpload";
import { Plus, Trash2, Edit2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function AdminPhotography() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    imageKey: "",
    featured: false,
  });

  // Fetch photography items (portfolio with photography category)
  const { data: photographyItems = [], refetch: refetchPhotography } = trpc.portfolio.list.useQuery({
    category: "photography",
  });

  // Create/Update mutations
  const createMutation = trpc.portfolio.create.useMutation({
    onSuccess: () => {
      toast.success("Photography item added successfully!");
      resetForm();
      refetchPhotography();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const updateMutation = trpc.portfolio.update.useMutation({
    onSuccess: () => {
      toast.success("Photography item updated successfully!");
      resetForm();
      refetchPhotography();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = trpc.portfolio.delete.useMutation({
    onSuccess: () => {
      toast.success("Photography item deleted successfully!");
      refetchPhotography();
    },
    onError: (error) => {
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
        imageUrl: data.url,
        imageKey: data.key,
      }));

      return { url: data.url, key: data.key };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    if (!formData.imageUrl) {
      toast.error("Please upload a photo");
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        title: formData.title,
        description: formData.description,
        category: "photography",
        featured: formData.featured,
        imageUrl: formData.imageUrl,
        imageKey: formData.imageKey,
      });
    } else {
      createMutation.mutate({
        title: formData.title,
        description: formData.description,
        category: "photography",
        featured: formData.featured,
        imageUrl: formData.imageUrl,
        imageKey: formData.imageKey,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      imageKey: "",
      featured: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      description: item.description || "",
      imageUrl: item.imageUrl,
      imageKey: item.imageKey,
      featured: item.featured,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this photography item?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Photography Management</h1>
            <p className="text-slate-600 mt-1">Manage your photography gallery</p>
          </div>
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
            {showForm ? "Cancel" : "Add Photo"}
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Photography" : "Add Photography"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Photography Image *
                </label>
                <ImageUpload
                  onUpload={handleImageUpload}
                  onSuccess={(result) => {
                    setFormData((prev) => ({
                      ...prev,
                      imageUrl: result.url,
                      imageKey: result.key,
                    }));
                  }}
                  label="Upload Photography (JPG, PNG, GIF, WebP)"
                  maxSize={20}
                  accept="image/*"
                />
                {formData.imageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Preview:
                    </p>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="max-h-48 rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-slate-800 dark:text-white"
                  placeholder="Photo title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none dark:bg-slate-800 dark:text-white"
                  rows={4}
                  placeholder="Photo description"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium">
                  Featured
                </label>
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
                      ? "Update Photo"
                      : "Add Photo"}
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

        {/* Photography Items List */}
        <div className="grid gap-6">
          <h2 className="text-xl font-bold">Photography Items ({photographyItems.length})</h2>
          {photographyItems.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900 p-12 rounded-lg text-center border border-slate-200 dark:border-slate-700">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No photography items yet. Add one to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {photographyItems.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700"
                >
                  <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {item.description || "No description"}
                    </p>
                    {item.featured && (
                      <div className="mb-3">
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                          Featured
                        </span>
                      </div>
                    )}
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
