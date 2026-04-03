import { Link, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { ReactNode, useEffect } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col">
      {/* Simple navigation for subpages */}
      {!isHome && (
        <nav className="px-8 py-6 border-b border-[#e8e4db] bg-white/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="GHS Logo" className="w-8 h-8 object-contain" />
              <span className="font-serif text-charcoal font-medium tracking-wide text-sm group-hover:text-yellow-700 transition-colors leading-none">GHS</span>
              <span className="text-xs tracking-widest uppercase font-sans text-[#b0a898] mt-0.5 sm:inline hidden">
                Global Horizon Standard
              </span>
            </Link>
            <Link 
              to="/" 
              className="text-xs uppercase tracking-widest font-sans text-[#7a7265] hover:text-charcoal transition-colors px-4 py-2 rounded-full border border-[#d4cfc4]"
            >
              Back to Home
            </Link>
          </div>
        </nav>
      )}

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}
