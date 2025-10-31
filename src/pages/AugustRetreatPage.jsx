import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Mountain, WifiOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AugustRetreatPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [availableSpots, setAvailableSpots] = useState(null);
  const [maxCapacity, setMaxCapacity] = useState(9);

  // API URL - since backend serves the frontend, use relative URLs in production
  const API_URL = import.meta.env.VITE_API_URL || '';

  // Fetch available spots on page load
  useEffect(() => {
    fetch(`${API_URL}/retreat-capacity/Hiking and Yoga Retreat - August`)
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
    '/images/retreat/1.jpg',
    '/images/retreat/2.jpg',
    '/images/retreat/3.jpg',
    '/images/retreat/4.png',
    '/images/retreat/5.jpg'
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
        <title>Hiking & Yoga Retreat - Tour du Mont Blanc - Wild Adventure Coach</title>
        <meta name="description" content="Join us on a 6-day journey along iconic stages of the Tour du Mont Blanc, covering 65 km across France and Italy. Daily yoga and mindfulness sessions included." />
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
              alt={`August Retreat - Image ${currentImageIndex + 1}`}
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
              Tour du Mont Blanc
            </h1>
            <p className="text-xl text-[#DCCCA3] max-w-3xl mx-auto leading-relaxed mb-2">
              Conquer Iconic Alpine Stages
            </p>
            <div className="w-24 h-1 bg-[#C65D2B] mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-[#DCCCA3] max-w-3xl mx-auto leading-relaxed">
              4 iconic stages of the Tour du Mont Blanc covering 65 km across France and Italy. 15 km each day and 1000 D+ each day
            </p>
            <div className="mt-6">
              <Link to="/booking?retreat=Hiking and Yoga Retreat - August" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
                Experience the challenge and beauty of the Tour du Mont Blanc. This intensive hiking retreat combines demanding alpine terrain with restorative yoga and mindfulness practices. Good fitness level is required
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start">
                  <Calendar className="w-6 h-6 mr-4 text-[#C65D2B] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Dates</p>
                    <p className="text-lg text-[#F7F5EB]">August 30 - September 4, 2026</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 text-[#C65D2B] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Location</p>
                    <p className="text-lg text-[#F7F5EB]">Mont Blanc (France and Italy)</p>
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
                    <p className="text-lg text-[#F7F5EB]">8-10 people</p>
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
                    <p className="font-semibold text-[#F7F5EB] mb-1">Challenging Daily Hikes</p>
                    <p className="text-sm">15 km each day with 1000m elevation gain across France and Italy</p>
                  </div>
                </div>
                <div className="flex items-start text-[#DCCCA3]">
                  <span className="text-3xl mr-4">🧘‍♀️</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">Daily Yoga & Mindfulness</p>
                    <p className="text-sm">Restore your body and mind with practice sessions after each day's hike</p>
                  </div>
                </div>
                <div className="flex items-start text-[#DCCCA3]">
                  <span className="text-3xl mr-4">🍽</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">3 Meals Per Day</p>
                    <p className="text-sm">Nourishing, wholesome meals to fuel your adventure</p>
                  </div>
                </div>
                <div className="flex items-start text-[#DCCCA3]">
                  <span className="text-3xl mr-4">🌍</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">Cross-Border Adventure</p>
                    <p className="text-sm">Experience multiple countries in one unforgettable journey</p>
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
                  <span className="w-32 font-semibold text-[#F7F5EB]">7:00</span>
                  <span>Morning Yoga & Stretching</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">8:00</span>
                  <span>Breakfast & Prep for Hike</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">9:00</span>
                  <span>Start Daily Hike (15 km, 1000m D+)</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">13:00</span>
                  <span>Packed Lunch on Trail</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">16:00</span>
                  <span>Arrival at Accomodation & Rest</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">18:00</span>
                  <span>Evening Yoga & Mindfulness</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">19:30</span>
                  <span>Dinner & Group Reflection</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Accommodation & Meals */}
          <motion.div {...fadeInUp} className="mb-12">
            <h2 className="text-3xl font-bold text-[#F7F5EB] mb-6">Accommodation & Meals</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-8">
              <p className="text-lg text-[#DCCCA3] leading-relaxed mb-6">
                Stay in comfortable mountain accommodations along the Tour du Mont Blanc route. Each evening, enjoy three delicious meals prepared to restore your energy after challenging hikes. Shared spaces encourage connection and celebration of each day's achievements
              </p>
              
              <div className="bg-[#6B8E23]/20 border border-[#6B8E23]/40 rounded-lg px-4 py-3">
                <p className="text-center text-[#DCCCA3] text-sm">
                  Secure your spot with a £375 deposit. Total price: £1,250 per person
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
                  <span className="text-lg">Experienced hikers seeking challenging multi-day alpine adventures</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C65D2B] mr-3 text-xl">•</span>
                  <span className="text-lg">Individuals with good fitness level and prior hiking experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C65D2B] mr-3 text-xl">•</span>
                  <span className="text-lg">Adventure seekers wanting to experience the iconic Tour du Mont Blanc</span>
                </li>
              </ul>
              <p className="text-lg text-[#F7F5EB] font-semibold mt-6">
                Good fitness level required — be ready for challenging 15 km hikes with 1000m elevation gain each day
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
                  <span className="text-lg"><span className="text-[#F7F5EB] font-semibold">5 Nights Accommodation</span> – Comfortable mountain accommodations along the Tour du Mont Blanc route</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-lg"><span className="text-[#F7F5EB] font-semibold">3 Meals Per Day</span> – Breakfast, lunch, and dinner to fuel your adventure</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-lg"><span className="text-[#F7F5EB] font-semibold">4 Guided Hiking Days</span> – Conquer iconic Tour du Mont Blanc stages across France and Italy</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-lg"><span className="text-[#F7F5EB] font-semibold">Daily Yoga & Mindfulness Sessions</span> – Restore body and mind after each challenging hike</span>
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
                  <span className="text-lg font-semibold text-[#F7F5EB]">Flights & transfer to Chamonix</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✗</span>
                  <span className="text-lg font-semibold text-[#F7F5EB]">Hiking & yoga equipment</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✗</span>
                  <span className="text-lg font-semibold text-[#F7F5EB]">Snacks and drinks</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Link to="/booking?retreat=Hiking and Yoga Retreat - August" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Button 
                className="text-lg md:text-xl py-6 px-12 rounded-full shadow-lg transition-all touch-manipulation bg-[#C65D2B] hover:bg-[#C65D2B]/90 hover:shadow-xl active:scale-98 text-[#F7F5EB]"
              >
                Book Your Spot
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AugustRetreatPage;

