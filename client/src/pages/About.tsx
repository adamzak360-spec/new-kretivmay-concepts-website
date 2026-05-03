import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function About() {
  const { data: pageData } = trpc.pages.get.useQuery({ page: "about", section: "content" });
  const about = pageData?.[0]?.content as any || {
    heroTitle: "About KretivMay Concepts",
    heroSubtitle: "Transforming Ideas into Visual Excellence",
    storyTitle: "Our Story",
    storyContent: "KretivMay Concepts was founded with a vision to bring creative excellence to businesses in Tamale and beyond. What started as a small design studio has grown into a full-service creative agency specializing in graphic design, printing, branding, and digital marketing.\n\nWe believe that great design is more than just aesthetics—it's about creating meaningful connections between brands and their audiences. Our team of talented designers and creatives work tirelessly to deliver solutions that not only look beautiful but also drive results.",
    mission: "To empower businesses through innovative and strategic creative solutions that elevate their brand presence, engage their audience, and drive sustainable growth in the digital and print landscape.",
    vision: "To be the most trusted and innovative creative agency in Ghana, recognized for delivering exceptional design solutions that transform businesses and inspire audiences across all platforms.",
    reasons: [
      { title: "Creative Excellence", description: "Our team combines artistic vision with strategic thinking to create designs that stand out and deliver results." },
      { title: "Comprehensive Services", description: "From graphic design to printing and digital marketing, we offer a full suite of creative services under one roof." },
      { title: "Client-Centric Approach", description: "We take time to understand your business, goals, and audience to create solutions tailored to your needs." }
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
