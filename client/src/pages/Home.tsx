import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, ThumbsUp, Share2, MessageCircle, X, Maximize2, Send, ShoppingBag, Zap, CheckCircle, Star } from "lucide-react";
import { SHOP_CATEGORIES, FALLBACK_PRODUCTS, FALLBACK_TESTIMONIALS } from "@/lib/fallbacks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  
  // Lightbox State
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // CMS Content
  const { data: heroData } = trpc.pages.get.useQuery({ page: "home", section: "hero" });
  const hero = heroData?.[0]?.content as any || {
    title: "Everything You Need, All in One Place.",
    subtitle: "Shop quality groceries, household essentials, fashion, electronics, beverages, and everyday products from Blue Water Shopping Village in Malshegu, Tamale.",
    ctaText: "Shop Now",
    ctaLink: "/services",
    secondaryCtaText: "Browse Categories",
    secondaryCtaLink: "/categories",
    images: [
      { url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=600&fit=crop" },
      { url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop" },
      { url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=600&fit=crop" }
    ]
  };

  // Combine video and images for the slideshow
  const slideshowItems = [
    { type: 'video', url: '/assets/videos/hero-video.mp4' },
    { type: 'image', url: '/assets/hero/hero-image-new.jpg' },
    { type: 'video', url: '/assets/hero/hero-video-2.mp4' },
    ...hero.images.map((img: any) => ({ type: 'image', url: img.url }))
  ];

  const { data: testimonials = FALLBACK_TESTIMONIALS } = trpc.testimonials.featured.useQuery(undefined, {
    placeholderData: FALLBACK_TESTIMONIALS,
    retry: false
  });

  useEffect(() => {
    const currentItem = slideshowItems[currentSlide];
    
    if (currentItem.type === 'video') {
      setIsVideoPlaying(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          console.log('Video autoplay was prevented');
        });
      }
      return;
    }

    setIsVideoPlaying(false);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowItems.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide, slideshowItems.length]);

  const handleVideoEnd = () => {
    setCurrentSlide((prev) => (prev + 1) % slideshowItems.length);
  };

  return (
    <div className="w-full">
      {/* Hero Section with Slideshow */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden group">
        {slideshowItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            {item.type === 'video' ? (
              <video
                ref={videoRef}
                src={item.url}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                onLoadedMetadata={() => {
                  if (videoRef.current && index === currentSlide) {
                    videoRef.current.play().catch(() => {
                      console.log('Video autoplay was prevented');
                    });
                  }
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 transition-transform duration-1000"
                style={{
                  backgroundImage: `url(${item.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          </div>
        ))}

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight animate-fade-in tracking-tight">
            {hero.title}
          </h1>
          <div className="flex justify-center mb-8">
            <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          </div>
          <p className="text-lg md:text-2xl mb-12 text-slate-100 max-w-3xl mx-auto leading-relaxed font-light">
            {hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href={hero.ctaLink}>
              <a className="group/btn relative px-10 py-4 rounded-lg font-semibold transition-all duration-300 overflow-hidden inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-2xl hover:scale-105 transform">
                <span className="relative z-10 flex items-center gap-2">
                  {hero.ctaText}
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              </a>
            </Link>
            <Link href={hero.secondaryCtaLink}>
              <a className="group/btn px-10 py-4 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:border-white/60 text-white hover:bg-white/20 shadow-lg hover:shadow-xl hover:scale-105 transform">
                {hero.secondaryCtaText}
              </a>
            </Link>
          </div>
        </div>

        {slideshowItems.length > 1 && (
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
            {slideshowItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-500 rounded-full ${
                  index === currentSlide
                    ? "bg-white w-10 h-2"
                    : "bg-white/40 w-2 h-2 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Categories Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none mb-4 px-4 py-1">
                Browse by Category
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Popular Categories</h2>
              <p className="text-xl text-slate-500">Explore our wide range of products across various departments.</p>
            </div>
            <Link href="/categories">
              <a className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all group">
                View All Categories
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {SHOP_CATEGORIES.slice(0, 8).map((category) => (
              <Link key={category.slug} href={`/services?category=${category.slug}`}>
                <a className="group relative bg-slate-50 rounded-3xl p-8 transition-all duration-500 hover:bg-blue-600 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">{category.icon}</div>
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-white transition-colors mb-2">{category.name}</h3>
                    <p className="text-slate-500 group-hover:text-blue-100 transition-colors text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  <div className="absolute -bottom-6 -right-6 text-slate-100 group-hover:text-blue-500/20 transition-colors duration-500">
                    <ShoppingBag className="w-32 h-32" />
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <Badge className="bg-blue-600 text-white hover:bg-blue-700 border-none mb-4 px-4 py-1">
                Featured Items
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">This Week's Highlights</h2>
              <p className="text-xl text-slate-500">Hand-picked quality products at the best prices in Tamale.</p>
            </div>
            <Link href="/services">
              <a className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:scale-105">
                Go to Shop
                <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FALLBACK_PRODUCTS.slice(0, 8).map((product) => (
              <Link key={product.id} href={`/shop/${product.slug}`}>
                <a className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col h-full hover:-translate-y-2">
                  <div className="aspect-square relative overflow-hidden bg-slate-100">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-blue-600 hover:bg-white border-none shadow-sm backdrop-blur-sm">
                        {SHOP_CATEGORIES.find(c => c.slug === product.category)?.name}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-full px-6">
                        View Details
                      </Button>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                      <span className="text-2xl font-black text-blue-600">{product.price}</span>
                      <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                        <CheckCircle className="w-3 h-3" />
                        In Stock
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Shop With Us Section */}
      <section className="py-24 bg-blue-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">The Blue Water Experience</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">Why we are Tamale's preferred shopping destination.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Zap className="w-10 h-10" />, title: "Quality Guaranteed", desc: "We source only the best products from trusted suppliers to ensure you get value for your money." },
              { icon: <ShoppingBag className="w-10 h-10" />, title: "Wide Variety", desc: "From groceries to electronics, find everything you need in one convenient location." },
              { icon: <CheckCircle className="w-10 h-10" />, title: "Excellent Service", desc: "Our friendly staff is always ready to assist you with a smile and professional care." }
            ].map((feature, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="bg-white text-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-blue-100 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none mb-4 px-4 py-1">
              Customer Love
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">What Our Shoppers Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial: any) => (
              <div key={testimonial.id} className="bg-slate-50 p-10 rounded-3xl relative">
                <div className="absolute -top-4 -left-4 text-blue-600/10">
                  <MessageCircle className="w-24 h-24 fill-current" />
                </div>
                <div className="relative z-10">
                  <div className="flex gap-1 text-yellow-400 mb-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-lg italic mb-8 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <img src={testimonial.imageUrl} alt={testimonial.clientName} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
                    <div>
                      <h4 className="font-bold text-slate-900">{testimonial.clientName}</h4>
                      <p className="text-slate-500 text-sm">{testimonial.clientCompany}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to start shopping?</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Visit us today at Malshegu, Opposite Star Oil Filling Station, Tamale, or browse our products online.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/services">
              <a className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-900/20 hover:scale-105">
                Browse Shop
              </a>
            </Link>
            <Link href="/contact">
              <a className="bg-white hover:bg-slate-100 text-slate-900 px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105">
                Contact Us
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
          {selectedItem && (
            <div className="relative aspect-video flex items-center justify-center">
              <img src={selectedItem.imageUrl} alt={selectedItem.title} className="max-w-full max-h-full object-contain" />
              <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
