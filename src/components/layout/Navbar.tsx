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
            className="h-16 md:h-24 object-contain transition-opacity group-hover:opacity-80 mix-blend-screen contrast-125 brightness-90 shadow-2xl" 
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
              className="fixed inset-0 bg-[#171717]/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center gap-8"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-4xl font-serif tracking-wide transition-colors duration-500 ${
                      location.pathname === link.path ? 'text-white italic' : 'text-[#d1d1d1]/50 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.7, delay: navLinks.length * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <a
                  href="https://app.urable.com/virtual-shop/Q6yNmIRJFJJUoAWylz2J"
                  target="_blank" rel="noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary mt-8"
                >
                  Book Now
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
