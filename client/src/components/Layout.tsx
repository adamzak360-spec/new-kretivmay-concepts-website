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
    siteName: "Blue Water Shopping Village",
    phone: "+233 XXX XXX XXXX",
    email: "info@bluewatershoppingvillage.com",
    address: "Malshegu, Opposite Star Oil Filling Station, Tamale, Ghana",
    facebook: "https://www.facebook.com",
    instagram: "https://www.instagram.com",
    twitter: "https://www.twitter.com",
    whatsapp: "233XXXXXXXXX",
    footerTagline: "Your trusted local shopping destination for quality products and excellent service"
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
    { href: "/services", label: "Shop" },
    { href: "/portfolio", label: "Categories" },
    { href: "/about", label: "About" },
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
              <div className="relative w-12 h-12 overflow-hidden rounded-lg transition-transform group-hover:scale-105 bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">BW</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 bg-clip-text text-transparent leading-none">
                  BLUE WATER
                </span>
                <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase leading-none mt-1">
                  Shopping Village
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
                <div className="w-10 h-10 overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                  <span className="text-white font-bold">BW</span>
                </div>
                <h3 className="text-2xl font-black tracking-tighter">BLUE WATER</h3>
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
              &copy; {new Date().getFullYear()} <span className="text-blue-500">BLUE WATER SHOPPING VILLAGE</span>. All rights reserved.
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

      {/* Floating WhatsApp Button - Realistic Design with Phone Icon */}
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
        <div className="whatsapp-button relative w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:from-[#20BA5A] hover:to-[#0F7E6F] hover:scale-110 border-4 border-white">
          {/* Official WhatsApp Icon - Phone in Speech Bubble */}
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Speech Bubble Background */}
            <path d="M20.52 3.98C18.44 1.9 15.54 0.9 12.6 0.9c-5.97 0-10.82 4.85-10.82 10.82 0 1.9.5 3.77 1.44 5.41L2.05 23.1l5.84-1.53c1.58.86 3.38 1.32 5.21 1.32h.01c5.97 0 10.82-4.85 10.82-10.82 0-2.9-.99-5.8-3.01-7.79zm-7.92 16.64h-.01c-1.63 0-3.23-.44-4.62-1.27l-.33-.2-3.42.9.92-3.36-.22-.35c-1.01-1.61-1.54-3.46-1.54-5.35 0-4.97 4.05-9.02 9.02-9.02 2.4 0 4.67.93 6.37 2.63 1.7 1.7 2.64 3.97 2.64 6.37 0 4.97-4.05 9.02-9.02 9.02zm4.93-6.77c-.27-.14-1.6-.79-1.85-.88-.25-.08-.43-.13-.61.13-.18.27-.7.88-.86 1.06-.15.18-.31.2-.58.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.36-1.61-1.52-1.88-.15-.27-.02-.42.12-.55.12-.12.27-.31.41-.47.14-.15.19-.26.28-.43.1-.17.05-.32-.02-.45-.07-.13-.61-1.47-.84-2.01-.22-.5-.45-.43-.61-.44-.16-.01-.34-.01-.52-.01-.18 0-.47.07-.72.35-.25.28-.95.93-.95 2.27 0 1.34.97 2.63 1.1 2.81.14.18 1.98 3.02 4.8 4.23.67.29 1.2.46 1.61.59.67.21 1.28.18 1.76.11.54-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.31z" />
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
