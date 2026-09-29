import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BookingSuccessPage = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-[#F7F5EB] mb-4">Booking Received!</h1>
          <p className="text-[#DCCCA3] mb-8">
            Check your email (and your spam folder) for your booking confirmation and bank transfer details to pay your deposit.
          </p>
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Button className="bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB]">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const depositAmount = (booking.amount_paid / 100).toFixed(2);

  return (
    <>
      <Helmet>
        <title>Booking Received - Wild Adventure Coach</title>
        <meta name="description" content="Your adventure retreat booking has been received - pay your deposit by bank transfer to secure your spot." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-[#F7F5EB] px-4">
              Booking Received!
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#F7F5EB] mb-2 sm:mb-3 px-4">
              Check your Spam Folder
            </p>
            <p className="text-base sm:text-lg md:text-xl text-[#DCCCA3] px-4">
              We've emailed you bank transfer details to pay your deposit and secure your spot.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#6B8E23]/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-[#6B8E23]/30 mb-6 sm:mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 sm:mb-6">Booking Details</h2>
            
            <div className="space-y-6">
              <div className="bg-[#2E4A34]/50 rounded-xl p-4 sm:p-6">
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <span className="text-[#DCCCA3] text-sm">Retreat</span>
                    <p className="text-[#F7F5EB] text-lg font-semibold">{booking.retreat_name}</p>
                  </div>
                  <div>
                    <span className="text-[#DCCCA3] text-sm">Name</span>
                    <p className="text-[#F7F5EB] text-lg">{booking.first_name} {booking.last_name}</p>
                  </div>
                  <div>
                    <span className="text-[#DCCCA3] text-sm">Email</span>
                    <p className="text-[#F7F5EB] text-lg">{booking.email}</p>
                  </div>
                  <div>
                    <span className="text-[#DCCCA3] text-sm">Deposit Due</span>
                    <p className="text-[#C65D2B] text-2xl font-bold">£{parseFloat(depositAmount).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#6B8E23]/30">
                  <span className="text-[#DCCCA3] text-sm">Booking Reference</span>
                  <p className="text-[#F7F5EB] font-mono mt-1">{booking.stripe_session_id}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-[#2E4A34]/30 rounded-xl">
                  <Mail className="w-6 h-6 text-[#C65D2B] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-[#F7F5EB] font-semibold mb-1">Confirmation Email Sent</h3>
                    <p className="text-[#DCCCA3] text-sm">
                      We've sent a confirmation email to <strong>{booking.email}</strong> with bank transfer details to pay your deposit, plus all the details and next steps.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-[#2E4A34]/30 rounded-xl">
                  <Calendar className="w-6 h-6 text-[#C65D2B] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-[#F7F5EB] font-semibold mb-1">What's Next?</h3>
                    <p className="text-[#DCCCA3] text-sm">
                      Please pay your deposit by bank transfer using the details in your email, quoting your booking reference. Our team will then contact you within 24-48 hours with detailed information about your retreat, including packing lists, meeting points, and preparation tips.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Button className="bg-[#DCCCA3] hover:bg-[#6B8E23]/90 text-[#F7F5EB] px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg w-full sm:w-auto touch-manipulation">
                  Back to Home
                </Button>
            </Link>
            <Link to="/retreats" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Button 
                variant="outline" 
                className="border-[#C65D2B] text-[#F7F5EB] hover:bg-[#C65D2B]/20 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg w-full sm:w-auto touch-manipulation"
              >
                View Retreat Details
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BookingSuccessPage;

