import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Scale, Shield, AlertCircle } from 'lucide-react';

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
          <div className="bg-[#1A1A1A]/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 md:p-10 border border-[#6B8E23]/20 space-y-8">
            
            {/* Introduction */}
            <div className="pb-6 border-b border-[#6B8E23]/20">
              <p className="text-[#DCCCA3] leading-relaxed">
                These terms and conditions govern your booking and participation in Wild Adventure Retreat experiences. 
                By making a booking, you agree to be bound by these terms.
              </p>
            </div>

            {/* Booking and Payment */}
            <div>
              <div className="flex items-center mb-4">
                <Scale className="w-6 h-6 text-[#C65D2B] mr-3" />
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">Booking and Payment</h2>
              </div>
              <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
                <p>
                  <strong className="text-[#F7F5EB]">Deposit:</strong> A non-refundable deposit is required to secure your place. 
                  The deposit amount varies by retreat and accommodation option.
                </p>
                <p>
                  <strong className="text-[#F7F5EB]">Balance Payment:</strong> The remaining balance must be paid at least 30 days before 
                  the retreat start date. Full payment is required for bookings made within 30 days of the retreat.
                </p>
                <p>
                  <strong className="text-[#F7F5EB]">Payment Methods:</strong> We accept all major credit and debit cards through our 
                  secure payment gateway.
                </p>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div>
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-[#C65D2B] mr-3" />
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">Cancellation Policy</h2>
              </div>
              <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
                <p>
                  <strong className="text-[#F7F5EB]">By You:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>More than 60 days before retreat: Full refund minus deposit</li>
                  <li>30-60 days before retreat: 50% refund</li>
                  <li>Less than 30 days before retreat: No refund</li>
                </ul>
                <p>
                  <strong className="text-[#F7F5EB]">By Us:</strong> In the unlikely event that we need to cancel a retreat, 
                  you will receive a full refund or the option to transfer to another retreat date.
                </p>
              </div>
            </div>

            {/* Health and Safety */}
            <div>
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-[#C65D2B] mr-3" />
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">Health and Safety</h2>
              </div>
              <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
                <p>
                  <strong className="text-[#F7F5EB]">Physical Requirements:</strong> Participants must be in good physical condition 
                  and over 18 years of age. Some retreats may have specific age restrictions or fitness requirements.
                </p>
                <p>
                  <strong className="text-[#F7F5EB]">Medical Conditions:</strong> You must inform us of any medical conditions, 
                  allergies, or medications that may affect your participation before booking.
                </p>
                <p>
                  <strong className="text-[#F7F5EB]">Personal Responsibility:</strong> All activities are undertaken at your own risk. 
                  You are responsible for following all safety instructions provided by guides.
                </p>
              </div>
            </div>

            {/* Travel Insurance */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4">Travel Insurance</h2>
              <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
                <p>
                  We strongly recommend that you have comprehensive travel insurance covering adventure activities, 
                  cancellation, and medical emergencies for your retreat.
                </p>
              </div>
            </div>

            {/* Changes to Itinerary */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4">Changes to Itinerary</h2>
              <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
                <p>
                  While we aim to follow our advertised itinerary, we reserve the right to make changes due to weather 
                  conditions, safety concerns, or other circumstances beyond our control. Alternative activities will be 
                  provided where possible.
                </p>
              </div>
            </div>

            {/* Participant Conduct */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4">Participant Conduct</h2>
              <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
                <p>
                  Participants must conduct themselves respectfully towards other participants, guides, and the local environment. 
                  We reserve the right to remove any participant whose behavior is unsafe, disruptive, or inappropriate.
                </p>
              </div>
            </div>

            {/* Liability */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4">Liability</h2>
              <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
                <p>
                  To the maximum extent permitted by law, Wild Adventure Retreat shall not be liable for any personal injury, 
                  loss or damage to property, or other loss arising from participation in our retreats.
                </p>
              </div>
            </div>

            {/* Photography */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4">Photography and Media</h2>
              <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
                <p>
                  By participating, you consent to photographs and videos being taken during the retreat. These may be used 
                  for marketing purposes unless you notify us otherwise in writing.
                </p>
              </div>
            </div>

            {/* Force Majeure */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4">Force Majeure</h2>
              <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
                <p>
                  We shall not be liable for any failure to perform our obligations due to circumstances beyond our reasonable 
                  control, including natural disasters, pandemics, acts of government, or other events.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="pt-6 border-t border-[#6B8E23]/20">
              <p className="text-[#DCCCA3] leading-relaxed">
                <strong className="text-[#F7F5EB]">Questions?</strong> If you have any questions about these terms and conditions, 
                please <a href="/contact" className="text-[#C65D2B] hover:text-[#C65D2B]/80 underline">contact us</a> before booking.
              </p>
            </div>

            {/* Last Updated */}
            <div className="pt-4">
              <p className="text-sm text-[#DCCCA3]/60 italic">
                Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default TermsAndConditionsPage;
