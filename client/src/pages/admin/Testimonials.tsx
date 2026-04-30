import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ImageUpload } from "@/components/ImageUpload";
import { Plus, Trash2, Edit2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function AdminTestimonials() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    clientName: "",
    clientCompany: "",
    content: "",
    rating: 5,
    imageUrl: "",
    imageKey: "",
    featured: false,
  });

  // Fetch testimonials
  const { data: testimonialsList = [], refetch: refetchTestimonials } = trpc.testimonials.list.useQuery();

  // Create/Update mutations
  const createMutation = trpc.testimonials.create.useMutation({
    onSuccess: () => {
      toast.success("Testimonial added successfully!");
      resetForm();
      refetchTestimonials();
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const updateMutation = trpc.testimonials.update.useMutation({
    onSuccess: () => {
      toast.success("Testimonial updated successfully!");
      resetForm();
      refetchTestimonials();
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = trpc.testimonials.delete.useMutation({
    onSuccess: () => {
      toast.success("Testimonial deleted successfully!");
      refetchTestimonials();
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

    if (!formData.clientName || !formData.content) {
      toast.error("Client name and testimonial content are required");
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        clientName: formData.clientName,
        clientCompany: formData.clientCompany,
        content: formData.content,
        rating: formData.rating,
        imageUrl: formData.imageUrl,
        imageKey: formData.imageKey,
        featured: formData.featured,
      });
    } else {
      createMutation.mutate({
        clientName: formData.clientName,
        clientCompany: formData.clientCompany,
        content: formData.content,
        rating: formData.rating,
        imageUrl: formData.imageUrl,
        imageKey: formData.imageKey,
        featured: formData.featured,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientCompany: "",
      content: "",
      rating: 5,
      imageUrl: "",
      imageKey: "",
      featured: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      clientName: item.clientName,
      clientCompany: item.clientCompany || "",
      content: item.content,
      rating: item.rating || 5,
      imageUrl: item.imageUrl || "",
      imageKey: item.imageKey || "",
      featured: item.featured,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Testimonials Management</h1>
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
            {showForm ? "Cancel" : "Add Testimonial"}
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Testimonial" : "Add Testimonial"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Client Photo
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
                  label="Upload Client Photo"
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
                <label className="block text-sm font-medium mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-slate-800 dark:text-white"
                  placeholder="Client name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Company/Organization
                </label>
                <input
                  type="text"
                  value={formData.clientCompany}
                  onChange={(e) =>
                    setFormData({ ...formData, clientCompany: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-slate-800 dark:text-white"
                  placeholder="Client company"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Testimonial *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none dark:bg-slate-800 dark:text-white"
                  rows={4}
                  placeholder="What the client said about your service"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`text-2xl transition-colors ${
                        star <= formData.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
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
                  Featured (show on homepage)
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
                      ? "Update Testimonial"
                      : "Add Testimonial"}
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

        {/* Testimonials List */}
        <div className="grid gap-4">
          <h2 className="text-xl font-bold">Testimonials</h2>
          {testimonialsList.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No testimonials yet. Add one to get started!
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {testimonialsList.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.clientName}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{item.clientName}</h3>
                        {item.clientCompany && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.clientCompany}
                          </p>
                        )}
                      </div>
                      {item.featured && (
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: item.rating || 0 }).map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {item.content}
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
