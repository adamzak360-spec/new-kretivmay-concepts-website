import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, X } from "lucide-react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Photography() {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const { data: portfolio, isLoading } = trpc.portfolio.list.useQuery({
    category: "photography",
  });

  const eventTypes = [
    { name: "Weddings", icon: "💍" },
    { name: "Naming Ceremonies", icon: "👶" },
    { name: "Studio Shoots", icon: "📸" },
    { name: "Product Shoots", icon: "📦" },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Photography Services</h1>
          <p className="text-xl text-blue-100">
            Capturing Your Special Moments with Professional Excellence
          </p>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Photography Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {eventTypes.map((event, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-5xl mb-4">{event.icon}</div>
                <h3 className="text-xl font-semibold">{event.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Recent Works</h2>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Capture Your Moments?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Let's create beautiful memories together
          </p>
          <Link href="/contact">
            <a className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
              Book a Session
              <ArrowRight className="w-5 h-5" />
            </a>
          </Link>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
