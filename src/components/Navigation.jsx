import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

// WhatsApp brand icon (white icon with phone and chat bubble)
const WhatsAppIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);

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
    { path: 'https://wa.me/447549214155', label: 'Contact', isExternal: true, icon: WhatsAppIcon }
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
          <Link to="/" className="flex items-center" onClick={scrollToTop}>
            <img 
              src="/images/logo/logo.png" 
              alt="Wild Adventure Coach Logo" 
              className="h-16 sm:h-20 md:h-24 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              link.isExternal ? (
                <a
                  key={link.path}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] border-2 border-white text-white font-semibold rounded-full hover:bg-[#1ebe57] transition-all duration-200"
                  title="Contact us on WhatsApp"
                >
                  <link.icon className="w-5 h-5" />
                  <span className="text-sm font-bold">WHATSAPP</span>
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={scrollToTop}
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#C65D2B]'
                      : 'text-[#F7F5EB] hover:text-[#DCCCA3]'
                  }`}
                >
                  {link.label}
                </Link>
              )
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
              link.isExternal ? (
                <a
                  key={link.path}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center gap-3 px-4 py-3 bg-[#25D366] border-2 border-white text-white font-semibold rounded-full hover:bg-[#1ebe57] transition-all duration-200"
                  title="Contact us on WhatsApp"
                >
                  <link.icon className="w-6 h-6" />
                  <span className="text-lg font-bold">WHATSAPP</span>
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToTop();
                  }}
                  className={`block text-xl font-medium py-4 px-2 rounded-lg transition-colors touch-manipulation ${
                    location.pathname === link.path
                      ? 'text-[#C65D2B] bg-[#C65D2B]/10'
                      : 'text-[#F7F5EB] active:bg-[#6B8E23]/20'
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navigation;