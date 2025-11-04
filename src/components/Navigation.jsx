import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/retreats', label: 'Retreats' },
    { path: '/contact', label: 'Contact Us' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#2E4A34]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link to="/" className="flex items-center" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img 
              src="/images/logo/logo.png" 
              alt="Wild Adventure Coach Logo" 
              className="h-16 sm:h-20 md:h-24 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`text-lg font-medium transition-colors whitespace-nowrap ${
                  location.pathname === link.path || (link.path === '/retreats' && location.pathname.startsWith('/retreat'))
                    ? 'text-[#C65D2B]'
                    : 'text-[#F7F5EB] hover:text-[#DCCCA3]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#F7F5EB] p-2 touch-manipulation active:scale-95 transition-transform"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-[#2E4A34]/98 backdrop-blur-md"
        >
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`block text-xl font-medium py-4 px-2 rounded-lg transition-colors touch-manipulation ${
                  location.pathname === link.path || (link.path === '/retreats' && location.pathname.startsWith('/retreat'))
                    ? 'text-[#C65D2B] bg-[#C65D2B]/10'
                    : 'text-[#F7F5EB] active:bg-[#6B8E23]/20'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navigation;