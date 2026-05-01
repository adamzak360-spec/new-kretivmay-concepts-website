import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { ImageUpload } from "@/components/ImageUpload";
import { Trash2, Plus } from "lucide-react";

export default function AdminHero() {
  const [hero, setHero] = useState({
    title: "Creative Design & Printing Solutions",
    subtitle: "Elevate Your Brand with Professional Design, Printing, and Marketing Services",
    ctaText: "View Portfolio",
    ctaLink: "/portfolio",
    secondaryCtaText: "Contact Us",
    secondaryCtaLink: "/contact",
    images: [] as { url: string; key: string }[],
  });

  const { data: pageData, isLoading, refetch } = trpc.pages.get.useQuery({ page: "home", section: "hero" });
  const upsertHero = trpc.pages.upsert.useMutation({
    onSuccess: () => {
      toast.success("Hero section updated!");
      refetch();
    },
    onError: (err) => toast.error("Failed to update: " + err.message)
  });

  useEffect(() => {
    if (pageData && pageData.length > 0) {
      setHero(prev => ({ ...prev, ...(pageData[0].content as any) }));
    }
  }, [pageData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHero(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (res: { url: string; key: string }) => {
    setHero(prev => ({
      ...prev,
      images: [...prev.images, res]
    }));
  };

  const removeImage = (index: number) => {
    setHero(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertHero.mutate({
      page: "home",
      section: "hero",
      content: hero
    });
  };

  if (isLoading) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-10">
        <h1 className="text-3xl font-bold">Hero Section Management</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Text Content</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Main Heading</label>
              <input
                type="text"
                name="title"
                value={hero.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtext / Description</label>
              <textarea
                name="subtitle"
                value={hero.subtitle}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Primary CTA Text</label>
                <input
                  type="text"
                  name="ctaText"
                  value={hero.ctaText}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Primary CTA Link</label>
                <input
                  type="text"
                  name="ctaLink"
                  value={hero.ctaLink}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Background Images (Slideshow)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hero.images.map((img, idx) => (
                <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border">
                  <img src={img.url} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="border-2 border-dashed rounded-lg flex items-center justify-center aspect-video">
                <ImageUpload 
                  onUpload={async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                    const data = await res.json();
                    return { url: data.url, key: data.key };
                  }}
                  onSuccess={handleImageUpload}
                  label="Add Slide"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2" disabled={upsertHero.isPending}>
              {upsertHero.isPending ? "Saving..." : "Save Hero Changes"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
