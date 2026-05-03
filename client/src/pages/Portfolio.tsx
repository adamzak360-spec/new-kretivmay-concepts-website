import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { X, Play } from "lucide-react";
import { FALLBACK_FEATURED_WORKS } from "@/lib/fallbacks";
import VideoCard from "@/components/VideoCard";

const categories = ["design", "print", "branding", "photography", "video"];

const FEATURED_VIDEOS = [
  {
    id: "reel-1",
    title: "Creative Design Showcase",
    description: "Explore our latest graphic design and branding projects",
    reelUrl: "https://www.facebook.com/reel/1015961763691394/",
    likes: 245,
    shares: 32,
    comments: 18,
  },
  {
    id: "reel-2",
    title: "Professional Photography Session",
    description: "Behind the scenes of our professional photography work",
    reelUrl: "https://www.facebook.com/reel/723578130025160/",
    likes: 189,
    shares: 28,
    comments: 14,
  },
  {
    id: "reel-3",
    title: "Printing Solutions in Action",
    description: "High-quality printing services for your business needs",
    reelUrl: "https://www.facebook.com/reel/1898178464045125/",
    likes: 312,
    shares: 45,
    comments: 22,
  },
  {
    id: "reel-4",
    title: "Social Media Marketing Campaign",
    description: "Boost your brand presence with our marketing expertise",
    reelUrl: "https://www.facebook.com/reel/1242733524291783/",
    likes: 267,
    shares: 38,
    comments: 19,
  },
];

const isVideo = (url: string) => {
  return url.includes(".mp4") || url.includes(".webm") || url.includes(".mov");
};

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const { data: portfolioRaw = FALLBACK_FEATURED_WORKS } = trpc.portfolio.list.useQuery({
    category: selectedCategory || undefined,
  }, {
    placeholderData: FALLBACK_FEATURED_WORKS,
    retry: false
  });

  // Client-side filtering to ensure strict categorization for fallback data
  const portfolio = portfolioRaw.filter(item => 
    !selectedCategory || item.category === selectedCategory
  );

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

      {/* Videos Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Featured Videos</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Watch our latest creative projects, behind-the-scenes content, and client success stories
            </p>
          </div>
          
          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_VIDEOS.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                description={video.description}
                reelUrl={video.reelUrl}
                likes={video.likes}
                shares={video.shares}
                comments={video.comments}
              />
            ))}
          </div>

          {/* Video CTA */}
          <div className="mt-16 text-center">
            <p className="text-slate-600 mb-6 text-lg">
              Want to see more of our work? Follow us on Facebook for daily updates!
            </p>
            <a
              href="https://www.facebook.com/KretivMayConcepts/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Follow KretivMay on Facebook
            </a>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {portfolio && portfolio.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.flatMap((item: any) => {
                const items = [{ id: `${item.id}-1`, title: item.title, imageUrl: item.imageUrl, category: item.category, description: item.description }];
                if (item.imageUrl2) {
                  items.push({ id: `${item.id}-2`, title: item.title, imageUrl: item.imageUrl2, category: item.category, description: item.description });
                }
                return items;
              }).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                    {isVideo(item.imageUrl) ? (
                      <>
                        <video
                          src={item.imageUrl}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => e.currentTarget.pause()}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                          <Play className="w-16 h-16 text-white fill-white drop-shadow-lg" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-xl drop-shadow-md">{item.title}</h3>
                      <p className="text-sm text-blue-200 capitalize tracking-wide drop-shadow-sm">{item.category}</p>
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
