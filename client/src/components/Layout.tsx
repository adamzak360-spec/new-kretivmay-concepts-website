import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Moon, Sun, ArrowUp, Facebook, Instagram, Twitter, LogIn, LayoutDashboard } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [location] = useLocation();
  // Theme toggle removed per user request
  const { user } = useAuth();

  // Fetch Site Settings from CMS
  const { data: dbSettings } = trpc.settings.get.useQuery("site_config");
  const settings = dbSettings ? JSON.parse(dbSettings) : {
    siteName: "KretivMay",
    phone: "+233 543 380 193",
    email: "info@kretivmay.com",
    address: "Shishegu Highways, Opp. EV Fuel Station, Tamale",
    facebook: "https://www.facebook.com/KretivMayConcepts/",
    instagram: "https://www.instagram.com/kretivmay_concepts/",
    twitter: "https://www.tiktok.com/@kretivmayphotography",
    whatsapp: "233543380193",
    footerTagline: "Expert in Design, General Print, Branding & Social Media Marketing"
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/photography", label: "Photography" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 overflow-hidden rounded-lg transition-transform group-hover:scale-105">
                <img 
                  src="/assets/logo_blue.png" 
                  alt="KretivMay Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 bg-clip-text text-transparent leading-none">
                  KRETIVMAY
                </span>
                <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase leading-none mt-1">
                  Concepts & Photo
                </span>
              </div>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`text-sm font-semibold transition-all hover:scale-105 ${
                    location === link.href
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-slate-600 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">

            {/* Admin/Login Link */}
            <div className="hidden md:block">
              <Link href="/admin/dashboard">
                <a className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-full transition-all hover:scale-105">
                  <LogIn className="w-4 h-4" />
                  Admin
                </a>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border bg-background animate-in slide-in-from-top duration-300">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className={`text-base font-bold transition-colors block px-4 py-2 rounded-lg ${
                      location === link.href
                        ? "bg-blue-50 text-blue-600"
                        : "text-foreground hover:bg-accent"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
              
              {/* Mobile Admin/Login Link */}
              <div className="pt-4 border-t border-border">
                <Link href="/admin/dashboard">
                  <a 
                    className="flex items-center gap-2 text-base font-bold text-blue-600 px-4 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    Admin Login
                  </a>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-20 border-t-4 border-blue-600">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 overflow-hidden rounded-lg">
                  <img 
                    src="/assets/logo_white.png" 
                    alt="KretivMay Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-2xl font-black tracking-tighter">KRETIVMAY</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {settings.footerTagline}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-blue-400">Navigation</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                {navLinks.slice(0, 5).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <a className="hover:text-blue-400 transition-colors flex items-center gap-2">
                        <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                        {link.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-blue-400">Our Expertise</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                  Graphic Design
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                  Large Format Printing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                  Branding & Packaging
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                  Social Media Marketing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                  Photography Services
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-blue-400">Get in Touch</h4>
              <p className="text-sm text-slate-300 mb-3 leading-relaxed">{settings.address}</p>
              <div className="space-y-3">
                <a href={`tel:${settings.phone}`} className="text-sm text-slate-300 hover:text-blue-400 transition-colors block font-medium">
                  {settings.phone}
                </a>
                <a href={`mailto:${settings.email}`} className="text-sm text-slate-300 hover:text-blue-400 transition-colors block font-medium">
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-500 font-medium">
              &copy; {new Date().getFullYear()} <span className="text-blue-500">KRETIVMAY CONCEPTS</span>. All rights reserved.
            </p>
            <div className="flex gap-6">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-all hover:scale-110">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition-all hover:scale-110">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.twitter && (
                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-all hover:scale-110">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button - Realistic Design */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3) translateY(20px); }
          50% { opacity: 1; }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .whatsapp-button {
          animation: float 3s ease-in-out infinite;
        }
        .whatsapp-button:hover {
          animation: none;
        }
        .whatsapp-pulse {
          animation: pulse-ring 2s infinite;
        }
        .whatsapp-tooltip {
          animation: bounce-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
      
      <a
        href={`https://wa.me/${settings.whatsapp?.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-30 group"
        aria-label="Contact via WhatsApp"
      >
        {/* Pulse Ring Background */}
        <div className="absolute inset-0 rounded-full whatsapp-pulse"></div>
        
        {/* Main Button */}
        <div className="whatsapp-button relative w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:from-green-500 hover:to-green-700 hover:scale-110 border-4 border-white">
          {/* WhatsApp Icon SVG */}
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.335 1.236-3.356 2.259-1.022 1.022-1.756 2.119-2.259 3.357-.573 1.42-.926 2.948-.949 4.255v.004c.024 1.307.376 2.834.949 4.255.503 1.238 1.236 2.335 2.259 3.356 1.022 1.022 2.119 1.756 3.357 2.259 1.42.573 2.948.926 4.255.949h.004c1.307-.024 2.834-.376 4.255-.949 1.238-.503 2.335-1.236 3.356-2.259 1.022-1.022 1.756-2.119 2.259-3.357.573-1.42.926-2.948.949-4.255v-.004c-.024-1.307-.376-2.834-.949-4.255-.503-1.238-1.236-2.335-2.259-3.356-1.022-1.022-2.119-1.756-3.357-2.259-1.42-.573-2.948-.926-4.255-.949zm0 0" />
          </svg>
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 bottom-1/2 translate-y-1/2 bg-white text-slate-900 text-sm font-bold px-4 py-2 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none whatsapp-tooltip border border-gray-200">
          <div className="flex items-center gap-2">
            <span>💬</span>
            <span>Chat with us on WhatsApp!</span>
          </div>
          {/* Tooltip Arrow */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      </a>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-28 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-2xl transition-all hover:scale-110 z-30"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
