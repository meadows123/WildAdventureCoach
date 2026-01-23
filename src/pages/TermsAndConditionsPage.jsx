import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import TermsContent from '@/components/terms/TermsContent';

const TermsAndConditionsPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <>
      <Helmet>
        <title>Terms & Conditions | Wild Adventure Retreat</title>
        <meta name="description" content="Read our terms and conditions for Wild Adventure Retreat experiences" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] via-[#2E4A34] to-[#1A1A1A] opacity-50 z-0"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#F7F5EB] mb-4">
            Terms & Conditions
          </h1>
          <p className="text-base sm:text-lg text-[#DCCCA3] max-w-3xl mx-auto">
            Please read these terms carefully before booking your adventure
          </p>
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div {...fadeInUp}>
          <TermsContent />
        </motion.div>
      </section>
    </>
  );
};

export default TermsAndConditionsPage;
