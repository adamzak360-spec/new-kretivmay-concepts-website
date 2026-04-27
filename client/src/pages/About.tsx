import { Link } from "wouter";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function About() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">About KretivMay Concepts</h1>
          <p className="text-xl text-blue-100">
            Transforming Ideas into Visual Excellence
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-slate-700 mb-4 leading-relaxed">
                KretivMay Concepts was founded with a vision to bring creative excellence to businesses in Tamale and beyond. What started as a small design studio has grown into a full-service creative agency specializing in graphic design, printing, branding, and digital marketing.
              </p>
              <p className="text-slate-700 mb-4 leading-relaxed">
                We believe that great design is more than just aesthetics—it's about creating meaningful connections between brands and their audiences. Our team of talented designers and creatives work tirelessly to deliver solutions that not only look beautiful but also drive results.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Over the years, we've had the privilege of working with diverse clients across various industries, helping them establish strong visual identities and achieve their business goals.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg h-96" />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Our Mission</h3>
              <p className="text-slate-700 leading-relaxed">
                To empower businesses through innovative and strategic creative solutions that elevate their brand presence, engage their audience, and drive sustainable growth in the digital and print landscape.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Our Vision</h3>
              <p className="text-slate-700 leading-relaxed">
                To be the most trusted and innovative creative agency in Ghana, recognized for delivering exceptional design solutions that transform businesses and inspire audiences across all platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Creative Excellence",
                description: "Our team combines artistic vision with strategic thinking to create designs that stand out and deliver results.",
              },
              {
                title: "Comprehensive Services",
                description: "From graphic design to printing and digital marketing, we offer a full suite of creative services under one roof.",
              },
              {
                title: "Client-Centric Approach",
                description: "We take time to understand your business, goals, and audience to create solutions tailored to your needs.",
              },
              {
                title: "Quality & Attention to Detail",
                description: "Every project receives meticulous attention to detail, ensuring exceptional quality in every deliverable.",
              },
              {
                title: "Timely Delivery",
                description: "We respect your deadlines and ensure projects are completed on time without compromising quality.",
              },
              {
                title: "Competitive Pricing",
                description: "We offer affordable creative solutions without sacrificing quality, making professional design accessible to all.",
              },
            ].map((item, index) => (
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

      {/* Team Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Creative Lead", role: "Art Director" },
              { name: "Design Specialist", role: "Graphic Designer" },
              { name: "Marketing Expert", role: "Digital Strategist" },
              { name: "Production Manager", role: "Project Manager" },
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow overflow-hidden text-center">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-48" />
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-slate-600 text-sm">{member.role}</p>
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
          <p className="text-xl mb-8 text-blue-100">
            Ready to bring your vision to life?
          </p>
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
