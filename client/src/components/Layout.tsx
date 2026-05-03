import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Moon, Sun, MessageCircle, ArrowUp, Facebook, Instagram, Twitter, LogIn, LayoutDashboard } from "lucide-react";
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
  const { theme, toggleTheme } = useTheme();
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
              <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-white p-1 transition-transform group-hover:scale-105">
                <img 
                  src="/assets/kretivmay_logo_raw.webp" 
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
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-accent rounded-full transition-colors border border-border"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

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
                <div className="w-10 h-10 overflow-hidden rounded-lg bg-white p-1">
                  <img 
                    src="/assets/kretivmay_logo_raw.webp" 
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

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${settings.whatsapp?.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-30 group"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with us!
        </span>
      </a>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-2xl transition-all hover:scale-110 z-30"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
