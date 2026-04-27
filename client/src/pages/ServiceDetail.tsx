import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function ServiceDetail() {
  const [match, params] = useRoute("/services/:slug");
  const { data: service, isLoading } = trpc.services.bySlug.useQuery(params?.slug || "", {
    enabled: !!params?.slug,
  });
  const { data: portfolio } = trpc.portfolio.list.useQuery({
    category: "design",
  });

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <Link href="/services">
            <a className="text-blue-600 hover:text-blue-700">Back to Services</a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      {service.bannerImageUrl && (
        <section
          className="h-96 flex items-center justify-center relative"
          style={{
            backgroundImage: `url(${service.bannerImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-center text-white">
            <h1 className="text-5xl font-bold">{service.title}</h1>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">About This Service</h2>
            <p className="text-slate-700 leading-relaxed mb-8">
              {service.fullDescription || service.description}
            </p>

            <h3 className="text-2xl font-bold mb-6">What We Offer</h3>
            <ul className="space-y-3 mb-8">
              {[
                "Professional and creative solutions tailored to your needs",
                "High-quality deliverables that exceed expectations",
                "Timely project completion with attention to detail",
                "Ongoing support and revisions",
                "Competitive pricing without compromising quality",
              ].map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>

            {portfolio && portfolio.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Sample Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {portfolio.slice(0, 4).map((item) => (
                    <img
                      key={item.id}
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-lg"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-slate-700 mb-6">
                Let's discuss how we can help you with {service.title.toLowerCase()}.
              </p>
              <Link href="/contact">
                <a className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
                  Request a Quote
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
