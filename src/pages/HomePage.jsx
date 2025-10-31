import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Heart, Users, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [widgetKey, setWidgetKey] = useState(0);

  // Load Behold.so widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://w.behold.so/widget.js';
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://w.behold.so/widget.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Animation variants for scroll effects
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const reviews = [
    {
      id: 1,
      name: "Sarah M.",
      retreat: "Mont Blanc Retreat, 2025",
      review: "This retreat completely changed my perspective on life. The combination of challenging hikes and mindful practices helped me discover strength I never knew I had.",
      initial: "S",
      rating: 5
    },
    {
      id: 2,
      name: "Marcus L.",
      retreat: "Rocky Mountains Retreat, 2025",
      review: "The group dynamic was incredible. I made lifelong friends while pushing my limits in the most beautiful mountain setting. Highly recommend!",
      initial: "M",
      rating: 5
    },
    {
      id: 3,
      name: "Emma R.",
      retreat: "Yoga & Hiking Retreat, 2025",
      review: "Perfect balance of adventure and mindfulness. The yoga sessions at sunrise were magical, and the hiking challenged me in the best way possible.",
      initial: "E",
      rating: 5
    },
    {
      id: 4,
      name: "James K.",
      retreat: "Mont Blanc Retreat, 2025",
      review: "Absolutely incredible experience! The guides were knowledgeable and supportive. The views were breathtaking and the group atmosphere was amazing.",
      initial: "J",
      rating: 5
    },
    {
      id: 5,
      name: "Lisa T.",
      retreat: "Rocky Mountains Retreat, 2025",
      review: "Life-changing experience! I pushed myself beyond what I thought possible and came back with new confidence and lifelong memories.",
      initial: "L",
      rating: 5
    }
  ];

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const features = [
    {
      icon: Compass,
      title: 'Guided Adventures',
      description: 'Expert-led expeditions through breathtaking landscapes'
    },
    {
      icon: Heart,
      title: 'Wellness Focus',
      description: 'Mindful practices combined with outdoor exploration'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with like-minded adventurers and nature lovers'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Wild Adventure Coach - Transform Your Life Through Nature</title>
        <meta name="description" content="Join our transformative adventure retreats. Reconnect with nature, discover your inner strength, and embark on life-changing journeys." />
      </Helmet>

      <div className="min-h-screen">
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover opacity-40"
              alt="Mountain adventure landscape with hikers"
             src="https://images.unsplash.com/photo-1612003023592-7b989fc384ea" />
          </div>
          
          <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-3 sm:mb-4"
            >
              <img 
                src="/images/homepage/ChatGPT Image Oct 14, 2025 at 04_56_40 PM.png" 
                alt="Wild Adventure Coach" 
                className="h-24 sm:h-32 md:h-40 w-auto mx-auto"
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-[#F7F5EB] leading-tight"
            >
              Wild Adventure Coach
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-[#DCCCA3] px-2"
            >
              Step outside the ordinary - move, breathe, and rediscover your wild side
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/retreats" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Button className="bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB] text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full w-auto touch-manipulation">
                  Explore Retreats <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4 bg-[#2E4A34]">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              {...scaleIn}
              className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#F7F5EB]"
            >
              Why Choose Wild Adventure
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="bg-[#6B8E23]/20 backdrop-blur-sm p-8 rounded-2xl border border-[#6B8E23]/30 hover:border-[#C65D2B]/50 transition-all"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                  >
                    <feature.icon className="w-12 h-12 text-[#C65D2B] mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3 text-[#F7F5EB]">{feature.title}</h3>
                  <p className="text-[#DCCCA3]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gradient-to-b from-[#2E4A34] to-[#1a2d20]">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div {...fadeInLeft}>
                <img 
                  className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                  alt="Adventure coach leading group in nature"
                 src="/images/journey/journey.jpg" />
              </motion.div>
              
              <motion.div {...fadeInRight}>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#F7F5EB]">
                  Your Journey Starts Here
                </h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-lg text-[#DCCCA3] mb-6"
                >
                  Our retreats are designed to push your boundaries, reconnect you with nature, 
                  and help you discover strengths you never knew you had.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-lg text-[#DCCCA3] mb-8"
                >
                  Whether you're seeking adventure, personal growth, or simply a break from 
                  the everyday, we create transformative experiences in stunning natural settings.
                </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="space-y-4 text-center"
            >
              <Link to="/retreats" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Button className="bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB] text-lg px-8 py-6 rounded-full">
                  Start Your Adventure
                </Button>
              </Link>
              <p className="text-[#6B8E23] font-semibold">
                💳 Secure your spot with just £250 deposit
              </p>
            </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-[#1a2d20]">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div {...fadeInLeft}>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#F7F5EB]">
                  Meet Your Host
                </h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-lg text-[#DCCCA3] mb-6"
                >
                  Get to know Rugile, your experienced guide on this transformative journey
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-[#F7F5EB]">Rugile</h3>
                  <p className="text-[#C65D2B] font-semibold text-lg">Adventure Host & Guide</p>
                  <p className="text-lg text-[#DCCCA3]">
                    An experienced hiker with a deep passion for nature and human connection, Rugile brings years of expertise navigating some of the world's most breathtaking trails. Her love for the mountains is matched only by her commitment to creating meaningful experiences that bring people together.
                  </p>
                  <p className="text-lg text-[#DCCCA3]">
                    Through shared adventures in nature's most stunning landscapes, Rugile believes in the transformative power of connection—with the wilderness, with others, and with ourselves. Her guided retreats are designed to challenge you physically while nurturing your spirit and fostering authentic human bonds that last long after you return home.
                  </p>
                </motion.div>
              </motion.div>
              
              <motion.div {...fadeInRight}>
                <img 
                  src="/images/homepage/rugile.jpg" 
                  alt="Rugile - Adventure Host"
                  className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                  onError={(e) => {
                    // Fallback if image not found
                    e.target.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop";
                  }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-[#2E4A34]">
          <div className="max-w-6xl mx-auto">
            <motion.div
              {...fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#F7F5EB]">
                What Our Adventurers Say
              </h2>
              <p className="text-lg text-[#DCCCA3] max-w-2xl mx-auto">
                Hear from those who've experienced the transformative power of our retreats
              </p>
            </motion.div>

            {/* Reviews Slider */}
            <motion.div
              {...fadeInUp}
              className="relative max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20 px-2 sm:px-0"
            >
              {/* Google Logo */}
              <div className="flex items-center justify-center mb-6 sm:mb-8">
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-[#F7F5EB] font-semibold text-base sm:text-lg md:text-xl">Google Reviews</span>
                </div>
              </div>

              {/* Review Card */}
              <div className="relative bg-[#6B8E23]/10 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-[#6B8E23]/30">
                <motion.div
                  key={currentReview}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="text-center px-8 sm:px-0"
                >
                  {/* Stars */}
                  <div className="flex items-center justify-center mb-4 sm:mb-6">
                    {[...Array(reviews[currentReview].rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-[#C65D2B] mr-0.5 sm:mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Review Text */}
                  <blockquote className="text-[#DCCCA3] mb-6 sm:mb-8 italic text-base sm:text-lg md:text-xl leading-relaxed">
                    "{reviews[currentReview].review}"
                  </blockquote>

                  {/* Reviewer Info */}
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#C65D2B] rounded-full flex items-center justify-center text-[#F7F5EB] font-bold text-lg sm:text-xl md:text-2xl mr-3 sm:mr-4 flex-shrink-0">
                      {reviews[currentReview].initial}
                    </div>
                    <div className="text-left">
                      <p className="text-[#F7F5EB] font-semibold text-base sm:text-lg md:text-xl">{reviews[currentReview].name}</p>
                      <p className="text-[#DCCCA3] text-xs sm:text-sm">{reviews[currentReview].retreat}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevReview}
                  className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 bg-[#2E4A34]/90 hover:bg-[#2E4A34] text-[#F7F5EB] p-2 sm:p-3 rounded-full transition-all duration-300 touch-manipulation active:scale-95"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                
                <button
                  onClick={nextReview}
                  className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 bg-[#2E4A34]/90 hover:bg-[#2E4A34] text-[#F7F5EB] p-2 sm:p-3 rounded-full transition-all duration-300 touch-manipulation active:scale-95"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-4 sm:mt-6 space-x-1.5 sm:space-x-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReview(index)}
                    className={`h-2 sm:h-3 rounded-full transition-all duration-300 touch-manipulation ${
                      index === currentReview
                        ? 'bg-[#C65D2B] w-6 sm:w-8'
                        : 'bg-[#F7F5EB]/50 hover:bg-[#F7F5EB] w-2 sm:w-3'
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="pt-0 pb-20 px-4 bg-[#2E4A34] -mt-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              {...fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#F7F5EB]">
                Follow Our Adventures
              </h2>
              <p className="text-lg text-[#DCCCA3] max-w-2xl mx-auto mb-8">
                Join our community on Instagram for daily inspiration, behind-the-scenes moments, 
                and stunning photos from our wilderness retreats around the world.
              </p>
              <a 
                href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white text-lg px-10 py-6 rounded-full">
                  <Instagram className="mr-2 w-6 h-6" />
                  Follow @wildadventurecoach
                </Button>
              </a>
            </motion.div>

            {/* Instagram Feed - Live Posts Display */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <div className="bg-[#2E4A34]/20 rounded-2xl p-6 border border-[#6B8E23]/30">
                {/* Behold Instagram Widget Container */}
                <div className="relative">
                  <behold-widget 
                    key={widgetKey}
                    feed-id="HCORB1MWEwlLPlGxkCWB"
                    className="rounded-lg overflow-hidden"
                    style={{ minHeight: '400px' }}
                  ></behold-widget>
                  
                  {/* Refresh Button */}
                  <button
                    onClick={() => {
                      setWidgetKey(prev => prev + 1);
                      // Also try to refresh the widget directly
                      const widget = document.querySelector('behold-widget');
                      if (widget) {
                        widget.setAttribute('feed-id', 'HCORB1MWEwlLPlGxkCWB');
                      }
                    }}
                    className="absolute top-2 right-2 bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
                    title="Refresh Instagram feed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                {/* Note: Instagram feed configured with ID: wildadventurecoach */}
                <div className="text-center mt-6 p-6 bg-[#2E4A34]/30 rounded-lg">
                  <p className="text-[#DCCCA3] mb-4">
                    📸 Live Instagram feed from <a href="https://www.instagram.com/wildadventurecoach/" target="_blank" rel="noopener noreferrer" className="text-[#C65D2B] hover:underline font-semibold">@wildadventurecoach</a>
                  </p>
                  <p className="text-[#DCCCA3] text-sm mb-6">
                    If the feed doesn't appear above, make sure you've set up your Behold.so account and connected your Instagram profile.
                  </p>
                  <a 
                    href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2">
                      <Instagram className="w-5 h-5" />
                      <span className="font-semibold">Visit Instagram Profile</span>
                    </div>
                  </a>
                </div>
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

export default HomePage;