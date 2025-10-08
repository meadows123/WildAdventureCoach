import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Instagram, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RetreatsPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const retreat = {
    title: 'Mountain Summit Experience',
    location: 'Rocky Mountains, Colorado',
    duration: '5 Days',
    dates: 'June 15-20, 2026',
    participants: '8-12 people',
    description: 'Challenge yourself with high-altitude hiking, summit a peak, and discover your inner strength. Experience breathtaking vistas, forge lasting connections, and push beyond your limits in one of nature\'s most spectacular settings.',
    status: 'upcoming',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
      'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&q=80',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&q=80'
    ]
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === retreat.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? retreat.images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <Helmet>
        <title>Adventure Retreats - Wild Adventure Coach</title>
        <meta name="description" content="Explore our transformative adventure retreats. From mountain summits to coastal wilderness, find the perfect journey for your soul." />
      </Helmet>

      <div className="min-h-screen pt-20">
        <section className="relative py-20 px-4 bg-gradient-to-b from-[#2E4A34] to-[#1a2d20]">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold mb-6 text-[#F7F5EB]"
            >
              Our Retreats
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-[#DCCCA3] max-w-3xl mx-auto"
            >
              Choose your adventure and embark on a transformative journey through nature's most stunning landscapes
            </motion.p>
          </div>
        </section>

        <section className="py-16 px-4 bg-[#2E4A34]">
          <div className="max-w-6xl mx-auto">
            <motion.div
              {...fadeInUp}
              className="bg-[#6B8E23]/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#6B8E23]/30"
            >
              {/* Image Carousel */}
              <div className="relative h-[500px] md:h-[600px] overflow-hidden group">
                {/* Main Image */}
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src={retreat.images[currentImageIndex]}
                  alt={`${retreat.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#2E4A34]/80 hover:bg-[#2E4A34] text-[#F7F5EB] p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#2E4A34]/80 hover:bg-[#2E4A34] text-[#F7F5EB] p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-[#2E4A34]/80 text-[#F7F5EB] px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {retreat.images.length}
                </div>
                
                {/* Dot Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {retreat.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'bg-[#C65D2B] w-8'
                          : 'bg-[#F7F5EB]/50 hover:bg-[#F7F5EB]'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Retreat Details */}
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-4xl md:text-5xl font-bold text-[#F7F5EB]">{retreat.title}</h2>
                  {retreat.status === 'upcoming' && (
                    <span className="px-4 py-2 text-sm font-semibold text-[#F7F5EB] bg-[#C65D2B] rounded-full">
                      UPCOMING
                    </span>
                  )}
                </div>
                
                {/* Featured Date Display */}
                <div className="bg-[#6B8E23]/20 border border-[#6B8E23]/40 rounded-lg p-6 mb-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center">
                      <Calendar className="w-8 h-8 mr-4 text-[#C65D2B] flex-shrink-0" />
                      <div>
                        <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Retreat Dates</p>
                        <p className="text-2xl md:text-3xl font-bold text-[#F7F5EB]">{retreat.dates}</p>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Duration</p>
                      <p className="text-xl md:text-2xl font-semibold text-[#F7F5EB]">{retreat.duration}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-[#DCCCA3] text-lg mb-8 leading-relaxed">{retreat.description}</p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center text-[#DCCCA3]">
                    <MapPin className="w-6 h-6 mr-4 text-[#C65D2B] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Location</p>
                      <span className="text-lg text-[#F7F5EB]">{retreat.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-[#DCCCA3]">
                    <Users className="w-6 h-6 mr-4 text-[#C65D2B] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Group Size</p>
                      <span className="text-lg text-[#F7F5EB]">{retreat.participants}</span>
                    </div>
                  </div>
                </div>
                
                <Link to="/booking" className="block">
                  <Button className="w-full bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB] text-xl py-8 rounded-full shadow-lg hover:shadow-xl transition-all">
                    Book This Retreat
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="bg-[#1a2d20] py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center space-y-6">
              {/* Social Links */}
              <div className="flex items-center space-x-6">
                <a 
                  href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-[#DCCCA3] hover:text-[#C65D2B] transition-colors group"
                >
                  <Instagram className="w-6 h-6" />
                  <span className="text-lg">@wildadventurecoach</span>
                </a>
              </div>

              {/* Email */}
              <a 
                href="mailto:wildadventurecoach2233@gmail.com"
                className="flex items-center space-x-2 text-[#DCCCA3] hover:text-[#C65D2B] transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="text-lg">wildadventurecoach2233@gmail.com</span>
              </a>

              {/* Copyright */}
              <div className="pt-6 border-t border-[#6B8E23]/30 w-full text-center">
                <p className="text-[#DCCCA3] text-lg">
                  © 2025 Wild Adventure Coach. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default RetreatsPage;