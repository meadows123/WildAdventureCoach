import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Mountain, WifiOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChamonixRetreatPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [availableSpots, setAvailableSpots] = useState(null);
  const [maxCapacity, setMaxCapacity] = useState(9);

  // API URL - since backend serves the frontend, use relative URLs in production
  const API_URL = import.meta.env.VITE_API_URL || '';

  // Fetch available spots on page load
  useEffect(() => {
    fetch(`${API_URL}/retreat-capacity/Hiking and Yoga Retreat in Chamonix`)
      .then(res => res.json())
      .then(data => {
        setAvailableSpots(data.availableSpots);
        setMaxCapacity(data.maxCapacity || 9);
      })
      .catch(error => {
        console.error('Error fetching capacity:', error);
        setAvailableSpots(9);
      });
  }, [API_URL]);

  const images = [
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop',
    '/images/retreat/1.jpg',
    '/images/retreat/2.jpg',
    '/images/retreat/3.jpg',
    '/images/retreat/4.png'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <>
      <Helmet>
        <title>Hiking & Yoga Retreat in Chamonix - Wild Adventure Coach</title>
        <meta name="description" content="A transformative 6-day alpine adventure combining mindful movement, breathtaking hikes, introduction to climbing and daily restorative yoga in Chamonix, French Alps." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden group rounded-2xl mb-8"
          >
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={images[currentImageIndex]}
              alt={`Chamonix Retreat - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#2E4A34]/90 hover:bg-[#2E4A34] text-[#F7F5EB] p-3 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#2E4A34]/90 hover:bg-[#2E4A34] text-[#F7F5EB] p-3 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-[#2E4A34]/90 text-[#F7F5EB] px-3 py-1 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-[#C65D2B] w-8'
                      : 'bg-[#F7F5EB]/50 hover:bg-[#F7F5EB] w-2'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-[#F7F5EB]">
              Hiking & Yoga in Chamonix
            </h1>
            <p className="text-xl text-[#DCCCA3] max-w-3xl mx-auto leading-relaxed mb-2">
              Reconnect with Nature and Yourself
            </p>
            <div className="w-24 h-1 bg-[#C65D2B] mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-[#DCCCA3] max-w-3xl mx-auto leading-relaxed">
              A transformative 6-day alpine adventure combining mindful movement, breathtaking hikes, introduction to climbing and daily restorative yoga
            </p>
            <div className="mt-6">
              <Link to="/booking?retreat=Hiking and Yoga Retreat in Chamonix" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Button className="text-base sm:text-lg md:text-xl py-4 px-8 rounded-full shadow-lg transition-all touch-manipulation bg-[#C65D2B] hover:bg-[#C65D2B]/90 hover:shadow-xl active:scale-98 text-[#F7F5EB]">
                  Join the Experience
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Overview */}
          <motion.div {...fadeInUp} className="mb-12">
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-[#F7F5EB] mb-4">Overview</h2>
              <p className="text-lg text-[#DCCCA3] leading-relaxed mb-6">
                Escape the noise of daily life. Immerse yourself in an environment that challenges the body, clears the mind, and creates space for meaningful connection. Designed for busy professionals seeking clarity, adventure, and renewal
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start">
                  <Calendar className="w-6 h-6 mr-4 text-[#C65D2B] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Dates</p>
                    <p className="text-lg text-[#F7F5EB]">June 4–9, 2026</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 text-[#C65D2B] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Location</p>
                    <p className="text-lg text-[#F7F5EB]">Chamonix, French Alps</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mountain className="w-6 h-6 mr-4 text-[#C65D2B] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Duration</p>
                    <p className="text-lg text-[#F7F5EB]">6 days / 5 nights</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="w-6 h-6 mr-4 text-[#C65D2B] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Group Size</p>
                    <p className="text-lg text-[#F7F5EB]">Up to 10 like-minded professionals</p>
                  </div>
                </div>
              </div>
              
              {/* Available Spots Indicator */}
              {availableSpots !== null && (
                <div className="mt-4 pt-4 border-t border-[#6B8E23]/30">
                  <div className="bg-[#6B8E23]/30 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#F7F5EB] font-semibold text-lg">Spots Remaining:</span>
                      <span className="text-[#F7F5EB] text-2xl font-bold">
                        {availableSpots} / {maxCapacity}
                      </span>
                    </div>
                    <div className="w-full bg-[#2E4A34] rounded-full h-3 mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-[#C65D2B] rounded-full transition-all duration-300"
                        style={{ width: `${(availableSpots / maxCapacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* What to Expect */}
          <motion.div {...fadeInUp} className="mb-12">
            <h2 className="text-3xl font-bold text-[#F7F5EB] mb-6">What to Expect</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start text-[#DCCCA3]">
                  <span className="text-3xl mr-4">🏔</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">Daily Guided Hikes</p>
                    <p className="text-sm">Conquer scenic trails that push your limits and ground your mind</p>
                  </div>
                </div>
                <div className="flex items-start text-[#DCCCA3]">
                  <span className="text-3xl mr-4">🧘‍♀️</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">Morning & Evening Yoga</p>
                    <p className="text-sm">Reconnect with your breath, body, and presence</p>
                  </div>
                </div>
                <div className="flex items-start text-[#DCCCA3]">
                  <span className="text-3xl mr-4">🧗</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">Introduction to Climbing</p>
                    <p className="text-sm">Experience the thrill of climbing in a safe, supportive environment</p>
                  </div>
                </div>
                <div className="flex items-start text-[#DCCCA3]">
                  <span className="text-3xl mr-4">🌿</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">Mindful Moments & Digital Detox</p>
                    <p className="text-sm">Meditation, journaling, and quiet reflection away from digital distractions</p>
                  </div>
                </div>
                <div className="flex items-start text-[#DCCCA3] md:col-span-2 justify-center">
                  <span className="text-3xl mr-4">🤝</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">Community Connection</p>
                    <p className="text-sm">Share the journey with like-minded explorers and create memories that last long after the retreat ends</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sample Daily Schedule */}
          <motion.div {...fadeInUp} className="mb-12">
            <h2 className="text-3xl font-bold text-[#F7F5EB] mb-6">Sample Daily Schedule</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-8">
              <div className="space-y-4">
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">7:30</span>
                  <span>Sunrise Yoga & Breathwork</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">8:30</span>
                  <span>Nutritious Breakfast</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">10:00</span>
                  <span>Guided Mountain Hike (mindful silence period mid-hike)</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">14:00</span>
                  <span>Lunch in Nature</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">16:30</span>
                  <span>Reflection & Rest</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">17:30</span>
                  <span>Evening Yin Yoga / Meditation Circle / Journaling workshop</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">19:00</span>
                  <span>Shared Dinner & Conversation</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Accommodation & Meals */}
          <motion.div {...fadeInUp} className="mb-12">
            <h2 className="text-3xl font-bold text-[#F7F5EB] mb-6">Accommodation & Meals</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-8">
              <p className="text-lg text-[#DCCCA3] leading-relaxed mb-6">
                Stay in a cozy alpine chalet with panoramic Mont Blanc views. Meals are crafted by our <span className="text-[#F7F5EB] font-semibold">private chef</span>, using wholesome, locally sourced ingredients to energize and delight. Healthy snacks and natural energy bars are available anytime at the chalet's <span className="text-[#F7F5EB] font-semibold">honesty bar</span>. Shared spaces encourage authentic conversations and a sense of community.
              </p>
              
              {/* Accommodation Options */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-[#2E4A34]/50 rounded-lg p-4 border-2 border-[#6B8E23]/30">
                  <p className="font-semibold text-[#F7F5EB] mb-2">Basic Single</p>
                  <p className="text-sm text-[#DCCCA3]">Shared room (up to 3 total)</p>
                  <p className="text-sm text-[#DCCCA3]">Ensuite bathroom</p>
                  <p className="text-2xl font-bold text-[#C65D2B] mt-3">£1,250</p>
                </div>
                <div className="bg-[#2E4A34]/50 rounded-lg p-4 border-2 border-[#6B8E23]/30">
                  <p className="font-semibold text-[#F7F5EB] mb-2">Economy Single</p>
                  <p className="text-sm text-[#DCCCA3]">One bed in shared twin</p>
                  <p className="text-sm text-[#DCCCA3]">Same-gender accommodation</p>
                  <p className="text-2xl font-bold text-[#C65D2B] mt-3">£1,450</p>
                </div>
                <div className="bg-[#2E4A34]/50 rounded-lg p-4 border-2 border-[#6B8E23]/30">
                  <p className="font-semibold text-[#F7F5EB] mb-2">Double</p>
                  <p className="text-sm text-[#DCCCA3]">Single occupancy</p>
                  <p className="text-sm text-[#DCCCA3]">Double room</p>
                  <p className="text-2xl font-bold text-[#C65D2B] mt-3">£1,700</p>
                </div>
              </div>
              <div className="bg-[#6B8E23]/20 border border-[#6B8E23]/40 rounded-lg px-4 py-3 mt-4">
                <p className="text-center text-[#DCCCA3] text-sm">
                  All options secure your spot with a £250 deposit. You'll select your preferred accommodation during booking.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Who It's For */}
          <motion.div {...fadeInUp} className="mb-12">
            <h2 className="text-3xl font-bold text-[#F7F5EB] mb-6">Who It's For</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-8">
              <p className="text-lg text-[#DCCCA3] mb-4">This retreat is designed for:</p>
              <ul className="space-y-3 text-[#DCCCA3]">
                <li className="flex items-start">
                  <span className="text-[#C65D2B] mr-3 text-xl">•</span>
                  <span className="text-lg">Busy professionals craving space to think, breathe, and reset</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C65D2B] mr-3 text-xl">•</span>
                  <span className="text-lg">Individuals seeking a physical challenge combined with mindful restoration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C65D2B] mr-3 text-xl">•</span>
                  <span className="text-lg">Solo travelers looking for meaningful connections and memorable experiences</span>
                </li>
              </ul>
              <p className="text-lg text-[#F7F5EB] font-semibold mt-6">
                No prior yoga or climbing experience required — bring an open mind and readiness for growth
              </p>
            </div>
          </motion.div>

          {/* What's Included */}
          <motion.div {...fadeInUp} className="mb-12">
            <h2 className="text-3xl font-bold text-[#F7F5EB] mb-6">What's Included</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-8">
              <ul className="space-y-4">
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-lg"><span className="text-[#F7F5EB] font-semibold">Accommodation</span> – Stay in a cozy alpine chalet with breathtaking views and modern comfort</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-lg"><span className="text-[#F7F5EB] font-semibold">Daily Guided Hikes & Yoga Sessions</span> – Experience the perfect balance of challenge and restoration each day</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-lg"><span className="text-[#F7F5EB] font-semibold">Meditation & Self-Reflection Sessions</span> – Guided moments to help you unwind, recharge, and reconnect with what truly matters</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-lg"><span className="text-[#F7F5EB] font-semibold">Introduction to Climbing</span> – Learn the basics and feel the thrill of scaling alpine rock in a supportive setting</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-lg"><span className="text-[#F7F5EB] font-semibold">Aiguille du Midi Cable Car Experience</span> – Soar to 3,842 meters and take in one of the most awe-inspiring panoramas in the Alps - a moment you'll never forget</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-lg"><span className="text-[#F7F5EB] font-semibold">All Meals, Packed Lunches & Tea/Coffee</span> – Wholesome, nourishing food prepared by our private chef designed to fuel the body and mind</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-lg"><span className="text-[#F7F5EB] font-semibold">Honesty Bar at the Chalet</span> – A self-serve corner stocked with healthy snacks and natural energy bars available for purchase anytime</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Optional */}
          <motion.div {...fadeInUp} className="mb-12">
            <h2 className="text-3xl font-bold text-[#F7F5EB] mb-6">Optional</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-8">
              <ul className="space-y-4">
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-lg"><span className="text-[#F7F5EB] font-semibold">Airport Transfers & Local Transport</span> – We'll gladly help arrange transfers or local transportation upon request to make your journey seamless and stress-free</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-lg"><span className="text-[#F7F5EB] font-semibold">Optional Activities</span> – Paragliding, spa treatments, massages, and more. Discounts may be available upon request (e.g., 15% off paragliding) for those who want to extend their adventure</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Not Included */}
          <motion.div {...fadeInUp} className="mb-12">
            <h2 className="text-3xl font-bold text-[#F7F5EB] mb-6">Not Included</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-8">
              <ul className="space-y-3">
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✗</span>
                  <span className="text-lg font-semibold text-[#F7F5EB]">Flights</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✗</span>
                  <span className="text-lg font-semibold text-[#F7F5EB]">Airport transfer</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✗</span>
                  <span className="text-lg font-semibold text-[#F7F5EB]">Insurance</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✗</span>
                  <span className="text-lg font-semibold text-[#F7F5EB]">Personal gear</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Meet Our Team */}
          <motion.div {...fadeInUp} className="mb-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#F7F5EB]">
                Meet Our Team
              </h2>
              <p className="text-lg text-[#DCCCA3] max-w-2xl mx-auto">
                Get to know the passionate professionals who will guide your transformative journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Rugile Ba - Guide */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-[#6B8E23]/20 backdrop-blur-sm p-6 rounded-2xl border border-[#6B8E23]/30 hover:border-[#C65D2B]/50 transition-all text-center"
              >
                <div className="mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" 
                    alt="Rugile Ba - Adventure Guide"
                    className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-[#C65D2B]/50"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#F7F5EB]">Rugile Ba</h3>
                <p className="text-[#C65D2B] font-semibold mb-3">Adventure Guide</p>
                <p className="text-[#DCCCA3] text-sm leading-relaxed">
                  With years of experience navigating the world's most challenging trails, Rugile brings expertise, passion, and unwavering safety consciousness to every retreat.
                </p>
              </motion.div>

              {/* Kate Moss - Yoga Instructor */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-[#6B8E23]/20 backdrop-blur-sm p-6 rounded-2xl border border-[#6B8E23]/30 hover:border-[#C65D2B]/50 transition-all text-center"
              >
                <div className="mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" 
                    alt="Kate Moss - Yoga Instructor"
                    className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-[#C65D2B]/50"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#F7F5EB]">Kate Moss</h3>
                <p className="text-[#C65D2B] font-semibold mb-3">Yoga Instructor</p>
                <p className="text-[#DCCCA3] text-sm leading-relaxed">
                  Kate combines mindfulness and movement to help you find balance and inner strength during your adventure. Her calming presence enhances every retreat experience.
                </p>
              </motion.div>

              {/* Keanu Reeves - Chef */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-[#6B8E23]/20 backdrop-blur-sm p-6 rounded-2xl border border-[#6B8E23]/30 hover:border-[#C65D2B]/50 transition-all text-center"
              >
                <div className="mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" 
                    alt="Keanu Reeves - Chef"
                    className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-[#C65D2B]/50"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#F7F5EB]">Keanu Reeves</h3>
                <p className="text-[#C65D2B] font-semibold mb-3">Chef</p>
                <p className="text-[#DCCCA3] text-sm leading-relaxed">
                  Keanu prepares nutritious, delicious meals that fuel your adventure. His culinary expertise ensures you're well-nourished throughout your retreat journey.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Link to="/booking?retreat=Hiking and Yoga Retreat in Chamonix" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Button 
                className="text-lg md:text-xl py-6 px-12 rounded-full shadow-lg transition-all touch-manipulation bg-[#C65D2B] hover:bg-[#C65D2B]/90 hover:shadow-xl active:scale-98 text-[#F7F5EB]"
              >
                Book Your Spot
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Floating Book Now Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="fixed bottom-6 left-0 right-0 z-50 flex justify-center"
      >
        <Link to="/booking?retreat=Hiking and Yoga Retreat in Chamonix" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="relative group"
          >
            {/* Glow/Pulse behind button */}
            <span className="absolute inset-0 blur-xl rounded-full bg-[#C65D2B]/40 opacity-70 group-hover:opacity-90 transition-opacity"></span>
            <span className="absolute inset-0 blur-2xl rounded-full bg-[#C65D2B]/30 animate-pulse"></span>

            <div className="relative bg-gradient-to-r from-[#C65D2B] to-[#E07B4B] hover:from-[#C65D2B] hover:to-[#cf6f43] text-[#F7F5EB] px-8 py-5 rounded-full shadow-2xl font-semibold text-xl transition-all cursor-pointer flex items-center gap-3 ring-2 ring-[#C65D2B]/40">
              <span>🍃 Book Now</span>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    </>
  );
};

export default ChamonixRetreatPage;
