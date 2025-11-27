import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Mountain, WifiOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AugustRetreatPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [availableSpots, setAvailableSpots] = useState(7);
  const [maxCapacity, setMaxCapacity] = useState(10);

  // API URL - for localhost, default to http://localhost:4242 if not set
  const API_URL = import.meta.env.VITE_API_URL || 
    (import.meta.env.DEV ? 'http://localhost:4242' : '');

  // Fetch available spots on page load
  useEffect(() => {
    fetch(`${API_URL}/retreat-capacity/Hiking and Yoga Retreat - August`)
      .then(res => res.json())
      .then(data => {
        // Use API data if available, otherwise default to 7 spots
        setAvailableSpots(data.availableSpots !== undefined ? data.availableSpots : 7);
        setMaxCapacity(data.maxCapacity || 10);
      })
      .catch(error => {
        console.error('Error fetching capacity:', error);
        // Default to 7 spots if API fails
        setAvailableSpots(7);
        setMaxCapacity(10);
      });
  }, [API_URL]);

  const images = [
    '/images/retreat/1.jpg',
    '/images/retreat/2.jpg',
    '/images/retreat/4.png',
    '/images/retreat/5.jpg',
    '/images/retreat/6.jpg'
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
        <meta name="description" content="Join us on a 6-day hut-to-hut journey along stages 5-10 of the Tour du Mont Blanc, covering French, Italian & Swiss Alps. Daily yoga and mindfulness sessions included." />
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-[#F7F5EB] px-4">
              Tour du Mont Blanc
            </h1>
            <p className="text-lg sm:text-xl text-[#DCCCA3] max-w-3xl mx-auto leading-relaxed mb-2 px-4">
              Alpine Journey Across Three Countries
            </p>
            <div className="w-24 h-1 bg-[#C65D2B] mx-auto rounded-full mb-3 sm:mb-4"></div>
            <p className="text-base sm:text-lg text-[#DCCCA3] max-w-3xl mx-auto leading-relaxed px-4">
              Escape the noise of daily life. Immerse yourself in an alpine journey that strengthens the body, clears the mind, and creates space for real connection. Designed for busy professionals seeking clarity, challenge, and renewal on the Tour du Mont Blanc.
            </p>
            <div className="mt-6 sm:mt-8">
              <Link to="/booking?retreat=Hiking and Yoga Retreat - August" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Button className="text-base sm:text-lg md:text-xl py-4 sm:py-5 md:py-6 px-8 sm:px-10 md:px-12 rounded-full shadow-lg transition-all touch-manipulation bg-[#C65D2B] hover:bg-[#C65D2B]/90 hover:shadow-xl active:scale-95 text-[#F7F5EB] w-full sm:w-auto min-h-[48px]">
                  Join the Experience
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Overview */}
          <motion.div {...fadeInUp} className="mb-12">
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-3 sm:mb-4">Overview</h2>
              <p className="text-base sm:text-lg text-[#DCCCA3] leading-relaxed mb-4 sm:mb-6">
                Escape the noise of daily life. Immerse yourself in an alpine journey that strengthens the body, clears the mind, and creates space for real connection. Designed for busy professionals seeking clarity, challenge, and renewal on the Tour du Mont Blanc.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="flex items-start">
                  <Calendar className="w-6 h-6 mr-4 text-[#C65D2B] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Dates</p>
                    <p className="text-lg text-[#F7F5EB]">August 6–11, 2026</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 text-[#C65D2B] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Location</p>
                    <p className="text-lg text-[#F7F5EB]">Chamonix - French, Italian & Swiss Alps</p>
                    <p className="text-sm text-[#DCCCA3] mt-1">Stages 5-10 of Tour du Mont Blanc</p>
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
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 sm:mb-6">What to Expect</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-4 sm:p-6 md:p-8">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-start text-[#DCCCA3]">
                  <span className="text-3xl mr-4">🏔</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">Daily Guided TMB Stages</p>
                    <p className="text-sm">Long, scenic hikes that test your endurance, sharpen focus, and anchor you in the present moment. We will cover stages 5-10 of Tour du Mont Blanc.</p>
                  </div>
                </div>
                <div className="flex items-start text-[#DCCCA3]">
                  <span className="text-3xl mr-4">🧘‍♀️</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">Morning & Evening Yoga</p>
                    <p className="text-sm">Gentle mobility sessions in the morning and restorative stretches after each hike.</p>
                  </div>
                </div>
                <div className="flex items-start text-[#DCCCA3]">
                  <span className="text-3xl mr-4">🌿</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">Mindfulness & Digital Detox</p>
                    <p className="text-sm">Quiet moments, meditations, and intentional pauses to shift from constant doing to simply being.</p>
                  </div>
                </div>
                <div className="flex items-start text-[#DCCCA3]">
                  <span className="text-3xl mr-4">🤝</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">Community & Leadership in Nature</p>
                    <p className="text-sm">Shared effort, teamwork, and conversations that build meaningful connections and leadership insight.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sample Daily Schedule */}
          <motion.div {...fadeInUp} className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 sm:mb-6">Sample Daily Schedule</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-4 sm:p-6 md:p-8">
              <div className="space-y-4">
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-40 sm:w-48 font-semibold text-[#F7F5EB]">Morning</span>
                  <span>Light stretch + mindful preparation</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-40 sm:w-48 font-semibold text-[#F7F5EB]">Full-day</span>
                  <span>Hike from one refuge to the next</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-40 sm:w-48 font-semibold text-[#F7F5EB]">Arrival</span>
                  <span>Rest, journaling, optional coaching moment</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-40 sm:w-48 font-semibold text-[#F7F5EB]">Evening</span>
                  <span>Restorative yoga + communal dinner in the hut</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Accommodation & Meals */}
          <motion.div {...fadeInUp} className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 sm:mb-6">Accommodation & Meals</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-4 sm:p-6 md:p-8">
              <p className="text-base sm:text-lg text-[#DCCCA3] leading-relaxed mb-4 sm:mb-6">
                Stay in traditional <span className="text-[#F7F5EB] font-semibold">mountain huts (refuges)</span> along the TMB. Dorm-style rooms, hearty dinners, breakfast, and packed lunches are provided. Meals vary by hut but are nourishing, simple, and designed to refuel after long days on the trail. Shared spaces create a sense of camaraderie and authentic connection.
              </p>
              
              <div className="bg-[#6B8E23]/20 border border-[#6B8E23]/40 rounded-lg px-4 py-3">
                <p className="text-center text-[#DCCCA3] text-sm">
                  Secure your spot with a £250 deposit. Total price: £1,499 per person
                </p>
              </div>
            </div>
          </motion.div>

          {/* Who It's For */}
          <motion.div {...fadeInUp} className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 sm:mb-6">Who It's For</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-4 sm:p-6 md:p-8">
              <p className="text-base sm:text-lg text-[#DCCCA3] mb-3 sm:mb-4">This retreat is ideal for:</p>
              <ul className="space-y-3 text-[#DCCCA3]">
                <li className="flex items-start">
                  <span className="text-[#C65D2B] mr-3 text-xl">•</span>
                  <span className="text-base sm:text-lg">Leaders and professionals needing time away to reset and gain clarity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C65D2B] mr-3 text-xl">•</span>
                  <span className="text-base sm:text-lg">Individuals seeking both physical challenge and mindful restoration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C65D2B] mr-3 text-xl">•</span>
                  <span className="text-base sm:text-lg">Solo travelers wanting connection through shared adventure</span>
                </li>
              </ul>
              <p className="text-base sm:text-lg text-[#F7F5EB] font-semibold mt-4 sm:mt-6">
                At least a medium level of hiking experience is required. You should feel comfortable with full-day hikes, steady elevation gain, and carrying your own gear from hut to hut. Prior hut-to-hut or multi-day trekking experience is ideal.
              </p>
              <p className="text-base sm:text-lg text-[#DCCCA3] mt-3 sm:mt-4">
                No prior yoga experience required.
              </p>
            </div>
          </motion.div>

          {/* What's Included */}
          <motion.div {...fadeInUp} className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 sm:mb-6">What's Included</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-4 sm:p-6 md:p-8">
              <ul className="space-y-4">
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Hut-to-Hut Accommodation</span> – Overnight stays in mountain refuges along the TMB</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Daily Guided Hikes & Yoga Sessions</span> – A balanced mix of challenge and recovery</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Mindfulness & Self-Reflection Practices</span> – Guided moments to reconnect with what matters</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">All Meals (per hut)</span> – Breakfast, dinner, and packed lunches for each hiking day</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Transport Along the TMB</span> – All local transfers required during the route</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Transport Between Chamonix & Italy</span> – Included for the start/end sections of the journey</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Logistics Support</span> – Assistance with transport planning and gear guidance</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Optional Early Arrival</span> – You can choose to arrive one day early, advance notice required.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Not Included */}
          <motion.div {...fadeInUp} className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 sm:mb-6">Not Included</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-4 sm:p-6 md:p-8">
              <ul className="space-y-3">
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✗</span>
                  <span className="text-base sm:text-lg font-semibold text-[#F7F5EB]">Flights</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✗</span>
                  <span className="text-base sm:text-lg font-semibold text-[#F7F5EB]">Insurance</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✗</span>
                  <span className="text-base sm:text-lg font-semibold text-[#F7F5EB]">Personal gear</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✗</span>
                  <span className="text-base sm:text-lg font-semibold text-[#F7F5EB]">Transport to/from the initial meeting point</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Meet Your Hosts */}
          <motion.div {...fadeInUp} className="mb-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#F7F5EB]">
                MEET YOUR HOSTS
              </h2>
              <p className="text-lg text-[#DCCCA3] max-w-2xl mx-auto">
                Get to know the passionate professionals who will guide your transformative journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Rugilė Bazytė - Guide */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-[#6B8E23]/20 backdrop-blur-sm p-6 rounded-2xl border border-[#6B8E23]/30 hover:border-[#C65D2B]/50 transition-all text-left"
              >
                <div className="mb-6 flex justify-center">
                  <img 
                    src="/images/homepage/rugile.jpg" 
                    alt="Rugilė Bazytė - Adventure Guide"
                    className="w-36 h-36 md:w-44 md:h-44 mx-auto rounded-full object-cover border-4 border-[#C65D2B]/50"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop";
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#F7F5EB]">Rugilė Bazytė</h3>
                <p className="text-[#C65D2B] font-semibold mb-3">Adventure Guide</p>
                <p className="text-[#DCCCA3] text-sm leading-relaxed">
                  Rugilė is the heart behind these adventures — an experienced hiker, mountain lover, and organizer who has spent years exploring some of the most spectacular trails across Europe. Her retreats bring together her passion for the outdoors, mindful living, and genuine human connection. Known for her calm presence and safety-first approach, she creates experiences that are both grounding and unforgettable — where challenge meets serenity, and every step leads you closer to nature and yourself.
                </p>
              </motion.div>

              {/* Pauline Jouffret - Yoga Instructor */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-[#6B8E23]/20 backdrop-blur-sm p-6 rounded-2xl border border-[#6B8E23]/30 hover:border-[#C65D2B]/50 transition-all text-left"
              >
                <div className="mb-6 flex justify-center">
                  <img 
                    src="/images/retreat/Pauline.png" 
                    alt="Pauline Jouffret - Yoga Instructor"
                    className="w-36 h-36 md:w-44 md:h-44 mx-auto rounded-full object-cover border-4 border-[#C65D2B]/50"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#F7F5EB]">Pauline Jouffret</h3>
                <p className="text-[#C65D2B] font-semibold mb-3">Yoga Instructor</p>
                <p className="text-[#DCCCA3] text-sm leading-relaxed">
                  Trained by Alina Bialek in London, Pauline first started yoga to balance her CrossFit and running routines. You can expect dynamic vinyasa flows, with hands-on adjustments. My classes are open to all levels and conditions, with variations offered for all bodies. My guidance fosters curiosity, challenge and kindness.
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

      {/* Floating Book Now Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="fixed bottom-6 left-0 right-0 z-50 flex justify-center"
      >
        <Link to="/booking?retreat=Hiking and Yoga Retreat - August" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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

export default AugustRetreatPage;
