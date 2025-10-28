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

  const retreats = [
    {
      id: 'july-retreat',
      title: 'Hiking and Yoga Retreat in Chamonix',
      location: 'Chamonix, French Alps',
      duration: '6 days / 5 nights',
      dates: 'June 4 - 9, 2026',
      participants: 'Up to 10 people',
      description: 'A transformative 6-day alpine adventure combining mindful movement, breathtaking hikes, introduction to climbing and daily restorative yoga. Escape the noise of daily life and immerse yourself in an environment that challenges the body, clears the mind, and creates space for meaningful connection. Designed for busy professionals seeking clarity, adventure, and renewal.',
      status: 'upcoming',
      price: '£1,250',
      priceNote: 'per person',
      beginnerFriendly: true,
      included: [
        "Accommodation – Stay in a cozy alpine chalet with breathtaking views and modern comfort.",
        "Daily Guided Hikes & Yoga Sessions – Experience the perfect balance of challenge and restoration each day.",
        "Meditation & Self-Reflection Sessions – Guided moments to help you unwind, recharge, and reconnect with what truly matters.",
        "Introduction to Climbing – Learn the basics and feel the thrill of scaling alpine rock in a supportive setting.",
        "Aiguille du Midi Cable Car Experience – Soar to 3,842 meters and take in one of the most awe-inspiring panoramas in the Alps - a moment you'll never forget.",
        "All Meals, Packed Lunches & Tea/Coffee – Wholesome, nourishing food prepared by our private chef designed to fuel the body and mind.",
        "Honesty Bar at the Chalet – A self-serve corner stocked with healthy snacks and natural energy bars available for purchase anytime."
      ],
      optional: [
        "Airport Transfers & Local Transport – We'll gladly help arrange transfers or local transportation upon request to make your journey seamless and stress-free.",
        "Optional Activities – Paragliding, spa treatments, massages, and more. Discounts may be available upon request (e.g., 15% off paragliding) for those who want to extend their adventure."
      ],
      notIncluded: [
        'Flights',
        'Airport transfer',
        'Insurance',
        'Personal gear'
      ],
      images: [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop',
        '/images/retreat/1.jpg',
        '/images/retreat/2.jpg',
        '/images/retreat/3.jpg',
        '/images/retreat/4.png'
      ],
      accommodationOptions: [
        {
          name: 'Basic Single',
          price: 1250,
          deposit: 250,
          description: 'Single bed in a shared room (up to 3 total), ensuite bathroom'
        },
        {
          name: 'Economy Single',
          price: 1450,
          deposit: 250,
          description: 'One bed in a shared twin, same-gender accommodation'
        },
        {
          name: 'Double',
          price: 1700,
          deposit: 250,
          description: 'Single occupancy in a double room'
        }
      ]
    },
    {
      id: 'august-retreat',
      title: 'Hikiking & Yoga Retreat - Tour du Mont Blanc',
      location: 'Mont Blanc (France and Italy)',
      duration: '6 days / 5 nights',
      dates: 'August 30 - September 4, 2026',
      participants: '8-10 people',
      description: '4 iconic stages of the Tour du Mont Blanc covering 65 km across France and Italy. 15 km each day and 1000 D+ each day. Good fitness level is required.',
      status: 'upcoming',
      price: '£1,250',
      priceNote: 'per person',
      beginnerFriendly: false,
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
    }
  ];

  // API URL - since backend serves the frontend, use relative URLs in production
  const API_URL = import.meta.env.VITE_API_URL || '';

  // Component for individual retreat card
  const RetreatCard = ({ retreat }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [availableSpots, setAvailableSpots] = useState(null);
    const [maxCapacity, setMaxCapacity] = useState(9);
    const [soldOut, setSoldOut] = useState(false);
    const [waitlistEmail, setWaitlistEmail] = useState('');
    const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
    const [waitlistSuccess, setWaitlistSuccess] = useState(false);
    const isJune = retreat.id === 'july-retreat' || retreat.title.includes('Chamonix');
    const isAugust = retreat.id === 'august-retreat' || retreat.title.includes('August') || retreat.title.includes('Tour du Mont Blanc');

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

    const handleWaitlistSubmit = async (e) => {
      e.preventDefault();
      setWaitlistSubmitting(true);
      
      try {
        const response = await fetch(`${API_URL}/waitlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: waitlistEmail,
            retreat: retreat.title
          }),
        });

        if (response.ok) {
          setWaitlistSuccess(true);
          setWaitlistEmail('');
          setTimeout(() => setWaitlistSuccess(false), 5000);
        } else {
          throw new Error('Failed to join waitlist');
        }
      } catch (error) {
        console.error('Error joining waitlist:', error);
        alert('Failed to join waitlist. Please try again.');
      } finally {
        setWaitlistSubmitting(false);
      }
    };

    // Fetch available spots on page load
    useEffect(() => {
      console.log('Fetching capacity for:', retreat.title);
      fetch(`${API_URL}/retreat-capacity/${retreat.title}`)
        .then(res => {
          console.log('Response status:', res.status);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('Capacity data received:', data);
          setAvailableSpots(data.availableSpots);
          setMaxCapacity(data.maxCapacity || 9);
          setSoldOut(data.soldOut);
        })
        .catch(error => {
          console.error('Error fetching capacity:', error);
          // Set default values if fetch fails
          setAvailableSpots(9);
          setSoldOut(false);
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
          {/* Title for simplified retreats - outside carousel */}
          {(isJune || isAugust) && (
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#F7F5EB] leading-tight mb-4">
                {retreat.title}
              </h2>
              <div className="w-24 h-1 bg-[#C65D2B] mx-auto rounded-full"></div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
            {!(isJune || isAugust) && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#F7F5EB] leading-tight">{retreat.title}</h2>
            )}
            <div className="flex flex-wrap gap-2">
              {retreat.status === 'upcoming' && (
                <span className="px-4 py-2 text-sm font-semibold text-[#F7F5EB] bg-[#C65D2B] rounded-full">
                  UPCOMING
                </span>
              )}
              {retreat.beginnerFriendly && (
                <span className="px-4 py-2 text-sm font-semibold text-[#1a2d20] bg-[#6B8E23] rounded-full">
                  BEGINNER FRIENDLY
                </span>
              )}
            </div>
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
            <div className="mt-4 pt-4 border-t border-[#6B8E23]/40">
              {availableSpots !== null ? (
                <>
                  {soldOut ? (
                    <div className="flex items-center justify-center">
                      <span className="text-[#C65D2B] font-bold text-lg">🔴 SOLD OUT</span>
                    </div>
                  ) : (
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
                  )}
                </>
              ) : (
                <div className="bg-[#6B8E23]/30 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#F7F5EB] font-semibold text-lg">Spots Remaining:</span>
                    <span className="text-[#DCCCA3] text-lg">Loading...</span>
                  </div>
                </div>
              )}
            </div>
                    </div>
                    
          <p className="text-[#DCCCA3] text-lg mb-8 leading-relaxed">
            {isJune
              ? 'A transformative 6-day alpine adventure combining mindful movement, breathtaking hikes, introduction to climbing and daily restorative yoga.'
              : isAugust
              ? '4 iconic stages of the Tour du Mont Blanc covering 65 km across France and Italy. 15 km each day and 1000 D+ each day. Good fitness level is required.'
              : retreat.description}
          </p>
          
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
            <div className="bg-[#C65D2B]/20 border border-[#C65D2B]/40 rounded-lg p-6 mb-8 text-center">
              <div className="mb-1">
                <p className="text-xs text-[#DCCCA3] uppercase font-semibold mb-2">Deposit</p>
                <p className="text-4xl md:text-5xl font-bold text-[#F7F5EB]">£250 deposit</p>
              </div>
              <p className="text-[#DCCCA3] text-xs">Remaining balance due closer to the retreat date</p>
              
              {/* Super Early Bird banner for August retreat */}
              {isAugust && (
                <div className="mt-4 pt-4 border-t border-[#C65D2B]/40">
                  <div className="bg-gradient-to-r from-[#6B8E23]/40 to-[#C65D2B]/20 border-2 border-[#6B8E23] rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-2xl mr-2">⚡</span>
                      <p className="text-sm text-[#6B8E23] uppercase font-bold tracking-wide">Super Early Bird</p>
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-[#F7F5EB] mb-1">£1,250</p>
                    <p className="text-xs text-[#DCCCA3] font-medium">Total Price</p>
                  </div>
                          </div>
              )}
                          </div>
          )}

          {/* Accommodation Options - hide for simplified cards */}
          {retreat.accommodationOptions && !(isJune || isAugust) && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#F7F5EB] mb-4">Choose Your Accommodation</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {retreat.accommodationOptions.map((option, index) => (
                  <div
                    key={index}
                    className="bg-[#6B8E23]/10 border-2 border-[#6B8E23]/30 rounded-lg p-6 hover:border-[#C65D2B]/50 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-[#F7F5EB] text-lg">{option.name}</h4>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-2xl font-bold text-[#C65D2B]">£{option.deposit}</span>
                          <span className="text-sm text-[#DCCCA3]">deposit</span>
                        </div>
                      </div>
                      <p className="text-[#DCCCA3] text-sm">{option.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-[#6B8E23]/20">
                        <span className="text-[#DCCCA3] text-sm">Full Price:</span>
                        <span className="text-[#F7F5EB] font-semibold">£{option.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#6B8E23]/20 border border-[#6B8E23]/40 rounded-lg px-4 py-3 mt-4">
                <p className="text-center text-[#DCCCA3] text-sm">
                  All options secure your spot with a £250 deposit. You'll select your preferred accommodation during booking.
                </p>
              </div>
            </div>
          )}

          {/* What's Included Section - hide for simplified cards */}
          {retreat.included && !(isJune || isAugust) && (
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

          {/* Optional Section - hide for simplified cards */}
          {retreat.optional && retreat.optional.length > 0 && !(isJune || isAugust) && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#F7F5EB] mb-4">Optional</h3>
              <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-6">
                <ul className="space-y-3">
                  {retreat.optional.map((item, index) => (
                    <li key={index} className="flex items-start text-[#DCCCA3]">
                      <span className="text-[#C65D2B] mr-3 text-xl">✓</span>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Not Included Section - hide for simplified cards */}
          {retreat.notIncluded && !(isJune || isAugust) && (
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

          {/* What to Expect - August simplified section */}
          {isAugust && (
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-[#F7F5EB] mb-4">What to Expect</h3>
              <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-6">
                <ul className="space-y-3 text-[#DCCCA3] text-lg">
                  <li>🏔️ 4 Iconic Stages – Complete the legendary Tour du Mont Blanc across France and Italy</li>
                  <li>🥾 Daily Challenges – 15 km each day with 1000m elevation gain</li>
                  <li>🧘‍♀️ Yoga & Mindfulness – Daily sessions to restore and balance your body</li>
                  <li>🏨 Comfortable Accommodation – 5 nights in quality mountain lodges</li>
                  <li>🍽️ All Meals Included – 3 nutritious meals per day to fuel your adventure</li>
                  <li>👥 Small Group Experience – Maximum 10 participants for personalized attention</li>
                </ul>
              </div>
            </div>
          )}

          {/* What to Expect - June simplified section */}
          {isJune && (
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-[#F7F5EB] mb-4">What to Expect</h3>
              <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-lg p-6">
                <ul className="space-y-3 text-[#DCCCA3] text-lg">
                  <li>🏔 Daily Guided Hikes – Conquer scenic trails that push your limits and ground your mind</li>
                  <li>🧘‍♀️ Morning & Evening Yoga – Reconnect with your breath, body, and presence</li>
                  <li>🧗 Introduction to Climbing – Experience the thrill of climbing in a safe, supportive environment</li>
                  <li>🌿 Mindful Moments & Digital Detox – Meditation, journaling, and quiet reflection away from digital distractions</li>
                  <li>🤝 Community Connection – Share the journey with like-minded explorers and create memories that last long after the retreat ends</li>
                </ul>
              </div>
            </div>
          )}
          
          {!(isJune || isAugust) && soldOut ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-[#C65D2B] font-bold text-xl mb-4">🔴 Sold Out</p>
                <p className="text-[#DCCCA3] mb-6">Join our waitlist to be notified when spots become available or new dates are added!</p>
              </div>
              
              {waitlistSuccess ? (
                <div className="bg-[#6B8E23]/30 border border-[#6B8E23] rounded-lg p-4 text-center">
                  <p className="text-[#6B8E23] font-semibold">✓ Success! We'll keep you posted.</p>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[#2E4A34] border border-[#6B8E23] text-[#F7F5EB] placeholder:text-[#DCCCA3] focus:outline-none focus:ring-2 focus:ring-[#C65D2B]"
                  />
                  <Button
                    type="submit"
                    disabled={waitlistSubmitting}
                    className="w-full bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB] py-4 rounded-full disabled:opacity-50"
                  >
                    {waitlistSubmitting ? 'Joining...' : 'Join Waitlist'}
                  </Button>
                </form>
              )}
            </div>
          ) : (
            isJune ? (
              <Link to="/retreat/chamonix" className="block" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Button 
                  className="w-full text-base sm:text-lg md:text-xl py-4 sm:py-6 md:py-8 rounded-full shadow-lg transition-all touch-manipulation bg-[#C65D2B] hover:bg-[#C65D2B]/90 hover:shadow-xl active:scale-98 text-[#F7F5EB]"
                >
                  Find out more
                </Button>
              </Link>
            ) : isAugust ? (
              <Link to="/retreat/august" className="block" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Button 
                  className="w-full text-base sm:text-lg md:text-xl py-4 sm:py-6 md:py-8 rounded-full shadow-lg transition-all touch-manipulation bg-[#C65D2B] hover:bg-[#C65D2B]/90 hover:shadow-xl active:scale-98 text-[#F7F5EB]"
                >
                  Find out more
                </Button>
              </Link>
            ) : (
              <Link to={`/booking?retreat=${encodeURIComponent(retreat.title)}`} className="block" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Button 
                  className="w-full text-base sm:text-lg md:text-xl py-4 sm:py-6 md:py-8 rounded-full shadow-lg transition-all touch-manipulation bg-[#C65D2B] hover:bg-[#C65D2B]/90 hover:shadow-xl active:scale-98 text-[#F7F5EB]"
                >
                  Book This Retreat
                </Button>
              </Link>
            )
          )}
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
              Our Retreats
            </h1>
            <p className="text-xl text-[#DCCCA3] max-w-3xl mx-auto">
              Join us for an unforgettable adventure through the stunning landscapes of Mont Blanc
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-12">
            {retreats.map((retreat) => (
              <RetreatCard key={retreat.id} retreat={retreat} />
            ))}
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