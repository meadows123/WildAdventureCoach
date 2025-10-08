import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Heart, Users, Instagram, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
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
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-[#F7F5EB]"
            >
              Discover Your Wild Side
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-[#DCCCA3]"
            >
              Transform your life through adventure, nature, and self-discovery
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link to="/retreats">
                <Button className="bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB] text-lg px-8 py-6 rounded-full">
                  Explore Retreats <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4 bg-[#2E4A34]">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              {...fadeInUp}
              className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#F7F5EB]"
            >
              Why Choose Wild Adventure
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  {...fadeInUp}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-[#6B8E23]/20 backdrop-blur-sm p-8 rounded-2xl border border-[#6B8E23]/30 hover:border-[#C65D2B]/50 transition-all"
                >
                  <feature.icon className="w-12 h-12 text-[#C65D2B] mb-4" />
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
              <motion.div {...fadeInUp}>
                <img 
                  className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                  alt="Adventure coach leading group in nature"
                 src="https://images.unsplash.com/photo-1690924355813-f5f141bcd867" />
              </motion.div>
              
              <motion.div
                {...fadeInUp}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#F7F5EB]">
                  Your Journey Starts Here
                </h2>
                <p className="text-lg text-[#DCCCA3] mb-6">
                  Our retreats are designed to push your boundaries, reconnect you with nature, 
                  and help you discover strengths you never knew you had.
                </p>
                <p className="text-lg text-[#DCCCA3] mb-8">
                  Whether you're seeking adventure, personal growth, or simply a break from 
                  the everyday, we create transformative experiences in stunning natural settings.
                </p>
                <Link to="/booking">
                  <Button className="bg-[#DCCCA3] hover:bg-[#6B8E23]/90 text-[#F7F5EB] text-lg px-8 py-6 rounded-full">
                    Start Your Adventure
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-[#1a2d20]">
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
                {/* Behold Instagram Widget Container - Replace data-behold-id with your ID */}
                <div 
                  data-behold-id="REPLACE_WITH_YOUR_BEHOLD_ID"
                  className="rounded-lg overflow-hidden"
                  style={{ minHeight: '400px' }}
                ></div>
                
                {/* Fallback: Manual Instructions */}
                <div className="text-center mt-6 p-6 bg-[#2E4A34]/30 rounded-lg">
                  <p className="text-[#DCCCA3] mb-4">
                    📸 To display live Instagram posts from <a href="https://www.instagram.com/wildadventurecoach/" target="_blank" rel="noopener noreferrer" className="text-[#C65D2B] hover:underline font-semibold">@wildadventurecoach</a>:
                  </p>
                  <ol className="text-left text-[#DCCCA3] space-y-2 max-w-2xl mx-auto text-sm mb-6">
                    <li>1. Go to <a href="https://behold.so" target="_blank" rel="noopener noreferrer" className="text-[#C65D2B] hover:underline font-semibold">behold.so</a> (free)</li>
                    <li>2. Sign up and connect @wildadventurecoach</li>
                    <li>3. Get your Behold ID</li>
                    <li>4. Replace "REPLACE_WITH_YOUR_BEHOLD_ID" in HomePage.jsx line 175</li>
                    <li>5. Uncomment the script in index.html line 16</li>
                  </ol>
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

            {/* Recent posts grid (static placeholder - replace with actual post images) */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
            >
              {/* Instagram Post 1 */}
              <a 
                href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg relative group cursor-pointer block"
              >
                <img 
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=500"
                  alt="Wild adventure moment 1"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
              </a>

              {/* Instagram Post 2 */}
              <a 
                href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg relative group cursor-pointer block"
              >
                <img 
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500"
                  alt="Wild adventure moment 2"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
              </a>

              {/* Instagram Post 3 */}
              <a 
                href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg relative group cursor-pointer block"
              >
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500"
                  alt="Wild adventure moment 3"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
              </a>

              {/* Instagram Post 4 */}
              <a 
                href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg relative group cursor-pointer block"
              >
                <img 
                  src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500"
                  alt="Wild adventure moment 4"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
              </a>

              {/* Instagram Post 5 */}
              <a 
                href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg relative group cursor-pointer block"
              >
                <img 
                  src="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=500"
                  alt="Wild adventure moment 5"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
              </a>

              {/* Instagram Post 6 */}
              <a 
                href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg relative group cursor-pointer block"
              >
                <img 
                  src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=500"
                  alt="Wild adventure moment 6"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
              </a>

              {/* Instagram Post 7 */}
              <a 
                href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg relative group cursor-pointer block"
              >
                <img 
                  src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=500"
                  alt="Wild adventure moment 7"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
              </a>

              {/* Instagram Post 8 */}
              <a 
                href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg relative group cursor-pointer block"
              >
                <img 
                  src="https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=500"
                  alt="Wild adventure moment 8"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
              </a>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-8"
            >
              <p className="text-[#DCCCA3]">
                Tap any image to explore more on Instagram
              </p>
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

export default HomePage;