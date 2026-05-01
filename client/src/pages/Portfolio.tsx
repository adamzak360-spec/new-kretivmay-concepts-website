import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { X, Play } from "lucide-react";
import { FALLBACK_FEATURED_WORKS } from "@/lib/fallbacks";

const categories = ["design", "print", "branding", "photography", "video"];

const isVideo = (url: string) => {
  return url.includes(".mp4") || url.includes(".webm") || url.includes(".mov");
};

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const { data: portfolio = FALLBACK_FEATURED_WORKS } = trpc.portfolio.list.useQuery({
    category: selectedCategory || undefined,
  }, {
    placeholderData: FALLBACK_FEATURED_WORKS,
    retry: false
  });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Portfolio</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
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
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === null
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All Works
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all capitalize ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
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
          {portfolio && portfolio.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden bg-slate-100">
                    {isVideo(item.imageUrl) ? (
                      <>
                        <video
                          src={item.imageUrl}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => e.currentTarget.pause()}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                          <Play className="w-16 h-16 text-white fill-white" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-end p-4">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-slate-200 capitalize">{item.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">No portfolio items found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              {isVideo(selectedItem.imageUrl) ? (
                <video
                  src={selectedItem.imageUrl}
                  className="w-full h-auto"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-auto"
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{selectedItem.title}</h2>
                {selectedItem.description && (
                  <p className="text-slate-700 mb-4 leading-relaxed">{selectedItem.description}</p>
                )}
                <p className="text-sm text-slate-600 capitalize">
                  <span className="font-semibold">Category:</span> {selectedItem.category}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
