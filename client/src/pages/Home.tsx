import { useEffect, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight } from "lucide-react";
import { FALLBACK_SERVICES, FALLBACK_FEATURED_WORKS, FALLBACK_TESTIMONIALS } from "@/lib/fallbacks";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
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

  // Use placeholderData to show fallbacks immediately
  const { data: services = FALLBACK_SERVICES } = trpc.services.list.useQuery(undefined, {
    placeholderData: FALLBACK_SERVICES,
    retry: false
  });
  
  const { data: featured = FALLBACK_FEATURED_WORKS } = trpc.portfolio.featured.useQuery(undefined, {
    placeholderData: FALLBACK_FEATURED_WORKS,
    retry: false
  });
  
  const { data: testimonials = FALLBACK_TESTIMONIALS } = trpc.testimonials.featured.useQuery(undefined, {
    placeholderData: FALLBACK_TESTIMONIALS,
    retry: false
  });

  useEffect(() => {
    if (!hero.images || hero.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % hero.images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [hero.images]);

  return (
    <div className="w-full">
      {/* Hero Section with Slideshow */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {hero.images?.map((image: any, index: number) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${image.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight">
            {hero.title}
          </h1>
          <p className="text-lg md:text-2xl mb-8 text-slate-200 max-w-2xl mx-auto">
            {hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={hero.ctaLink}>
              <a className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2">
                {hero.ctaText}
                <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
            <Link href={hero.secondaryCtaLink}>
              <a className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2">
                {hero.secondaryCtaText}
              </a>
            </Link>
          </div>
        </div>

        {/* Slide Indicators */}
        {hero.images?.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {hero.images.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive creative solutions tailored to your business needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.slice(0, 6).map((service) => (
              <Link key={service.id} href={`/services/${service.slug}`}>
                <a className="group h-full">
                  <div className="h-full bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-blue-300">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {service.icon || "🎨"}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-900">{service.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
                  </div>
                </a>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/services">
              <a className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
                View All Services
                <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore our latest projects and creative solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((item: any) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-slate-100"
              >
                {item.imageUrl2 ? (
                  <div className="flex h-64">
                    <img
                      src={item.imageUrl}
                      alt={`${item.title} - 1`}
                      className="w-1/2 h-full object-cover group-hover:scale-105 transition-transform duration-300 border-r border-white"
                      loading="lazy"
                    />
                    <img
                      src={item.imageUrl2}
                      alt={`${item.title} - 2`}
                      className="w-1/2 h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-slate-200">{item.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/portfolio">
              <a className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
                View Full Portfolio
                <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Trusted by businesses across Ghana
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    {testimonial.imageUrl && (
                      <img
                        src={testimonial.imageUrl}
                        alt={testimonial.clientName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-slate-900">{testimonial.clientName}</h4>
                      <p className="text-sm text-slate-600">{testimonial.clientCompany}</p>
                    </div>
                  </div>
                  <p className="text-slate-700 mb-4 leading-relaxed">{testimonial.content}</p>
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating || 0 }).map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Elevate Your Brand?</h2>
          <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Let's create something amazing together. Contact us today for a free consultation.
          </p>
          <Link href="/contact">
            <a className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
