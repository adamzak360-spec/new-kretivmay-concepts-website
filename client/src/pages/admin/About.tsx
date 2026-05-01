import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Trash2, Plus } from "lucide-react";

export default function AdminAbout() {
  const [about, setAbout] = useState({
    heroTitle: "About KretivMay Concepts",
    heroSubtitle: "Our journey, mission, and the team behind the creativity.",
    storyTitle: "Our Story",
    storyContent: "",
    mission: "",
    vision: "",
    reasons: [] as { title: string; description: string }[],
  });

  const { data: pageData, isLoading, refetch } = trpc.pages.get.useQuery({ page: "about", section: "content" });
  const upsertAbout = trpc.pages.upsert.useMutation({
    onSuccess: () => {
      toast.success("About page updated!");
      refetch();
    },
    onError: (err) => toast.error("Failed to update: " + err.message)
  });

  useEffect(() => {
    if (pageData && pageData.length > 0) {
      setAbout(prev => ({ ...prev, ...(pageData[0].content as any) }));
    }
  }, [pageData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAbout(prev => ({ ...prev, [name]: value }));
  };

  const addReason = () => {
    setAbout(prev => ({
      ...prev,
      reasons: [...prev.reasons, { title: "", description: "" }]
    }));
  };

  const updateReason = (index: number, field: 'title' | 'description', value: string) => {
    const newReasons = [...about.reasons];
    newReasons[index][field] = value;
    setAbout(prev => ({ ...prev, reasons: newReasons }));
  };

  const removeReason = (index: number) => {
    setAbout(prev => ({
      ...prev,
      reasons: prev.reasons.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertAbout.mutate({
      page: "about",
      section: "content",
      content: about
    });
  };

  if (isLoading) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-10">
        <h1 className="text-3xl font-bold">About Page Management</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Hero Section</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Heading</label>
              <input type="text" name="heroTitle" value={about.heroTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtext</label>
              <input type="text" name="heroSubtitle" value={about.heroSubtitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Company Story</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Story Title</label>
              <input type="text" name="storyTitle" value={about.storyTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Story Content (Markdown supported)</label>
              <textarea name="storyContent" value={about.storyContent} onChange={handleChange} rows={6} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Our Mission</h2>
              <textarea name="mission" value={about.mission} onChange={handleChange} rows={4} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Our Vision</h2>
              <textarea name="vision" value={about.vision} onChange={handleChange} rows={4} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold">Why Choose Us (Reasons)</h2>
              <Button type="button" onClick={addReason} size="sm" className="flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Reason
              </Button>
            </div>
            <div className="space-y-4">
              {about.reasons.map((reason, idx) => (
                <div key={idx} className="p-4 border rounded-lg relative bg-slate-50">
                  <button type="button" onClick={() => removeReason(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="space-y-2 pr-8">
                    <input
                      placeholder="Reason Title"
                      value={reason.title}
                      onChange={(e) => updateReason(idx, 'title', e.target.value)}
                      className="w-full px-3 py-1 border rounded"
                    />
                    <textarea
                      placeholder="Reason Description"
                      value={reason.description}
                      onChange={(e) => updateReason(idx, 'description', e.target.value)}
                      className="w-full px-3 py-1 border rounded"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2" disabled={upsertAbout.isPending}>
              {upsertAbout.isPending ? "Saving..." : "Save About Changes"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
