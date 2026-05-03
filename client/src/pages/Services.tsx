import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { FALLBACK_SERVICES } from "@/lib/fallbacks";

export default function Services() {
  const { data: services = FALLBACK_SERVICES } = trpc.services.list.useQuery(undefined, {
    placeholderData: FALLBACK_SERVICES,
    retry: false
  });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Services</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
            Comprehensive Creative Solutions for Your Brand
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.map((service) => (
              <Link key={service.id} href={`/services/${service.slug}`}>
                <a className="group h-full">
                  <div className="h-full bg-white p-8 rounded-lg shadow hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-300">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {service.icon || "🎨"}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900">{service.title}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3">
                      {(service as any).fullDescription || service.description}
                    </p>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Detailed Service Offerings</h2>
          
          <div className="space-y-12">
            {/* Graphic Design */}
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-slate-900">Graphic Design</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Creative visual solutions for your brand identity and marketing materials.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Logo Design:</strong> Unique and memorable brand marks</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Marketing Materials:</strong> Professional flyers and posters</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Social Media Content:</strong> Engaging graphics for all platforms</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg h-64 overflow-hidden shadow-inner">
                  <img src="/assets/portfolio/flyer_1.webp" alt="Graphic Design" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Printing Solutions */}
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="rounded-lg h-64 overflow-hidden shadow-inner order-2 md:order-1">
                  <img src="/assets/portfolio/flyer_2.webp" alt="Printing Solutions" className="w-full h-full object-cover" />
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-3xl font-bold mb-4 text-slate-900">Printing Solutions</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    High-quality digital and offset printing for all your business needs.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Business Cards:</strong> Premium quality networking tools</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Brochures:</strong> Informative and well-designed layouts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Stationery:</strong> Letterheads, envelopes, and more</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Brand Identity */}
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-slate-900">Brand Identity</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Comprehensive branding packages including logos, business cards, and more.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Brand Strategy:</strong> Defining your brand's voice and mission</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Visual Identity:</strong> Consistent look across all touchpoints</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Brand Guidelines:</strong> Ensuring brand consistency</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg h-64 overflow-hidden shadow-inner">
                  <img src="/assets/portfolio/flyer_3.webp" alt="Brand Identity" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Large Format Printing */}
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="rounded-lg h-64 overflow-hidden shadow-inner order-2 md:order-1">
                  <img src="/assets/portfolio/flyer_4.webp" alt="Large Format Printing" className="w-full h-full object-cover" />
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-3xl font-bold mb-4 text-slate-900">Large Format Printing</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Professional large-scale printing for stickers, banners, and one-way vision graphics.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Stickers:</strong> Custom vinyl stickers for branding</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Banners:</strong> Eye-catching banners for events</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>One-Way Vision:</strong> See-through graphics for windows</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Social Media Marketing */}
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-slate-900">Social Media Marketing</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Boost your online presence with targeted marketing and product advertising.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Product Advertising:</strong> Showcase your products effectively</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Targeted Marketing:</strong> Reach the right audience</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Engagement:</strong> Build and maintain your brand image</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg h-64 overflow-hidden shadow-inner">
                  <img src="/assets/portfolio/flyer_5.webp" alt="Social Media Marketing" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Shirts & Caps Printing */}
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="rounded-lg h-64 overflow-hidden shadow-inner order-2 md:order-1">
                  <img src="/assets/services/shirts-caps.webp" alt="Shirts & Caps Printing" className="w-full h-full object-cover" />
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-3xl font-bold mb-4 text-slate-900">Shirts & Caps Printing</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Custom apparel printing with DTF, screen printing, and embroidery services.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>DTF Printing:</strong> Vibrant, detailed prints</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Screen Printing:</strong> Classic technique for bulk orders</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-slate-700"><strong>Embroidery:</strong> Premium embroidered logos</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
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
                <div className="text-5xl font-bold text-blue-600 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">{item.title}</h3>
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
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Let's discuss how we can help your business grow with our creative solutions
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
