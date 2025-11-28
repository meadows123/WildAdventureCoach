import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RetreatsPage = () => {
  const [capacityData, setCapacityData] = useState({});

  // API URL - for localhost, default to http://localhost:4242 if not set
  const API_URL = import.meta.env.VITE_API_URL || 
    (import.meta.env.DEV ? 'http://localhost:4242' : '');

  // Map retreat titles to their database names
  // Database has: "Hiking & Yoga Retreat Chamonix" and "Hiking and Yoga Retreat - August"
  const getRetreatDatabaseName = (retreatTitle) => {
    const mapping = {
      'Hiking and Yoga Retreat in Chamonix': 'Hiking & Yoga Retreat Chamonix',
      'Hiking & Yoga Retreat - Tour du Mont Blanc': 'Hiking and Yoga Retreat - August'
    };
    return mapping[retreatTitle] || retreatTitle;
  };

  // Define retreats array (moved before useEffect)
  const retreats = [
    {
      id: 'july-retreat',
      title: 'Hiking and Yoga Retreat in Chamonix',
      location: 'Chamonix, French Alps',
      duration: '6 days / 5 nights',
      dates: 'June 4 - 9, 2026',
      participants: 'Up to 10 people',
      description: 'An transformative 6-day alpine adventure combining mindful movement, breathtaking hikes, a introduction to climbing and daily restorative yoga. Escape the noise of daily life and immerse yourself in an environment that challenges the body, clears the mind, and creates space for meaningful connection. Designed for busy professionals seeking clarity, adventure, and renewal.',
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
        '/images/retreat/4.png',
        '/images/retreat/1.jpg',
        '/images/retreat/2.jpg',
        '/images/retreat/5.jpg',
        '/images/retreat/Train.webp',
        '/images/retreat/Outside1.webp',
        '/images/retreat/Outside3.webp',
        '/images/retreat/Kitchen.webp',
        '/images/retreat/Hallway.webp',
        '/images/retreat/Bedroom.webp',
        '/images/retreat/Bedroom1.webp',
        '/images/retreat/Bathroom1.webp'
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
          price: 1750,
          deposit: 250,
          description: 'Single occupancy in a double room'
        }
      ]
    },
    {
      id: 'august-retreat',
      title: 'Hiking & Yoga Retreat - Tour du Mont Blanc',
      location: 'Chamonix - French, Italian & Swiss Alps',
      duration: '6 days / 5 nights',
      dates: 'August 6–11, 2026',
      participants: 'Up to 10 people',
      description: '4 iconic stages of the Tour du Mont Blanc covering 65 km across France and Italy. 15 km each day and 1000 D+ each day. Good fitness level is required.',
      status: 'upcoming',
      price: '£1,499',
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

  // Fetch capacity data for all retreats
  useEffect(() => {
    const fetchCapacity = async () => {
      // Get all unique retreat database names from the retreats array
      const retreatDatabaseNames = retreats
        .map(retreat => getRetreatDatabaseName(retreat.title))
        .filter((name, index, self) => self.indexOf(name) === index); // Remove duplicates

      const capacityPromises = retreatDatabaseNames.map(async (retreatName) => {
        try {
          const response = await fetch(`${API_URL}/retreat-capacity/${retreatName}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          return { [retreatName]: data };
        } catch (error) {
          console.error(`Error fetching capacity for ${retreatName}:`, error);
          return { [retreatName]: null };
        }
      });

      const results = await Promise.all(capacityPromises);
      const combined = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setCapacityData(combined);
    };

    fetchCapacity();

    // Set up automatic refresh every 30 seconds
    const interval = setInterval(fetchCapacity, 30000);
    return () => clearInterval(interval);
  }, [API_URL]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  // Component for individual retreat card - Horizontal Banner Style
  const RetreatCard = ({ retreat }) => {
    const isJune = retreat.id === 'july-retreat' || retreat.title.includes('Chamonix');
    const isAugust = retreat.id === 'august-retreat' || retreat.title.includes('August') || retreat.title.includes('Tour du Mont Blanc');
    
    // Determine fitness level text
    const fitnessLevel = retreat.beginnerFriendly ? 'Beginner Friendly' : 'Moderate to Advanced';

    // Get capacity data for this retreat - works for all retreats
    const retreatDatabaseName = getRetreatDatabaseName(retreat.title);
    const capacity = capacityData[retreatDatabaseName];
    const availableSpots = capacity?.availableSpots;
    const maxCapacity = capacity?.maxCapacity;

    return (
      <motion.div
        {...fadeInUp}
        className="bg-[#6B8E23]/10 backdrop-blur-sm rounded-xl overflow-visible border border-[#6B8E23]/30 flex flex-col sm:flex-row min-h-[240px] sm:h-[180px] md:h-[200px] relative"
      >
        {/* Single Image - Left Side */}
        <div className="w-full sm:w-40 md:w-48 h-full flex-shrink-0 rounded-l-xl relative">
          {/* Deposit Badge - Top of Image (June and August) */}
          {(isJune || isAugust) && (
            <div className="absolute -top-2 left-2 sm:-top-2 sm:left-2 z-20">
              <span className="px-3 py-1 text-xs sm:text-sm font-semibold text-[#F7F5EB] bg-gradient-to-r from-[#C65D2B] to-[#E07B4B] rounded-full whitespace-nowrap shadow-lg border-2 border-[#6B8E23]/50">
                £250 Deposit
              </span>
            </div>
          )}
          <img
            src={retreat.images[0]}
            alt={retreat.title}
            className="w-full h-full object-cover rounded-l-xl"
          />
        </div>

        {/* Content - Right Side */}
        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4 rounded-r-xl">
          {/* Left Column: Title and Info */}
          <div className="flex-1 min-w-0">
            {/* Retreat Name */}
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#C65D2B] mb-2 sm:mb-2 leading-tight">
              {retreat.title.replace('Mont Blanc', 'Mont\u00A0Blanc')}
            </h2>
            
            {/* Info Icons Row */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-[#DCCCA3]">
              {/* Date */}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#6B8E23] flex-shrink-0" />
                <span className="text-[#F7F5EB] font-medium">{retreat.dates}</span>
              </div>
              
              {/* Location */}
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#6B8E23] flex-shrink-0" />
                <span className="text-[#F7F5EB]">{retreat.location.replace('Mont Blanc', 'Mont\u00A0Blanc')}</span>
              </div>
              
              {/* Fitness Level */}
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#6B8E23] flex-shrink-0" />
                <span className="text-[#F7F5EB]">{fitnessLevel}</span>
              </div>
            </div>

            {/* Spots Remaining - Show if data is available */}
            {availableSpots !== null && availableSpots !== undefined && maxCapacity && (
              <div className="mt-3 pt-3 border-t border-[#6B8E23]/30">
                <div className="flex items-center gap-2">
                  <span className="text-[#F7F5EB] font-semibold text-sm">⚡</span>
                  <span className="text-[#F7F5EB] font-semibold text-sm">
                    {availableSpots} spot{availableSpots === 1 ? '' : 's'} remaining
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Button */}
          <div className="flex-shrink-0">
            {isJune ? (
              <Link to="/retreat/chamonix" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Button 
                  className="w-full sm:w-auto text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg transition-all touch-manipulation bg-[#C65D2B] hover:bg-[#C65D2B]/90 hover:shadow-xl active:scale-95 text-[#F7F5EB] whitespace-nowrap min-h-[48px]"
                >
                  Join The Experience
                </Button>
              </Link>
            ) : isAugust ? (
              <Link to="/retreat/august" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Button 
                  className="w-full sm:w-auto text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg transition-all touch-manipulation bg-[#C65D2B] hover:bg-[#C65D2B]/90 hover:shadow-xl active:scale-95 text-[#F7F5EB] whitespace-nowrap min-h-[48px]"
                >
                  Join the Experience
                </Button>
              </Link>
            ) : (
              <Link to={`/booking?retreat=${encodeURIComponent(retreat.title)}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Button 
                  className="w-full sm:w-auto text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg transition-all touch-manipulation bg-[#C65D2B] hover:bg-[#C65D2B]/90 hover:shadow-xl active:scale-95 text-[#F7F5EB] whitespace-nowrap min-h-[48px]"
                >
                  Join The Experience
                </Button>
              </Link>
            )}
          </div>
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
            className="text-center mb-8 sm:mb-12"
            >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-[#F7F5EB] px-4">
              Our Retreats
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#DCCCA3] max-w-3xl mx-auto px-4">
              Join us for an unforgettable adventure through the stunning landscapes of Mont&nbsp;Blanc
            </p>
          </motion.div>

          <div className="space-y-4 sm:space-y-6 mb-16 sm:mb-24">
            {retreats.map((retreat) => (
              <RetreatCard key={retreat.id} retreat={retreat} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RetreatsPage;