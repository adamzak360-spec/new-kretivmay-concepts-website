import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, ThumbsUp, Share2, MessageCircle, Play } from "lucide-react";
import { FALLBACK_SERVICES, FALLBACK_FEATURED_WORKS, FALLBACK_TESTIMONIALS } from "@/lib/fallbacks";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  
  // CMS Content
  const { data: heroData } = trpc.pages.get.useQuery({ page: "home", section: "hero" });
  const hero = heroData?.[0]?.content as any || {
    title: "Creative Design & Printing Solutions",
    subtitle: "Elevate Your Brand with Professional Design, Printing, and Marketing Services",
    ctaText: "View Portfolio",
    ctaLink: "/portfolio",
    secondaryCtaText: "Contact Us",
    secondaryCtaLink: "/contact",
    images: [
      { url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop" },
      { url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop" },
      { url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop" }
    ]
  };

  // Combine video and images for the slideshow
  const slideshowItems = [
    { type: 'video', url: '/assets/videos/hero-video.mp4' },
    ...hero.images.map((img: any) => ({ type: 'image', url: img.url }))
  ];

  // Use placeholderData to show fallbacks immediately
  const { data: services = FALLBACK_SERVICES } = trpc.services.list.useQuery(undefined, {
    placeholderData: FALLBACK_SERVICES,
    retry: false
  });
  
  const { data: featured = FALLBACK_FEATURED_WORKS } = trpc.portfolio.featured.useQuery(undefined, {
    placeholderData: FALLBACK_FEATURED_WORKS,
    retry: false
  });

  const [likes, setLikes] = useState<Record<string, number>>({});
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});

  const handleLike = (id: string) => {
    setIsLiked(prev => ({ ...prev, [id]: !prev[id] }));
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || Math.floor(Math.random() * 200) + 50) + (isLiked[id] ? -1 : 1)
    }));
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };
  
  const { data: testimonials = FALLBACK_TESTIMONIALS } = trpc.testimonials.featured.useQuery(undefined, {
    placeholderData: FALLBACK_TESTIMONIALS,
    retry: false
  });

  useEffect(() => {
    const currentItem = slideshowItems[currentSlide];
    
    if (currentItem.type === 'video') {
      setIsVideoPlaying(true);
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
              <>
                <video
                  ref={videoRef}
                  src={item.url}
                  autoPlay
                  muted
                  playsInline
                  onEnded={handleVideoEnd}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </>
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
            {/* Gradient Overlay - More sophisticated */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
            {/* Additional subtle overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          </div>
        ))}

        {/* Content Container */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          {/* Animated Title */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight animate-fade-in tracking-tight">
            {hero.title}
          </h1>
          
          {/* Divider Line */}
          <div className="flex justify-center mb-8">
            <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          </div>
          
          {/* Subtitle */}
          <p className="text-lg md:text-2xl mb-12 text-slate-100 max-w-3xl mx-auto leading-relaxed font-light">
            {hero.subtitle}
          </p>
          
          {/* CTA Buttons */}
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

        {/* Slide Indicators - Enhanced */}
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">Our Services</h2>
            <div className="flex justify-center mb-6">
              <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
            </div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive creative solutions tailored to your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.slice(0, 6).map((service) => (
              <Link key={service.id} href={`/services/${service.slug}`}>
                <a className="group h-full">
                  <div className="h-full bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-300 transform hover:-translate-y-2">
                    <div className="mb-6 overflow-hidden rounded-xl aspect-video bg-gradient-to-br from-slate-100 to-slate-200">
                      {service.bannerImageUrl ? (
                        <img 
                          src={service.bannerImageUrl} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl group-hover:scale-125 transition-transform duration-300">
                          {service.icon || "🎨"}
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                    <p className="text-slate-600 text-base leading-relaxed line-clamp-3 mb-6">{service.description}</p>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                      Learn More
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/services">
              <a className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform">
                View All Services
                <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">Featured Works</h2>
            <div className="flex justify-center mb-6">
              <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
            </div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Explore our latest projects and creative solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {featured.map((item: any) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white border border-slate-100 flex flex-col transform hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden aspect-video flex items-center justify-center p-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                    {item.category}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="font-bold text-2xl text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-slate-600 text-base line-clamp-2 mb-8 flex-1 leading-relaxed">{item.description}</p>
                  
                  {/* Social Interactions */}
                  <div className="pt-6 flex items-center justify-between border-t border-slate-200">
                    <div className="flex gap-8">
                      <button 
                        onClick={() => handleLike(item.id.toString())}
                        className={`flex items-center gap-2 transition-all hover:scale-110 font-semibold ${isLiked[item.id.toString()] ? "text-red-500" : "text-slate-500 hover:text-red-500"}`}
                      >
                        <ThumbsUp className={`w-5 h-5 ${isLiked[item.id.toString()] ? "fill-current" : ""}`} />
                        <span className="text-sm">{likes[item.id.toString()] || Math.floor(Math.random() * 200) + 50}</span>
                      </button>
                      <Link href="/portfolio">
                        <button className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-all hover:scale-110 font-semibold">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm">{Math.floor(Math.random() * 30) + 5}</span>
                        </button>
                      </Link>
                    </div>
                    <button 
                      onClick={() => handleShare(item.title)}
                      className="flex items-center gap-2 text-slate-500 hover:text-green-500 transition-all hover:scale-110 font-semibold"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/portfolio">
              <a className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform">
                View Full Portfolio
                <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">What Our Clients Say</h2>
              <div className="flex justify-center mb-6">
                <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
              </div>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Trusted by businesses across Ghana
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-2">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={testimonial.imageUrl}
                      alt={testimonial.clientName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{testimonial.clientName}</h4>
                      <p className="text-sm text-slate-500">{testimonial.clientCompany}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 italic leading-relaxed mb-6">"{testimonial.content}"</p>
                  <div className="flex text-yellow-400 gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
