import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function About() {
  const { data: pageData } = trpc.pages.get.useQuery({ page: "about", section: "content" });
  const about = pageData?.[0]?.content as any || {
    heroTitle: "About Blue Water Shopping Village",
    heroSubtitle: "Your Trusted Local Shopping Destination",
    storyTitle: "Our Story",
    storyContent: "Blue Water Shopping Village is a modern shopping destination located in Malshegu, Tamale, opposite Star Oil Filling Station. We are committed to providing the Tamale community with a comprehensive shopping experience, offering quality products ranging from groceries and household essentials to fashion, electronics, beverages, and beauty products.\n\nOur mission is to be the go-to shopping destination for families and businesses in the region, delivering excellent customer service, competitive prices, and a wide variety of products all in one convenient location.",
    mission: "To serve as the trusted shopping destination for the Tamale community by offering quality products, excellent customer service, and competitive prices in a modern, convenient shopping environment.",
    vision: "To be the most preferred shopping destination in Tamale, known for our diverse product selection, customer-centric approach, and commitment to community satisfaction.",
    reasons: [
      { title: "Quality Products", description: "We carefully select our products to ensure the highest quality standards for our customers." },
      { title: "Convenient Location", description: "Located in Malshegu, opposite Star Oil Filling Station, we are easily accessible to the entire Tamale community." },
      { title: "Excellent Service", description: "Our dedicated team is committed to providing friendly, professional service to every customer." }
    ]
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">{about.heroTitle}</h1>
          <p className="text-xl text-blue-100">{about.heroSubtitle}</p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">{about.storyTitle}</h2>
              <div className="text-slate-700 mb-4 leading-relaxed whitespace-pre-wrap">
                {about.storyContent}
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg h-96">
              <img src="/assets/about-image.jpg" alt="KretivMay Concepts" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Our Mission</h3>
              <p className="text-slate-700 leading-relaxed">{about.mission}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Our Vision</h3>
              <p className="text-slate-700 leading-relaxed">{about.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {about.reasons?.map((item: any, index: number) => (
              <div key={index} className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-xl mb-8 text-blue-100">Ready to bring your vision to life?</p>
          <Link href="/contact">
            <a className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
              Get In Touch
              <ArrowRight className="w-5 h-5" />
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
