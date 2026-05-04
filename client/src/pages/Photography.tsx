import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, X, Play, ArrowRight, Heart, MessageCircle, Share2 } from "lucide-react";
import { Link } from "wouter";

export default function Photography() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { data: portfolioRaw, isLoading } = trpc.portfolio.list.useQuery({
    category: "photography",
  });

  // Client-side filtering to ensure strict categorization
  const dbPortfolio = portfolioRaw?.filter(item => item.category === "photography") || [];

  // New Gallery Items from User Facebook Links
  const newGalleryItems = [
    {
      id: "fb-1",
      type: "image",
      title: "Traditional Wedding Excellence",
      category: "Wedding",
      imageUrl: "https://www.facebook.com/100071981381057/posts/959961003565294/",
      description: "KretivMay Photography updated their cover photo. Capturing the vibrant colors and deep traditions.",
      isExternal: true
    },
    {
      id: "fb-2",
      type: "image",
      title: "Nuru & Sanaa Affairs 2026",
      category: "Wedding",
      imageUrl: "https://www.facebook.com/100071981381057/posts/986688213740549/",
      description: "N U R U ❤️ S A N A A F F A I R S 2 0 2 6. Stunning bridal styling and joyful moments.",
      isExternal: true
    },
    {
      id: "fb-3",
      type: "image",
      title: "Mrs. Nuru & Hasana",
      category: "Wedding",
      imageUrl: "https://www.facebook.com/100071981381057/posts/976125518130152/",
      description: "M R S. N U R U ❤️ H A S A N A. Beautiful wedding ceremony coverage.",
      isExternal: true
    },
    {
      id: "fb-4",
      type: "image",
      title: "Eid Photoshoot Promo",
      category: "Promo",
      imageUrl: "https://www.facebook.com/100071981381057/posts/946413167768054/",
      description: "Create stunning memories with our Eid Photoshoot Promo.",
      isExternal: true
    },
    {
      id: "fb-5",
      type: "video",
      title: "How Our Beautiful Bride Met Her Man",
      category: "Wedding Video",
      imageUrl: "https://www.facebook.com/reel/1520385895928002/",
      description: "HOW OUR BEAUTIFUL BRIDE MET HER MAN. A heartwarming story of love.",
      isExternal: true
    },
    {
      id: "fb-6",
      type: "image",
      title: "The Groom & his Groomsmen",
      category: "Wedding",
      imageUrl: "https://www.facebook.com/100071981381057/posts/899810249095013/",
      description: "The Groom & his Groomsmen. Elegant wedding party shots.",
      isExternal: true
    },
    {
      id: "fb-7",
      type: "image",
      title: "Stunning Bride Zulaiha",
      category: "Wedding",
      imageUrl: "https://www.facebook.com/100071981381057/posts/867884892287549/",
      description: "Stunning Bride ~ ZULAIHA. Capturing bridal elegance.",
      isExternal: true
    },
    {
      id: "fb-8",
      type: "video",
      title: "Wedding Highlights",
      category: "Wedding Video",
      imageUrl: "https://www.facebook.com/reel/1277998823589973/",
      description: "Special wedding moments captured in motion.",
      isExternal: true
    }
  ];

  // Combine DB items with new items
  const allItems = [
    ...newGalleryItems,
    ...dbPortfolio.map(item => ({
      id: item.id.toString(),
      type: "image",
      title: item.title,
      category: "Photography",
      imageUrl: item.imageUrl,
      description: item.description,
      isExternal: false
    }))
  ];

  const eventTypes = [
    { name: "Weddings", icon: "💍" },
    { name: "Naming Ceremonies", icon: "👶" },
    { name: "Birthdays", icon: "🎂" },
    { name: "Studio Shoots", icon: "📸" },
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1600&q=80" 
            alt="Photography Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-6xl font-black mb-6 tracking-tighter">PHOTOGRAPHY</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-medium">
            Professional wedding, birthday, and naming ceremony coverage. 
            Capturing your most precious moments with artistic excellence.
          </p>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-20 border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {eventTypes.map((event, index) => (
              <div
                key={index}
                className="group bg-slate-50 p-8 rounded-2xl transition-all hover:bg-blue-600 hover:text-white text-center border border-slate-100"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{event.icon}</div>
                <h3 className="text-lg font-bold uppercase tracking-wider">{event.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">PICTURE GALLERY</h2>
              <p className="text-slate-500 font-medium">Explore our latest wedding shoots and event coverage</p>
            </div>
            <div className="flex gap-4">
              <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">ALL WORKS</span>
              <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-full text-sm font-bold">WEDDINGS</span>
              <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-full text-sm font-bold">EVENTS</span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {allItems.map((item) => (
                <div
                  key={item.id}
                  className="break-inside-avoid group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white"
                >
                  <div 
                    className="relative cursor-pointer overflow-hidden"
                    onClick={() => setSelectedItem(item)}
                  >
                    {item.isExternal ? (
                      <div className="aspect-[4/5] w-full bg-slate-900 flex items-center justify-center text-white p-4 text-center">
                        <div>
                          {item.type === 'video' ? <Play className="w-12 h-12 mx-auto mb-2 opacity-50" /> : <X className="w-12 h-12 mx-auto mb-2 opacity-50 rotate-45" />}
                          <p className="text-xs opacity-70">View on Facebook</p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-auto group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                       <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                         <ArrowRight className="w-6 h-6 text-white" />
                       </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-slate-100">
                    <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2 block">{item.category}</span>
                    <h3 className="font-bold text-slate-900 mb-2 leading-tight">{item.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                      <button className="flex items-center gap-1 text-slate-600 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="text-xs font-bold">Like</span>
                      </button>
                      <button className="flex items-center gap-1 text-slate-600 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-xs font-bold">Comment</span>
                      </button>
                      <button className="flex items-center gap-1 text-slate-600 hover:text-green-500 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="text-xs font-bold">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-20 text-center">
            <p className="text-slate-400 font-medium italic">More stunning captures coming soon...</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-black mb-6 tracking-tight">READY TO CAPTURE YOUR MOMENTS?</h2>
          <p className="text-xl mb-12 text-slate-400 max-w-2xl mx-auto">
            Whether it's a wedding, birthday, or naming ceremony, we bring professional excellence to every shoot.
          </p>
          <Link href="/contact">
            <a className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black transition-all hover:scale-105 inline-flex items-center gap-3 shadow-2xl shadow-blue-600/20">
              BOOK A SESSION NOW
              <ArrowRight className="w-6 h-6" />
            </a>
          </Link>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-6xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors flex items-center gap-2 font-bold"
            >
              CLOSE <X className="w-8 h-8" />
            </button>
            
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-full">
              <div className="md:w-2/3 bg-black flex items-center justify-center overflow-hidden">
                {selectedItem.isExternal ? (
                  <div className="w-full h-full aspect-video flex flex-col items-center justify-center p-12 text-center">
                    {selectedItem.type === 'video' ? <Play className="w-20 h-20 text-blue-600 mb-6" /> : <X className="w-20 h-20 text-blue-600 mb-6 rotate-45" />}
                    <h3 className="text-white text-2xl font-bold mb-4">View on Facebook</h3>
                    <a 
                      href={selectedItem.imageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
                    >
                      Open Post
                    </a>
                  </div>
                ) : (
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div className="md:w-1/3 p-8 md:p-12 flex flex-col justify-center bg-white">
                <span className="text-blue-600 text-sm font-black uppercase tracking-widest mb-4">{selectedItem.category}</span>
                <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight">{selectedItem.title}</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">{selectedItem.description}</p>
                <div className="flex items-center gap-6 pt-6 border-t border-slate-100">
                  <button className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors">
                    <Heart className="w-6 h-6" />
                    <span className="font-bold">Like</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-600 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-bold">Comment</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-600 hover:text-green-500 transition-colors">
                    <Share2 className="w-6 h-6" />
                    <span className="font-bold">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
