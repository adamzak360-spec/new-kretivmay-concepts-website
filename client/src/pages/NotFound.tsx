import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="text-center px-4">
        <h1 className="text-7xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Page Not Found</h2>
        <p className="text-slate-600 mb-8 text-lg">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <a className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
            Go Back Home
            <ArrowRight className="w-5 h-5" />
          </a>
        </Link>
      </div>
    </div>
  );
}
