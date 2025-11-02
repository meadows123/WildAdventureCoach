import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/retreats', label: 'Retreats' },
    { path: '/contact', label: 'Contact Us' },
    { path: '/terms', label: 'Terms & Conditions' }
  ];

  const retreatLinks = [
    { path: '/retreat/chamonix', label: 'June Retreat' },
    { path: '/retreat/august', label: 'August Retreat' }
  ];

  return (
    <footer className="bg-[#1a2d20] py-12 px-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Company Info */}
          <div className="space-y-4">
            {/* Logo */}
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img 
                src="/images/logo/logo.png" 
                alt="Wild Adventure Coach Logo" 
                className="h-16 sm:h-20 md:h-24 w-auto mb-4"
              />
            </Link>
            
            {/* Description */}
            <p className="text-[#DCCCA3] text-sm sm:text-base leading-relaxed">
              Transform your life through transformative adventure retreats. Reconnect with nature, discover your inner strength, and embark on life-changing journeys.
            </p>
          </div>

          {/* Middle Column - Navigation */}
          <div className="space-y-4">
            <h3 className="text-[#F7F5EB] font-bold text-lg sm:text-xl">Navigation</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className={`text-sm sm:text-base transition-colors inline-block py-2 px-1 -mx-1 touch-manipulation ${
                      location.pathname === link.path
                        ? 'text-[#C65D2B]'
                        : 'text-[#DCCCA3] hover:text-[#F7F5EB]'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Our Retreats */}
          <div className="space-y-4">
            <h3 className="text-[#F7F5EB] font-bold text-lg sm:text-xl">Our Retreats</h3>
            <ul className="space-y-2">
              {retreatLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className={`text-sm sm:text-base transition-colors inline-block py-2 px-1 -mx-1 touch-manipulation ${
                      location.pathname === link.path
                        ? 'text-[#C65D2B]'
                        : 'text-[#DCCCA3] hover:text-[#F7F5EB]'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
