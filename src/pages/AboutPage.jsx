import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const AboutPage = () => {
  // Animation variants
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

  return (
    <>
      <Helmet>
        <title>About - Wild Adventure Coach</title>
        <meta name="description" content="Learn about Wild Adventure Coach, our mission, and the experienced team behind transformative mountain retreats in the Alps." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="pt-16 sm:pt-20 md:pt-24 pb-12 mb-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-[#F7F5EB]">
              About Wild Adventure Coach
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#DCCCA3] max-w-3xl mx-auto">
              Where careful guidance, presence, and the restorative power of the mountains come together
            </p>
          </motion.div>
        </section>

        {/* WildAdventureCoach Vision Section */}
        <section className="pt-0 pb-20">
          <div className="px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div {...fadeInLeft}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#F7F5EB]">
                  WildAdventureCoach Vision
                </h2>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-4"
                >
                  <p className="text-base sm:text-lg text-[#DCCCA3] text-justify">
                    To empower people to reconnect with nature, challenge their limits, and rediscover balance through immersive hiking and yoga retreats in the wild.
                  </p>
                  <p className="text-base sm:text-lg text-[#DCCCA3] text-justify">
                    WildAdventureCoach creates transformational experiences that combine physical adventure, mindfulness, and community — guiding individuals to grow stronger, more grounded, and deeply connected.
                  </p>
                  <p className="text-base sm:text-lg text-[#DCCCA3] text-justify">
                    Our mission is to build a global community of conscious adventurers who live boldly, love deeply, and explore life with intention.
                  </p>
                </motion.div>
              </motion.div>
              
              <motion.div {...fadeInRight}>
                <img 
                  src="/images/vision/vision.jpg" 
                  alt="WildAdventureCoach Vision"
                  className="rounded-2xl shadow-2xl w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                  onError={(e) => {
                    // Fallback if image not found
                    e.target.src = "https://images.unsplash.com/photo-1612003023592-7b989fc384ea";
                  }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Where We Come From Section */}
        <section className="pt-0 pb-20">
          <div className="px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div {...fadeInLeft}>
                <div className="rounded-2xl shadow-2xl overflow-hidden aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube-nocookie.com/embed/fViimMmQNjw"
                    title="Eiger 2016 Documentary - Arturas Bazys"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </motion.div>

              <motion.div {...fadeInRight}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#F7F5EB]">
                  Where We Come From
                </h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-4"
                >
                  <p className="text-base sm:text-lg text-[#DCCCA3] text-justify">
                    Long before WildAdventureCoach became a name, it was a calling — shaped in the shadow of the Alps, among climbers, guides, and dreamers who measured themselves against the mountains.
                  </p>
                  <p className="text-base sm:text-lg text-[#DCCCA3] text-justify">
                    This documentary follows my father, alpinist Arturas Bazys, on his 2016 ascent of the Eiger's legendary North Face, one of the most demanding and storied climbs in the world. It captures the discipline, fear, and quiet resolve that define real mountain culture.
                  </p>
                  <p className="text-base sm:text-lg text-[#DCCCA3] text-justify">
                    We share it not as a tutorial, but as a window into where our respect for these peaks began, and the spirit we carry into every retreat we lead today.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
        </div>
      </div>
    </>
  );
};

export default AboutPage;

