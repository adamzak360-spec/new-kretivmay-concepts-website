import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, ArrowRight } from "lucide-react";

export default function Services() {
  const { data: services, isLoading } = trpc.services.list.useQuery();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-blue-100">
            Comprehensive Creative Solutions for Your Brand
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {services?.map((service) => (
                <div key={service.id} className="flex gap-8 items-start">
                  {service.bannerImageUrl && (
                    <img
                      src={service.bannerImageUrl}
                      alt={service.title}
                      className="w-48 h-48 object-cover rounded-lg flex-shrink-0"
                      loading="lazy"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                      {service.fullDescription || service.description}
                    </p>
                    <Link href={`/services/${service.slug}`}>
                      <a className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-2">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", description: "We learn about your brand, goals, and audience" },
              { step: "02", title: "Strategy", description: "We develop a comprehensive creative strategy" },
              { step: "03", title: "Creation", description: "Our team brings your vision to life" },
              { step: "04", title: "Delivery", description: "We deliver exceptional results on time" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Let's discuss how we can help your business
          </p>
          <Link href="/contact">
            <a className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
