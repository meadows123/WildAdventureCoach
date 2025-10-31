import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Mail, Loader2, Instagram } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BookingSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API URL - since backend serves the frontend, use relative URLs in production
  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        setError('No session ID found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/checkout-session/${sessionId}`);
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setSessionData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId, API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C65D2B] mx-auto mb-4" />
          <p className="text-[#DCCCA3] text-lg">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#F7F5EB] mb-4">Something went wrong</h1>
          <p className="text-[#DCCCA3] mb-8">{error || 'Unable to load booking details'}</p>
          <Link to="/booking" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Button className="bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB]">
              Back to Booking
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { customer_email, metadata, amount_total } = sessionData;
  const totalAmount = (amount_total / 100).toFixed(2);

  return (
    <>
      <Helmet>
        <title>Booking Confirmed - Wild Adventure Coach</title>
        <meta name="description" content="Your adventure retreat booking has been confirmed!" />
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
              Booking Confirmed!
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#F7F5EB] mb-2 sm:mb-3 px-4">
              Check your Spam Folder
            </p>
            <p className="text-base sm:text-lg md:text-xl text-[#DCCCA3] px-4">
              Your adventure awaits! We're excited to have you join us.
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
                    <p className="text-[#F7F5EB] text-lg font-semibold">{metadata?.retreat}</p>
                  </div>
                  <div>
                    <span className="text-[#DCCCA3] text-sm">Name</span>
                    <p className="text-[#F7F5EB] text-lg">{metadata?.firstName} {metadata?.lastName}</p>
                  </div>
                  <div>
                    <span className="text-[#DCCCA3] text-sm">Email</span>
                    <p className="text-[#F7F5EB] text-lg">{customer_email}</p>
                  </div>
                  <div>
                    <span className="text-[#DCCCA3] text-sm">Total Paid</span>
                    <p className="text-[#C65D2B] text-2xl font-bold">£{parseFloat(totalAmount).toLocaleString()}</p>
                  </div>
                </div>

                {metadata?.specialRequests && (
                  <div className="mt-6 pt-6 border-t border-[#6B8E23]/30">
                    <span className="text-[#DCCCA3] text-sm">Special Requests</span>
                    <p className="text-[#F7F5EB] mt-2">{metadata.specialRequests}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-[#2E4A34]/30 rounded-xl">
                  <Mail className="w-6 h-6 text-[#C65D2B] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-[#F7F5EB] font-semibold mb-1">Confirmation Email Sent</h3>
                    <p className="text-[#DCCCA3] text-sm">
                      We've sent a confirmation email to <strong>{customer_email}</strong> with all the details and next steps.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-[#2E4A34]/30 rounded-xl">
                  <Calendar className="w-6 h-6 text-[#C65D2B] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-[#F7F5EB] font-semibold mb-1">What's Next?</h3>
                    <p className="text-[#DCCCA3] text-sm">
                      Our team will contact you within 24-48 hours with detailed information about your retreat, including packing lists, meeting points, and preparation tips.
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
              href="mailto:wildadventurecoach@gmail.com"
              className="flex items-center space-x-2 text-[#DCCCA3] hover:text-[#C65D2B] transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="text-lg">wildadventurecoach@gmail.com</span>
            </a>

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
    </>
  );
};

export default BookingSuccessPage;

