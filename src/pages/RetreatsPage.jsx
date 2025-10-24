import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RetreatsPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const retreat = {
    id: 'august-retreat',
    title: 'Hiking and Yoga Retreat - August',
    location: 'Mont Blanc (France and Italy)',
    duration: '6 Days',
    dates: 'August 30 - September 4, 2026',
    participants: '8-10 people',
    description: '4 iconic stages of the Tour du Mont Blanc covering 65 km across France and Italy. 15 km each day and 1000 D+ each day. Good fitness level is required.',
    status: 'upcoming',
    price: '£1,250',
    priceNote: 'per person',
    included: [
      '5 nights accommodation',
      '3 meals / day',
      '4 guided hiking days',
      'Daily yoga & mindfulness sessions'
    ],
    notIncluded: [
      'Flights & transfer to Chamonix',
      'Hiking & yoga equipment',
      'Snacks and drinks'
    ],
    images: [
      '/images/retreat/1.jpg',
      '/images/retreat/2.jpg',
      '/images/retreat/3.jpg',
      '/images/retreat/4.png',
      '/images/retreat/5.jpg'
    ]
  };

  // API URL - since backend serves the frontend, use relative URLs in production
  const API_URL = import.meta.env.VITE_API_URL || '';

  // Component for individual retreat card
  const RetreatCard = ({ retreat }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [availableSpots, setAvailableSpots] = useState(null);
    const [soldOut, setSoldOut] = useState(false);

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

    // Fetch available spots on page load
    useEffect(() => {
      fetch(`${API_URL}/retreat-capacity/${retreat.title}`)
        .then(res => res.json())
        .then(data => {
          setAvailableSpots(data.availableSpots);
          setSoldOut(data.soldOut);
        })
        .catch(error => {
          console.error('Error fetching capacity:', error);
        });
    }, [retreat.title, API_URL]);

    return (
      <motion.div
        {...fadeInUp}
        className="bg-[#6B8E23]/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#6B8E23]/30"
      >
        {/* Image Carousel */}
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group">
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
          
          {/* Navigation Arrows - Always visible on mobile, hover on desktop */}
          <button
            onClick={prevImage}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-[#2E4A34]/90 hover:bg-[#2E4A34] text-[#F7F5EB] p-2 sm:p-3 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 touch-manipulation active:scale-95"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-[#2E4A34]/90 hover:bg-[#2E4A34] text-[#F7F5EB] p-2 sm:p-3 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 touch-manipulation active:scale-95"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          {/* Image Counter */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[#2E4A34]/90 text-[#F7F5EB] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            {currentImageIndex + 1} / {retreat.images.length}
          </div>
          
          {/* Dot Indicators */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
            {retreat.images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`h-2 rounded-full transition-all duration-300 touch-manipulation ${
                  index === currentImageIndex
                    ? 'bg-[#C65D2B] w-6 sm:w-8'
                    : 'bg-[#F7F5EB]/50 hover:bg-[#F7F5EB] w-2'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Retreat Details */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#F7F5EB] leading-tight">{retreat.title}</h2>
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
            
            {/* Available Spots Indicator */}
            {availableSpots !== null && (
              <div className="mt-4 pt-4 border-t border-[#6B8E23]/40">
                {soldOut ? (
                  <div className="flex items-center justify-center">
                    <span className="text-[#C65D2B] font-bold text-lg">🔴 SOLD OUT</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-[#DCCCA3] text-sm">Availability:</span>
                    <span className="text-[#F7F5EB] font-semibold">
                      {availableSpots} spot{availableSpots === 1 ? '' : 's'} remaining
                    </span>
                  </div>
                )}
              </div>
            )}
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

          {/* Price Section */}
          {retreat.price && (
            <div className="bg-[#C65D2B]/20 border border-[#C65D2B]/40 rounded-lg p-6 mb-8 text-center relative">
              {/* Early Bird Badge - Better positioned */}
              <div className="absolute -top-2 -right-2 bg-[#C65D2B] text-[#F7F5EB] px-3 py-1 text-xs font-bold uppercase rounded-full shadow-lg">
                Early Bird
              </div>
              
              <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-2">Early Bird Price</p>
              <p className="text-4xl md:text-5xl font-bold text-[#F7F5EB] mb-1">{retreat.price}</p>
              <p className="text-sm text-[#DCCCA3] mb-4">{retreat.priceNote}</p>
              
              {/* Early Bird Warning - Cleaner design */}
              <div className="bg-gradient-to-r from-[#C65D2B]/20 to-[#C65D2B]/10 border border-[#C65D2B]/50 rounded-lg px-4 py-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-[#C65D2B] text-lg">⚡</span>
                  <p className="text-[#F7F5EB] font-semibold text-sm">Limited Time Offer</p>
                </div>
                <p className="text-[#DCCCA3] text-xs leading-relaxed">
                  This early bird rate won't be available for long. Book now to secure your spot at this special price!
                </p>
              </div>
            </div>
          )}

          {/* What's Included Section */}
          {retreat.included && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#F7F5EB] mb-4">What's Included</h3>
              <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-6">
                <ul className="space-y-3">
                  {retreat.included.map((item, index) => (
                    <li key={index} className="flex items-start text-[#DCCCA3]">
                      <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Not Included Section */}
          {retreat.notIncluded && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#F7F5EB] mb-4">Not Included</h3>
              <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-6">
                <ul className="space-y-3">
                  {retreat.notIncluded.map((item, index) => (
                    <li key={index} className="flex items-start text-[#DCCCA3]">
                      <span className="text-[#C65D2B] mr-3 text-xl">✗</span>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          <Link to="/booking" className="block" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Button 
              disabled={soldOut}
              className={`w-full text-base sm:text-lg md:text-xl py-4 sm:py-6 md:py-8 rounded-full shadow-lg transition-all touch-manipulation ${
                soldOut 
                  ? 'bg-gray-500 cursor-not-allowed opacity-60' 
                  : 'bg-[#C65D2B] hover:bg-[#C65D2B]/90 hover:shadow-xl active:scale-98'
              } text-[#F7F5EB]`}
            >
              {soldOut ? 'Sold Out - Join Waitlist' : 'Book This Retreat'}
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Adventure Retreat - Wild Adventure Coach</title>
        <meta name="description" content="Explore our transformative adventure retreat. Join us for an unforgettable journey through the stunning landscapes of Mont Blanc." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-[#F7F5EB]">
              Our Retreat
            </h1>
            <p className="text-xl text-[#DCCCA3] max-w-3xl mx-auto">
              Join us for an unforgettable adventure through the stunning landscapes of Mont Blanc
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <RetreatCard retreat={retreat} />
          </div>
        </div>

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


              {/* Copyright */}
              <div className="pt-6 border-t border-[#6B8E23]/30 w-full text-center">
            <p className="text-[#DCCCA3] text-lg">
              © 2025 Wild Adventure Coach. All rights reserved.
            </p>
            <p className="text-[#DCCCA3]/70 text-sm mt-3">
              Developed by <a href="https://www.cisconnects.com" target="_blank" rel="noopener noreferrer" className="text-[#C65D2B] hover:text-[#C65D2B]/80 transition-colors underline">Cisconnects</a>
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