import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeToSettings } from '../../lib/cms';
import Banner from './Banner';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    const unsub = subscribeToSettings(setSettings);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsub();
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[0.16,1,0.3,1] ${
        isScrolled ? 'bg-[#171717]/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <Banner />
      <div className={`max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'}`}>
        <Link to="/" className="flex items-center z-50 group">
          <img 
            src={settings?.logoUrl || "https://i.imgur.com/vQ18UQb.png"} 
            alt="Logo" 
            className="h-10 md:h-12 object-contain transition-opacity group-hover:opacity-80 mix-blend-screen contrast-125 brightness-90 shadow-2xl" 
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active text-white' : 'text-[#d1d1d1]/70 hover:text-white'}`}
            >
              {link.name}
            </Link>
          ))}
          <a href="https://app.urable.com/virtual-shop/Q6yNmIRJFJJUoAWylz2J" target="_blank" rel="noreferrer" className="btn-primary ml-4">
            Book Now
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white z-50 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.5 } }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 bg-[#171717]/98 backdrop-blur-3xl z-40 flex flex-col items-center justify-center gap-6 px-6"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full text-center"
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-3xl sm:text-4xl font-serif tracking-wide transition-all duration-500 block py-2 ${
                      location.pathname === link.path ? 'text-white italic translate-x-1' : 'text-[#d1d1d1]/40 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: navLinks.length * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[280px] mt-6"
              >
                <a
                  href="https://app.urable.com/virtual-shop/Q6yNmIRJFJJUoAWylz2J"
                  target="_blank" rel="noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary w-full text-center py-5"
                >
                  Book Now
                </a>
              </motion.div>
              
              {/* Decorative elements for mobile menu */}
              <div className="absolute top-1/4 -left-12 w-64 h-64 bg-white/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <div className="absolute bottom-1/4 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
