import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, X, Play, ArrowRight, Heart, MessageCircle, Share2 } from "lucide-react";
import { Link } from "wouter";

const isVideo = (url: string) => {
  return url.includes(".mp4") || url.includes(".webm") || url.includes(".mov") || url.includes("facebook.com/reel");
};

export default function Photography() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { data: portfolioRaw, isLoading } = trpc.portfolio.list.useQuery({
    category: undefined, // Fetch all to include photography and video
  });

  // Client-side filtering to ensure strict categorization
  const dbPortfolio = portfolioRaw?.filter(item => item.category === "photography" || item.category === "video") || [];

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
      type: "image",
      title: "Traditional Elegance",
      category: "Wedding",
      imageUrl: "https://www.facebook.com/100071981381057/posts/826183773124328/",
      description: "Beautiful traditional wedding photography capturing every detail.",
      isExternal: true
    },
    {
      id: "fb-9",
      type: "image",
      title: "Wedding Joy",
      category: "Wedding",
      imageUrl: "https://www.facebook.com/100071981381057/posts/823028893439816/",
      description: "Celebrating love and happiness in every frame.",
      isExternal: true
    },
    {
      id: "fb-10",
      type: "image",
      title: "Traditional Ceremony",
      category: "Wedding",
      imageUrl: "https://www.facebook.com/100071981381057/posts/822666040142768/",
      description: "Professional coverage of traditional wedding ceremonies.",
      isExternal: true
    },
    {
      id: "fb-11",
      type: "image",
      title: "Bridal Portraits",
      category: "Wedding",
      imageUrl: "https://www.facebook.com/100071981381057/posts/817224430686929/",
      description: "Stunning bridal portraits that last a lifetime.",
      isExternal: true
    },
    {
      id: "fb-12",
      type: "image",
      title: "Event Highlights",
      category: "Event",
      imageUrl: "https://www.facebook.com/100071981381057/posts/808036021605770/",
      description: "Capturing the best moments of your special events.",
      isExternal: true
    },
    {
      id: "fb-13",
      type: "image",
      title: "Wedding Celebration",
      category: "Wedding",
      imageUrl: "https://www.facebook.com/100071981381057/posts/807278801681492/",
      description: "Joyful wedding celebrations captured with professional excellence.",
      isExternal: true
    },
    {
      id: "fb-14",
      type: "video",
      title: "Wedding Highlights Reel",
      category: "Wedding Video",
      imageUrl: "https://www.facebook.com/reel/1277998823589973/",
      description: "A beautiful reel of wedding highlights and special moments.",
      isExternal: true
    },
    {
      id: "fb-15",
      type: "image",
      title: "Special Moments",
      category: "Event",
      imageUrl: "https://www.facebook.com/100071981381057/posts/799864979089541/",
      description: "Every special moment deserves to be captured perfectly.",
      isExternal: true
    },
    {
      id: "fb-16",
      type: "image",
      title: "Traditional Elegance",
      category: "Wedding",
      imageUrl: "https://www.facebook.com/100071981381057/posts/778169094592463/",
      description: "Capturing the elegance of traditional wedding ceremonies.",
      isExternal: true
    }
  ];

  // Combine DB items with new items
  const allItems = [
    ...newGalleryItems,
    ...dbPortfolio.map(item => ({
      id: item.id.toString(),
      type: isVideo(item.imageUrl) ? "video" : "image",
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
                        <div className="relative z-10">
                          {item.type === 'video' ? <Play className="w-16 h-16 mx-auto mb-4 text-blue-400 fill-blue-400" /> : <ArrowRight className="w-16 h-16 mx-auto mb-4 text-blue-400" />}
                          <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                          <p className="text-xs opacity-70 uppercase tracking-widest">View on Facebook</p>
                        </div>
                        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      </div>
                    ) : (
                      <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                        {item.type === 'video' ? (
                          <>
                            <video
                              src={item.imageUrl}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onMouseEnter={(e) => e.currentTarget.play()}
                              onMouseLeave={(e) => e.currentTarget.pause()}
                              muted
                              loop
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
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full mb-3 uppercase tracking-widest">
                          {item.category}
                        </span>
                        <h3 className="text-white font-black text-2xl leading-tight mb-2">{item.title}</h3>
                        <div className="flex items-center gap-4 text-white/60 text-sm">
                          <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> 24</span>
                          <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> 12</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-black mb-6 tracking-tighter">READY TO BOOK?</h2>
          <p className="text-xl mb-10 text-slate-400 max-w-2xl mx-auto">
            Let's capture your special moments with professional excellence and artistic flair.
          </p>
          <Link href="/contact">
            <a className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-black transition-all inline-flex items-center gap-3 uppercase tracking-widest text-sm">
              Book a Session
              <ArrowRight className="w-5 h-5" />
            </a>
          </Link>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-6xl w-full bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 text-slate-900 hover:text-blue-600 transition-colors z-10 bg-white/80 backdrop-blur p-2 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="md:w-2/3 bg-slate-100 flex items-center justify-center overflow-hidden">
              {selectedItem.isExternal ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20">
                    {selectedItem.type === 'video' ? <Play className="w-10 h-10 text-white fill-white" /> : <Share2 className="w-10 h-10 text-white" />}
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{selectedItem.title}</h3>
                  <p className="text-slate-500 mb-8 max-w-md">{selectedItem.description}</p>
                  <a 
                    href={selectedItem.imageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-3"
                  >
                    VIEW ON FACEBOOK
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              ) : (
                selectedItem.type === 'video' ? (
                  <video
                    src={selectedItem.imageUrl}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                  />
                ) : (
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full h-full object-contain"
                  />
                )
              )}
            </div>
            
            <div className="md:w-1/3 p-10 flex flex-col justify-between bg-white">
              <div>
                <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 text-xs font-black rounded-full mb-6 uppercase tracking-widest">
                  {selectedItem.category}
                </span>
                <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter leading-none">{selectedItem.title}</h2>
                <p className="text-slate-500 leading-relaxed font-medium mb-8">
                  {selectedItem.description || "Professional photography coverage by KretivMay Concepts. Capturing every detail with precision and care."}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Heart className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Likes</p>
                      <p className="text-slate-900 font-black">1,240</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <MessageCircle className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Comments</p>
                      <p className="text-slate-900 font-black">84</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedItem(null)}
                className="w-full py-4 border-2 border-slate-100 hover:border-blue-600 hover:text-blue-600 text-slate-400 font-bold rounded-2xl transition-all uppercase tracking-widest text-xs mt-8"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
