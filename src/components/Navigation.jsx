import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRetreatDropdownOpen, setIsRetreatDropdownOpen] = useState(false);
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
    { path: '/retreats', label: 'Retreats', hasDropdown: true },
    { path: '/contact', label: 'Contact Us' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full overflow-x-hidden ${
        isScrolled ? 'bg-[#2E4A34]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 w-full">
          <Link to="/" className="flex items-center" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img 
              src="/images/logo/logo.png" 
              alt="Wild Adventure Coach Logo" 
              className="h-16 sm:h-20 md:h-24 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div key={link.path} className="relative group">
                  <div className="flex items-center gap-1">
                    <Link
                      to={link.path}
                      onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`text-lg font-medium transition-colors hover:text-[#DCCCA3] ${
                        location.pathname === link.path || location.pathname.startsWith('/retreat')
                          ? 'text-[#C65D2B]'
                          : 'text-[#F7F5EB]'
                      }`}
                    >
                      {link.label}
                    </Link>
                    <button
                      onClick={() => setIsRetreatDropdownOpen(!isRetreatDropdownOpen)}
                      className={`text-lg font-medium transition-colors ${
                        isRetreatDropdownOpen ? 'text-[#DCCCA3]' : 'text-[#F7F5EB] hover:text-[#DCCCA3]'
                      }`}
                    >
                      <svg className={`w-4 h-4 transform transition-transform ${isRetreatDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  
                  {isRetreatDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-40 rounded-lg bg-[#2E4A34] border border-[#6B8E23]/30 shadow-xl z-50"
                    >
                      <div className="py-2">
                        <Link
                          to="/retreat/chamonix"
                          onClick={() => {
                            setIsRetreatDropdownOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="block px-4 py-2.5 text-sm text-[#F7F5EB] hover:bg-[#6B8E23]/20 transition-colors"
                        >
                          June
                        </Link>
                        <Link
                          to="/contact"
                          onClick={() => {
                            setIsRetreatDropdownOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="block px-4 py-2.5 text-sm text-[#F7F5EB] hover:bg-[#6B8E23]/20 transition-colors border-t border-[#6B8E23]/30 relative"
                        >
                          <span className="flex items-center gap-2">
                            August
                            <span className="px-2 py-0.5 text-xs font-semibold text-[#F7F5EB] bg-gradient-to-r from-[#6B8E23] to-[#4A6F1F] rounded-full whitespace-nowrap border border-[#C65D2B]/50">
                              ⚡ Coming Up
                            </span>
                          </span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`text-lg font-medium transition-colors whitespace-nowrap ${
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
              link.hasDropdown ? (
                <div key={link.path}>
                  <div className="flex items-center justify-between">
                    <Link
                      to={link.path}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`block text-xl font-medium py-4 px-2 rounded-lg transition-colors touch-manipulation flex-1 ${
                        location.pathname === link.path
                          ? 'text-[#C65D2B] bg-[#C65D2B]/10'
                          : 'text-[#F7F5EB] active:bg-[#6B8E23]/20'
                      }`}
                    >
                      {link.label}
                    </Link>
                    <button
                      onClick={() => setIsRetreatDropdownOpen(!isRetreatDropdownOpen)}
                      className={`text-xl font-medium py-4 px-2 rounded-lg transition-colors touch-manipulation ${
                        isRetreatDropdownOpen ? 'text-[#DCCCA3]' : 'text-[#F7F5EB]'
                      }`}
                    >
                      <svg className={`w-5 h-5 transform transition-transform ${isRetreatDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  
                  {isRetreatDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 mt-2 space-y-1"
                    >
                      <Link
                        to="/retreat/chamonix"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsRetreatDropdownOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="block text-base font-medium py-3 px-2 rounded-lg transition-colors touch-manipulation text-[#DCCCA3] hover:text-[#F7F5EB] hover:bg-[#6B8E23]/20"
                      >
                        June
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsRetreatDropdownOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="block text-base font-medium py-3 px-2 rounded-lg transition-colors touch-manipulation text-[#DCCCA3] hover:text-[#F7F5EB] hover:bg-[#6B8E23]/20"
                      >
                        <span className="flex items-center gap-2">
                          August
                          <span className="px-2 py-0.5 text-xs font-semibold text-[#F7F5EB] bg-gradient-to-r from-[#6B8E23] to-[#4A6F1F] rounded-full whitespace-nowrap border border-[#C65D2B]/50">
                            ⚡ Coming Up
                          </span>
                        </span>
                      </Link>
                    </motion.div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
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