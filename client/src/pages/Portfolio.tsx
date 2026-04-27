import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, X } from "lucide-react";

const categories = ["design", "print", "branding", "photography", "video"];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const { data: portfolio, isLoading } = trpc.portfolio.list.useQuery({
    category: selectedCategory || undefined,
  });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Portfolio</h1>
          <p className="text-xl text-blue-100">
            Explore our latest creative works and projects
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                selectedCategory === null
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              All Works
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors capitalize ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {portfolio?.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-auto group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-slate-200 capitalize">{item.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 text-white">
              <h2 className="text-2xl font-bold">{selectedImage.title}</h2>
              <p className="text-slate-300">{selectedImage.description}</p>
              <p className="text-sm text-slate-400 capitalize mt-2">
                Category: {selectedImage.category}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
