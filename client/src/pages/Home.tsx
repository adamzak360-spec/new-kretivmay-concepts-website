import { useEffect, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: services } = trpc.services.list.useQuery();
  const { data: featured } = trpc.portfolio.featured.useQuery();
  const { data: testimonials } = trpc.testimonials.featured.useQuery();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const heroImages = [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop",
  ];

  return (
    <div className="w-full">
      {/* Hero Section with Slideshow */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
            Creative Design & Printing Solutions
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-200">
            Elevate Your Brand with Professional Design Services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/portfolio">
              <a className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
                View Portfolio
                <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
            <Link href="/contact">
              <a className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-3 rounded-lg font-semibold transition-colors">
                Contact Us
              </a>
            </Link>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
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
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.slice(0, 6).map((service) => (
              <Link key={service.id} href={`/services/${service.slug}`}>
                <a className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-4xl mb-4">{service.icon || "🎨"}</div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-slate-600 text-sm">{service.description}</p>
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
          <h2 className="text-4xl font-bold text-center mb-12">Featured Works</h2>
          {!featured ? (
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-slate-200">{item.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            <h2 className="text-4xl font-bold text-center mb-12">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center gap-4 mb-4">
                    {testimonial.imageUrl && (
                      <img
                        src={testimonial.imageUrl}
                        alt={testimonial.clientName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold">{testimonial.clientName}</h4>
                      <p className="text-sm text-slate-600">{testimonial.clientCompany}</p>
                    </div>
                  </div>
                  <p className="text-slate-700 mb-4">{testimonial.content}</p>
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
          <h2 className="text-4xl font-bold mb-4">Ready to Elevate Your Brand?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Let's create something amazing together
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
