import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Heart, Users, Instagram, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [widgetKey, setWidgetKey] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isReviewPaused, setIsReviewPaused] = useState(false);
  const [reviewProgress, setReviewProgress] = useState(0);

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
      name: "Pauline",
      retreat: "2025",
      review: "I loved these few days in full deconnection from my routine. Meeting new people was refreshing and inspiring. I particularly enjoyed how Rugile and Sandra made us experiencing the mountains together and challenging ourselves with so much care ❤️",
      initial: "P",
      rating: 5
    },
    {
      id: 2,
      name: "Charlie",
      retreat: "2025",
      review: "Amazing hikes in a beautiful part of the world, complimented by well-led yoga sessions to help relax and restore the legs at the end of the day. The group had people of all sorts of backgrounds and from a range of countries, but despite this we got along so well and I'm really grateful for deciding to go.",
      initial: "C",
      rating: 5
    },
    {
      id: 3,
      name: "Zivile",
      retreat: "2025",
      review: "I loved the whole travel program, the consistency, the clarity of what we would do and what would happen next. I really enjoyed the beautiful views and good weather. Rest in the rooms for two with amenities was much needed after a long day.",
      initial: "Z",
      rating: 5
    },
    {
      id: 4,
      name: "Rhoda",
      retreat: "2025",
      review: "For me, the retreat was a whole new way of experiencing the Alps. Rugile and Sandra brought a balanced approach of connecting with the environment, with the fellow hikers in the group and within myself. The routes and schedule were rewarding and challenging, in perfect measures and I made lasting new friendships and special memories.",
      initial: "R",
      rating: 5
    },
    {
      id: 5,
      name: "Kris",
      retreat: "Guest Review",
      review: `I joined this 6-day hiking and yoga retreat not quite knowing what to expect, and it exceeded everything I had in mind.

The hikes were challenging in the best way. Each day pushed me physically but always felt achievable. The routes were well planned, with incredible views and a real sense of progression through the week. The group moved with purpose but without ego, which created a supportive rather than competitive atmosphere.

The yoga sessions were a game changer. After long days on the trail, the mobility and recovery work made a noticeable difference. The classes balanced strength, stability, flexibility, and breathwork well. Even as someone fairly new to yoga, I felt completely comfortable.

What stood out most was the overall atmosphere: driven, outdoors-oriented people, great conversations and the satisfying kind of tiredness at the end of each day. It felt like a real reset, both physically and mentally.

I came back stronger, clearer, and already looking at dates for next year. Highly recommended for anyone who enjoys pushing themselves, values recovery, and wants a meaningful week in nature.`,
      initial: "K",
      rating: 5
    },
    {
      id: 6,
      name: "Zak",
      retreat: "Guest Review",
      review: `Rugile stands out in her professionalism and the care she brings to everything she organises. She has a natural ability to create a welcoming and supportive space where people feel comfortable, grounded, and open to personal growth and transformation. At the same time, she is extremely organised, well prepared, and attentive to detail, which creates a strong sense of trust and reliability for everyone involved.

Rugile's experience as a mountain guide is clearly reflected in the way she leads and plans activities, with confidence, responsibility, and a strong focus on safety and quality. She brings a rare combination of professionalism, structure, and genuine presence to the experiences she creates.`,
      initial: "Z",
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
      description: 'Expert-led expeditions through breathtaking landscapes',
      detail: 'Every route is crafted with care, blending challenge, safety, and unforgettable alpine views so each day feels purposeful.'
    },
    {
      icon: Heart,
      title: 'Wellness Focus',
      description: 'Mindful practices combined with outdoor exploration',
      detail: 'Yoga, mobility work, and breath-led recovery sessions help your body bounce back and your mind stay clear throughout the week.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with like-minded adventurers and nature lovers',
      detail: 'Expect a grounded, no-ego group culture where shared effort on the trail naturally turns into meaningful connection.'
    }
  ];

  useEffect(() => {
    if (isReviewPaused) {
      return;
    }

    const autoAdvanceInterval = setInterval(() => {
      setReviewProgress((prev) => {
        if (prev >= 100) {
          setCurrentReview((index) => (index + 1) % reviews.length);
          return 0;
        }
        return prev + 2;
      });
    }, 150);

    return () => clearInterval(autoAdvanceInterval);
  }, [isReviewPaused, reviews.length]);

  useEffect(() => {
    const handleArrowNavigation = (event) => {
      if (event.key === 'ArrowRight') {
        nextReview();
        setReviewProgress(0);
      }

      if (event.key === 'ArrowLeft') {
        prevReview();
        setReviewProgress(0);
      }
    };

    window.addEventListener('keydown', handleArrowNavigation);
    return () => window.removeEventListener('keydown', handleArrowNavigation);
  }, [reviews.length]);

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
          
          <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-4xl mx-auto py-8 sm:py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-4 sm:mb-4 md:mb-6"
            >
              <img 
                src="/images/homepage/ChatGPT Image Oct 14, 2025 at 04_56_40 PM.png" 
                alt="Wild Adventure Coach" 
                className="h-24 sm:h-32 md:h-40 lg:h-44 w-auto mx-auto"
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 text-[#F7F5EB] leading-tight px-2"
            >
              Wild Adventure Coach
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-10 md:mb-12 text-[#DCCCA3] px-3 sm:px-4"
            >
              Step outside the ordinary - move, breathe, and rediscover your wild side
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/retreats" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Button className="bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB] text-base sm:text-lg md:text-xl px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-full w-auto touch-manipulation min-h-[48px] active:scale-95 transition-transform">
                  Explore Retreats <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-[#2E4A34]">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              {...scaleIn}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 sm:mb-16 md:mb-20 text-[#F7F5EB]"
            >
              Why Choose Wild Adventure
            </motion.h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  onClick={() => setActiveFeature(index)}
                  className={`bg-[#6B8E23]/20 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-2xl border transition-all cursor-pointer ${
                    activeFeature === index
                      ? 'border-[#C65D2B] ring-2 ring-[#C65D2B]/30'
                      : 'border-[#6B8E23]/30 hover:border-[#C65D2B]/50'
                  }`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                  >
                    <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 text-[#C65D2B] mb-4" />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-[#F7F5EB]">{feature.title}</h3>
                  <p className="text-sm sm:text-base md:text-lg text-[#DCCCA3]">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mt-8 sm:mt-10 md:mt-12 max-w-4xl mx-auto bg-[#1a2d20]/70 border border-[#6B8E23]/40 rounded-2xl p-5 sm:p-7 md:p-8"
            >
              <p className="text-[#F7F5EB] text-lg sm:text-xl md:text-2xl font-semibold mb-3">
                {features[activeFeature].title}
              </p>
              <p className="text-[#DCCCA3] text-sm sm:text-base md:text-lg leading-relaxed">
                {features[activeFeature].detail}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gradient-to-b from-[#2E4A34] to-[#1a2d20]">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div {...fadeInLeft}>
                <img 
                  className="rounded-2xl shadow-2xl w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                  alt="Adventure coach leading group in nature"
                 src="/images/journey/journey.jpg" />
              </motion.div>
              
              <motion.div {...fadeInRight}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#F7F5EB]">
                  Your Journey Starts Here
                </h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-base sm:text-lg text-[#DCCCA3] mb-4 sm:mb-6 text-justify"
                >
                  Our retreats are designed to challenge your limits, reconnect you with nature, and help you uncover strengths you never knew you had.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-base sm:text-lg text-[#DCCCA3] mb-6 sm:mb-8 text-justify"
                >
                  Whether you’re seeking adventure, personal growth, or simply a break from the everyday, we offer transformative experiences set in breathtaking natural landscapes.
                </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="space-y-4 text-center"
            >
              <Link to="/retreats" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Button className="bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB] text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full w-full sm:w-auto touch-manipulation">
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
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#F7F5EB]">
                  Your Host
                </h2>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#F7F5EB]">Rugilė Bazytė</h3>
                  <p className="text-[#C65D2B] font-semibold text-base sm:text-lg">Adventure Host</p>
                  <p className="text-base sm:text-lg text-[#DCCCA3] text-justify">
                    For over twenty years, I've spent extensive time in the Alps, honing my skills in alpine terrain, high-altitude navigation, and mountain safety. I'm currently a Mountain Leader trainee and a certified Vinyasa Yoga instructor, combining technical expertise with mindful practice to guide journeys that are both safe and transformative.
                  </p>
                  <p className="text-base sm:text-lg text-[#DCCCA3] text-justify">
                    Raised in a family of experienced mountaineers, the mountains have been a central part of my life from an early age. This lifelong immersion inspired WildAdventureCoach, a space where careful guidance, presence, and the restorative power of the mountains come together. Leading a group through this environment is not just my work — it's a chance to share a meaningful experience, helping everyone feel confident, supported, and fully present in the journey.
                  </p>
                </motion.div>
              </motion.div>
              
              <motion.div {...fadeInRight}>
                <img 
                  src="/images/homepage/host_hq.jpg" 
                  alt="Rugilė - Adventure Host"
                  className="rounded-2xl shadow-2xl w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-[#F7F5EB]">
                Testimonials
              </h2>
              <p className="text-base sm:text-lg text-[#DCCCA3] max-w-2xl mx-auto px-4">
                Hear from those who've experienced the transformative power of our retreats
              </p>
            </motion.div>

            {/* Reviews Slider */}
            <motion.div
              {...fadeInUp}
              className="relative max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20 px-2 sm:px-0"
              onMouseEnter={() => setIsReviewPaused(true)}
              onMouseLeave={() => setIsReviewPaused(false)}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-[#DCCCA3] text-xs sm:text-sm">
                  {isReviewPaused ? 'Paused' : 'Auto-playing testimonials'}
                </p>
                <button
                  onClick={() => setIsReviewPaused((prev) => !prev)}
                  className="inline-flex items-center gap-2 text-[#F7F5EB] bg-[#2E4A34]/80 hover:bg-[#2E4A34] rounded-full px-3 py-1.5 text-xs sm:text-sm border border-[#6B8E23]/40"
                  aria-label={isReviewPaused ? 'Resume auto-play' : 'Pause auto-play'}
                >
                  {isReviewPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  {isReviewPaused ? 'Resume' : 'Pause'}
                </button>
              </div>

              <div className="h-1.5 w-full bg-[#F7F5EB]/20 rounded-full mb-4 overflow-hidden">
                <motion.div
                  className="h-full bg-[#C65D2B] rounded-full"
                  animate={{ width: `${reviewProgress}%` }}
                  transition={{ duration: 0.12, ease: 'linear' }}
                />
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
                  <blockquote className="text-[#DCCCA3] mb-6 sm:mb-8 italic text-base sm:text-lg md:text-xl leading-relaxed whitespace-pre-line">
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
                  onClick={() => {
                    prevReview();
                    setReviewProgress(0);
                  }}
                  className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 bg-[#2E4A34]/90 hover:bg-[#2E4A34] text-[#F7F5EB] p-2 sm:p-3 rounded-full transition-all duration-300 touch-manipulation active:scale-95"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                
                <button
                  onClick={() => {
                    nextReview();
                    setReviewProgress(0);
                  }}
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
                    onClick={() => {
                      setCurrentReview(index);
                      setReviewProgress(0);
                    }}
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-[#F7F5EB]">
                Follow Our Adventures
              </h2>
              <p className="text-base sm:text-lg text-[#DCCCA3] max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
                Join our community on Instagram for daily inspiration, behind-the-scenes moments, 
                and stunning photos from our wilderness retreats around the world.
              </p>
              <a 
                href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 rounded-full w-full sm:w-auto touch-manipulation">
                  <Instagram className="mr-2 w-5 h-5 sm:w-6 sm:h-6" />
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
                  <p className="text-[#DCCCA3] mb-6">
                    📸 Live Instagram feed from <a href="https://www.instagram.com/wildadventurecoach/" target="_blank" rel="noopener noreferrer" className="text-[#C65D2B] hover:underline font-semibold">@wildadventurecoach</a>
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
      </div>
    </>
  );
};

export default HomePage;