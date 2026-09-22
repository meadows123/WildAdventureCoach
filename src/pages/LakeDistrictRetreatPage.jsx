import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Mountain, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LakeDistrictRetreatPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    '/images/retreat/lake-district/bts-1.jpg',
    '/images/retreat/lake-district/bts-2.jpg',
    '/images/retreat/lake-district/bts-3.jpg',
    '/images/retreat/lake-district/bts-4.jpg',
    '/images/retreat/lake-district/bts-5.jpg',
    '/images/retreat/lake-district/bts-6.jpg',
    '/images/retreat/lake-district/bts-7.jpg',
    '/images/retreat/lake-district/bts-8.jpg',
    '/images/retreat/lake-district/bts-9.jpg',
    '/images/retreat/lake-district/bts-10.jpg',
    '/images/retreat/lake-district/bts-11.jpg'
  ];

  useEffect(() => {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const RegisterButton = ({ label = 'Reserve My Spot', className = '' }) => (
    <Link
      to="/retreat/lake-district/register"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <Button
        className={`text-base sm:text-lg py-6 sm:py-7 px-8 sm:px-10 rounded-full shadow-lg transition-all touch-manipulation bg-[#C65D2B] hover:bg-[#C65D2B]/90 hover:shadow-xl active:scale-95 text-[#F7F5EB] whitespace-nowrap min-h-[48px] ${className}`}
      >
        {label}
      </Button>
    </Link>
  );

  return (
    <>
      <Helmet>
        <title>Beyond The Summit - Adventure for Leaders - Wild Adventure Coach</title>
        <meta name="description" content="A restorative 3-day mountain escape in the Lake District combining fun guided hikes, grounding yoga, nourishing food, and space to slow down and reset. 12-14 March 2027." />
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
              transition={{ duration: 0.2 }}
              src={images[currentImageIndex]}
              alt={`Beyond The Summit - Lake District Retreat - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />

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

            <div className="absolute top-4 right-4 bg-[#2E4A34]/90 text-[#F7F5EB] px-3 py-1 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>

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
            className="text-center mb-10"
          >
            <p className="text-sm sm:text-base font-bold tracking-[0.2em] text-[#C65D2B] uppercase mb-3">
              Beyond The Summit
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-[#F7F5EB] px-4">
              Lake District Hiking &amp; Yoga Reset
            </h1>
            <p className="text-lg sm:text-xl text-[#DCCCA3] max-w-3xl mx-auto leading-relaxed mb-2 px-4">
              Step away from the noise. Move, breathe, explore, and come back to yourself.
            </p>
            <div className="w-24 h-1 bg-[#C65D2B] mx-auto rounded-full mb-3 sm:mb-4"></div>
            <p className="text-base sm:text-lg text-[#DCCCA3] max-w-3xl mx-auto leading-relaxed px-4">
              A restorative 3-day mountain escape combining fun guided hikes, grounding yoga, nourishing food, and time to slow down, reconnect, and reset.
            </p>
            <p className="text-base sm:text-lg text-[#F7F5EB] font-semibold mt-3">
              12–14 March 2027
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-[#F7F5EB]">£455</span>
                <span className="text-sm sm:text-base text-[#DCCCA3]">per person</span>
              </div>
              <p className="text-sm sm:text-base text-[#BFEA8A] font-semibold">
                £399 with promo code
              </p>
              <RegisterButton />
              <p className="text-xs sm:text-sm text-[#DCCCA3]">
                £50 deposit to secure your spot — we'll send payment details after you register
              </p>
            </div>
          </motion.div>

          {/* Overview */}
          <motion.div {...fadeInUp} className="mb-12">
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-3 sm:mb-4">Overview</h2>
              <p className="text-base sm:text-lg text-[#DCCCA3] leading-relaxed mb-4">
                Life can become a constant cycle of work, responsibilities, screens, messages, and places to be. Beyond the Summit is an invitation to step out of that cycle for a while.
              </p>
              <p className="text-base sm:text-lg text-[#DCCCA3] leading-relaxed mb-4">
                Leave the city, the calendar, and the to-do list behind. Spend three days surrounded by the mountains and lakes of the Lake District - moving your body, breathing fresh air, laughing with good people, and creating space to hear yourself again.
              </p>
              <p className="text-base sm:text-lg text-[#DCCCA3] leading-relaxed mb-4">
                Through fun and challenging hikes, grounding yoga, mindful moments, and nourishing food, this is a weekend designed to bring you back into balance. Movement to reconnect. Movement so you can rest. Nature to clear your head. Time to go a little deeper inside yourself.
              </p>
              <p className="text-base sm:text-lg text-[#F7F5EB] font-semibold leading-relaxed mb-6">
                You don't need to achieve anything. You don't need to optimise yourself. You simply show up - everything is taken care of.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-start">
                  <Calendar className="w-6 h-6 mr-4 text-[#C65D2B] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Dates</p>
                    <p className="text-lg text-[#F7F5EB]">March 12–14, 2027</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 text-[#C65D2B] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Location</p>
                    <p className="text-lg text-[#F7F5EB]">Lake District, England</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mountain className="w-6 h-6 mr-4 text-[#C65D2B] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Duration</p>
                    <p className="text-lg text-[#F7F5EB]">3 days / 2 nights</p>
                    <p className="text-sm text-[#DCCCA3] mt-1">Optional extra night available</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="w-6 h-6 mr-4 text-[#C65D2B] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-1">Group Size</p>
                    <p className="text-lg text-[#F7F5EB]">Small group of like-minded people</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#6B8E23]/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-[#F7F5EB] font-semibold text-sm sm:text-base">
                    <span className="text-lg">⚡</span> Spots Filling Up
                  </span>
                  <span className="text-[#C65D2B] font-bold text-base sm:text-lg whitespace-nowrap">
                    2 / 10 booked
                  </span>
                </div>
                <div className="w-full h-4 sm:h-5 rounded-full bg-[#2E4A34] border border-[#6B8E23]/40 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '20%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-[#C65D2B] to-[#E07B4B]"
                  />
                </div>
                <p className="text-[#DCCCA3] text-xs sm:text-sm mt-2 text-center sm:text-right">
                  8 spots left — reserve yours today
                </p>
              </div>
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
                    <p className="font-semibold text-[#F7F5EB] mb-1">Mountainous Nature</p>
                    <p className="text-sm">Trade the city for open landscapes, fresh air, dramatic peaks, and the restorative feeling of being surrounded by nature.</p>
                  </div>
                </div>
                <div className="flex items-start text-[#DCCCA3]">
                  <span className="text-3xl mr-4">🥾</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">Fun Guided Hikes</p>
                    <p className="text-sm">Get moving without turning it into a competition. Explore beautiful Lake District trails, enjoy the views, challenge yourself a little, and have fun along the way.</p>
                  </div>
                </div>
                <div className="flex items-start text-[#DCCCA3]">
                  <span className="text-3xl mr-4">🧘‍♀️</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">Yoga That Grounds You</p>
                    <p className="text-sm">Sessions designed to bring you back into your body, slow things down, and create space to breathe. No previous experience needed.</p>
                  </div>
                </div>
                <div className="flex items-start text-[#DCCCA3]">
                  <span className="text-3xl mr-4">🌿</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">Time for Yourself</p>
                    <p className="text-sm">Time away from work, notifications, and the constant demands of everyday life. Read, walk, journal, nap, sit by the fire, or do nothing at all.</p>
                  </div>
                </div>
                <div className="flex items-start text-[#DCCCA3] sm:col-span-2">
                  <span className="text-3xl mr-4">🫶</span>
                  <div>
                    <p className="font-semibold text-[#F7F5EB] mb-1">Meaningful Connection</p>
                    <p className="text-sm">Share the weekend with people also ready to slow down. Expect good food, honest conversation, and the kind of connection that happens naturally when everyone puts their phones away.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* A Weekend to Reset */}
          <motion.div {...fadeInUp} className="mb-12">
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-3 sm:mb-4">A Weekend to Reset</h2>
              <p className="text-base sm:text-lg text-[#DCCCA3] leading-relaxed mb-4">
                This isn't a weekend packed with activities from morning until night. There is space between the plans.
              </p>
              <p className="text-base sm:text-lg text-[#DCCCA3] leading-relaxed mb-4">
                Space to sleep a little longer. Space to wander. Space to sit quietly. Space to notice how you're actually feeling.
              </p>
              <p className="text-base sm:text-lg text-[#DCCCA3] leading-relaxed">
                Hikes get you moving. Yoga brings you back down. Mountains give you perspective. And the space in between gives you time to reconnect with yourself.
              </p>
            </div>
          </motion.div>

          {/* Mid-page CTA */}
          <motion.div {...fadeInUp} className="mb-12 text-center bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#F7F5EB] mb-2">Ready to step away from the noise?</h3>
            <p className="text-[#DCCCA3] mb-5">Spots are limited to keep the group small and personal.</p>
            <RegisterButton />
          </motion.div>

          {/* Sample Daily Schedule */}
          <motion.div {...fadeInUp} className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 sm:mb-6">Sample Daily Schedule</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-4 sm:p-6 md:p-8">
              <div className="space-y-4">
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">7:30</span>
                  <span>Morning Yoga &amp; Breathwork</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">8:30</span>
                  <span>Nourishing Breakfast</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">10:00</span>
                  <span>Guided Mountain Hike</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">13:00</span>
                  <span>Packed Lunch &amp; Mountain Views</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">15:30</span>
                  <span>Free Time — Rest, Explore, or Simply Be</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">17:30</span>
                  <span>Restorative Yoga &amp; Meditation</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">19:00</span>
                  <span>Shared Dinner</span>
                </div>
                <div className="flex items-center text-[#DCCCA3]">
                  <span className="w-32 font-semibold text-[#F7F5EB]">20:30</span>
                  <span>Relaxed Conversation, Journaling, or Time to Yourself</span>
                </div>
              </div>
              <p className="text-sm text-[#DCCCA3] mt-6 italic">
                The schedule is intentionally spacious and may shift depending on weather, hiking conditions, and the group's energy.
              </p>
            </div>
          </motion.div>

          {/* Accommodation & Meals */}
          <motion.div {...fadeInUp} className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 sm:mb-6">Accommodation &amp; Meals</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-4 sm:p-6 md:p-8">
              <p className="text-base sm:text-lg text-[#DCCCA3] leading-relaxed mb-4 sm:mb-6">
                Come with an overnight bag - we'll take care of the rest. Stay in comfortable <span className="text-[#F7F5EB] font-semibold">Lake District accommodation</span> surrounded by nature, with cosy shared spaces to relax and connect. You'll be nourished throughout with wholesome meals, from breakfast and packed lunches for the mountains to relaxed shared dinners in the evening.
              </p>
              <p className="text-base sm:text-lg text-[#DCCCA3] leading-relaxed mb-6">
                Accommodation, food, guided hikes, yoga, and the full retreat programme are all included. Your only job is to show up.
              </p>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#2E4A34]/50 rounded-lg p-4 border-2 border-[#6B8E23]/30">
                  <p className="font-semibold text-[#F7F5EB] mb-2">Single</p>
                  <p className="text-sm text-[#DCCCA3]">Private room, shared retreat spaces</p>
                  <p className="text-sm text-[#DCCCA3] mt-1">First come, first served basis</p>
                </div>
                <div className="bg-[#2E4A34]/50 rounded-lg p-4 border-2 border-[#6B8E23]/30">
                  <p className="font-semibold text-[#F7F5EB] mb-2">Double / Twin</p>
                  <p className="text-sm text-[#DCCCA3]">Shared with one other guest</p>
                  <p className="text-sm text-[#DCCCA3] mt-1">Shared retreat spaces</p>
                </div>
                <div className="bg-[#2E4A34]/50 rounded-lg p-4 border-2 border-[#6B8E23]/30">
                  <p className="font-semibold text-[#F7F5EB] mb-2">Optional Extra Night</p>
                  <p className="text-sm text-[#DCCCA3]">Not quite ready to go home?</p>
                  <p className="text-sm text-[#DCCCA3] mt-1">Stay on and give yourself more time to slow down</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Who It's For */}
          <motion.div {...fadeInUp} className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 sm:mb-6">Who It's For</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-4 sm:p-6 md:p-8">
              <p className="text-base sm:text-lg text-[#DCCCA3] mb-3 sm:mb-4">
                This retreat is for anyone who feels like they could use a proper pause - especially those balancing demanding careers, relationships, family, and a life that sometimes moves a little too fast. It's for:
              </p>
              <ul className="space-y-3 text-[#DCCCA3]">
                <li className="flex items-start">
                  <span className="text-[#C65D2B] mr-3 text-xl">•</span>
                  <span className="text-base sm:text-lg">People who spend too much time in the city and not enough in nature</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C65D2B] mr-3 text-xl">•</span>
                  <span className="text-base sm:text-lg">Busy professionals who need a genuine break from work</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C65D2B] mr-3 text-xl">•</span>
                  <span className="text-base sm:text-lg">Anyone feeling mentally full and craving breathing room</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C65D2B] mr-3 text-xl">•</span>
                  <span className="text-base sm:text-lg">People who want to move their body without pressure or performance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C65D2B] mr-3 text-xl">•</span>
                  <span className="text-base sm:text-lg">Those looking to reconnect through nature, movement, and stillness</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C65D2B] mr-3 text-xl">•</span>
                  <span className="text-base sm:text-lg">Solo travellers who want adventure and meaningful connection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C65D2B] mr-3 text-xl">•</span>
                  <span className="text-base sm:text-lg">Anyone who simply feels it's time for a reset</span>
                </li>
              </ul>
              <p className="text-base sm:text-lg text-[#F7F5EB] font-semibold mt-4 sm:mt-6">
                No hiking or yoga experience required. Come as you are.
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
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Accommodation</span> – 2 nights in comfortable Lake District accommodation</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">All Meals</span> – Breakfasts, packed lunches, dinners, tea and coffee</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Guided Lake District Hikes</span> – Carefully selected routes with experienced guides</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Morning &amp; Evening Yoga</span> – Grounding movement, breathwork, restorative practices</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Mindfulness &amp; Reflection</span> – Gentle practices to help you slow down</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Small Group Experience</span> – A relaxed environment for genuine connection</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Unstructured Time</span> – Plenty of space to rest, wander, or simply be</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Optional */}
          <motion.div {...fadeInUp} className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 sm:mb-6">Optional</h2>
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-4 sm:p-6 md:p-8">
              <ul className="space-y-4">
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Extra Night to Extend Your Stay</span> – Free!</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Additional Time to Explore</span> – The Lake District</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                  <span className="text-base sm:text-lg"><span className="text-[#F7F5EB] font-semibold">Local Transport Assistance</span> – Where needed</span>
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
                  <span className="text-base sm:text-lg font-semibold text-[#F7F5EB]">Travel to and from the Lake District</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✗</span>
                  <span className="text-base sm:text-lg font-semibold text-[#F7F5EB]">Travel insurance</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✗</span>
                  <span className="text-base sm:text-lg font-semibold text-[#F7F5EB]">Personal hiking clothing and gear</span>
                </li>
                <li className="flex items-start text-[#DCCCA3]">
                  <span className="text-[#C65D2B] mr-3 text-xl">✗</span>
                  <span className="text-base sm:text-lg font-semibold text-[#F7F5EB]">Personal expenses</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Just Show Up */}
          <motion.div {...fadeInUp} className="mb-12 text-center">
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-6 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 uppercase tracking-wide">Just Show Up</h2>
              <p className="text-base sm:text-lg text-[#DCCCA3] leading-relaxed mb-4 max-w-2xl mx-auto">
                We've taken care of the details. You don't need to plan the hikes, organise the meals, or figure out what's next. You don't need to be productive.
              </p>
              <p className="text-base sm:text-lg text-[#DCCCA3] leading-relaxed mb-4 max-w-2xl mx-auto">
                Just bring yourself, comfortable clothes, and an openness to slow down. We'll take care of everything else.
              </p>
              <p className="text-lg sm:text-xl text-[#F7F5EB] font-semibold">
                Come for the mountains. Stay for the feeling of coming back to yourself.
              </p>
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
              {/* Rugilė Bazytė - Guide & Yoga Instructor */}
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
                    src="/images/retreat/Rue007.jpeg"
                    alt="Rugilė Bazytė - Adventure Guide & Yoga Instructor"
                    className="w-36 h-36 md:w-44 md:h-44 mx-auto rounded-full object-cover border-4 border-[#C65D2B]/50"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop";
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#F7F5EB]">Rugilė Bazytė</h3>
                <p className="text-[#C65D2B] font-semibold mb-3">Adventure Guide &amp; Yoga Instructor</p>
                <p className="text-[#DCCCA3] text-sm leading-relaxed">
                  Rugilė is the heart behind these adventures — an experienced hiker, mountain lover, and organizer who has spent years exploring some of the most spectacular trails across Europe. Her retreats bring together her passion for the outdoors, mindful living, and genuine human connection. Known for her calm presence and safety-first approach, she creates experiences that are both grounding and unforgettable — where challenge meets serenity, and every step leads you closer to nature and yourself.
                </p>
              </motion.div>

              {/* Dominykas Svirskas - Private Chef */}
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
                    src="/images/homepage/dominykas.png"
                    alt="Dominykas Svirskas - Private Chef"
                    className="w-36 h-36 md:w-44 md:h-44 mx-auto rounded-full object-cover border-4 border-[#C65D2B]/50"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#F7F5EB]">Dominykas Svirskas</h3>
                <p className="text-[#C65D2B] font-semibold mb-3">Private Chef</p>
                <p className="text-[#DCCCA3] text-sm leading-relaxed">
                  Meet Dominykas - our retreat Chef whose passion for food goes far beyond flavor. With experience in several Michelin-starred kitchens and now leading one of London's most renowned restaurants, he brings exceptional culinary artistry to our retreats. Dominykas crafts clean, wholesome, and deeply nourishing meals tailored to support your body's needs throughout the journey - helping you feel energized, balanced, and truly cared for from the inside out.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Closing CTA */}
          <motion.div {...fadeInUp} className="text-center bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-6 sm:p-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-2">Come for the mountains.</h3>
            <p className="text-[#DCCCA3] mb-6">Stay for the feeling of coming back to yourself.</p>
            <RegisterButton label="Reserve My Spot Now" />
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default LakeDistrictRetreatPage;
