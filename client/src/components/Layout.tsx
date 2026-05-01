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
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              {settings.siteName}
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`text-sm font-medium transition-colors ${
                    location === link.href
                      ? "text-blue-600"
                      : "text-foreground hover:text-blue-600"
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
              className="p-2 hover:bg-accent rounded-lg transition-colors"
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
              {user?.role === "admin" ? (
                <Link href="/admin/dashboard">
                  <a className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full transition-colors">
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </a>
                </Link>
              ) : (
                <a 
                  href={getLoginUrl()}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 px-4 py-2 rounded-full transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </a>
              )}
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
          <nav className="md:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className={`text-sm font-medium transition-colors block ${
                      location === link.href
                        ? "text-blue-600"
                        : "text-foreground hover:text-blue-600"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
              
              {/* Mobile Admin/Login Link */}
              <div className="pt-4 border-t border-border">
                {user?.role === "admin" ? (
                  <Link href="/admin/dashboard">
                    <a 
                      className="flex items-center gap-2 text-sm font-medium text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Dashboard
                    </a>
                  </Link>
                ) : (
                  <a 
                    href={getLoginUrl()}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    Admin Login
                  </a>
                )}
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4">{settings.siteName}</h3>
              <p className="text-slate-300 text-sm">
                {settings.footerTagline}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                {navLinks.slice(1, 5).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <a className="hover:text-white transition-colors">{link.label}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Graphic Design</li>
                <li>Large Format Printing</li>
                <li>Branding & Packaging</li>
                <li>Social Media Marketing</li>
                <li>Shirts & Caps Printing</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-slate-300 mb-2">{settings.address}</p>
              <p className="text-sm text-slate-300 mb-4">
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </p>
              <p className="text-sm text-slate-300">
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  Facebook
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  Instagram
                </a>
              )}
              {settings.twitter && (
                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  Social
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
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-30"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110 z-30"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
