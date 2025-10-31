import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Send, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

// WhatsApp brand icon
const WhatsAppIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);

const ContactPage = () => {
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || '';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSending(true);

    try {
      const response = await fetch(`${API_URL}/send-contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      toast({
        title: "Message Sent! ✅",
        description: "Thank you for reaching out. We'll get back to you soon!",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error Sending Message",
        description: error.message || "Please try again or email us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact - Wild Adventure Coach</title>
        <meta name="description" content="Get in touch with Wild Adventure Coach. Have questions about our retreats? We'd love to hear from you!" />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-[#F7F5EB] px-4">
              Get In Touch
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#DCCCA3] max-w-2xl mx-auto px-4">
              Have questions about our mountain retreat? Ready to start your adventure? 
              We'd love to hear from you!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              {...fadeInLeft}
              className="bg-[#6B8E23]/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-[#6B8E23]/30"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 sm:mb-6">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <Label htmlFor="name" className="text-[#DCCCA3] mb-2 block">Your Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-[#2E4A34] border-[#6B8E23] text-[#F7F5EB]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-[#DCCCA3] mb-2 block">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-[#2E4A34] border-[#6B8E23] text-[#F7F5EB]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-[#DCCCA3] mb-2 block text-sm sm:text-base">Your Message *</Label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full bg-[#2E4A34] border border-[#6B8E23] rounded-md p-3 text-base sm:text-lg text-[#F7F5EB] focus:border-[#C65D2B] focus:outline-none focus:ring-2 focus:ring-[#C65D2B]/50 min-h-[120px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB] text-base sm:text-lg py-4 sm:py-6 rounded-full disabled:opacity-50 touch-manipulation"
                >
                  {isSending ? (
                    <>
                      <Send className="mr-2 h-5 w-5 animate-pulse" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              {...fadeInRight}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 sm:mb-6">Contact Information</h2>
                <p className="text-[#DCCCA3] text-base sm:text-lg mb-6 sm:mb-8">
                  Reach out to us directly or fill out the form. We typically respond within 24 hours.
                </p>
              </motion.div>

              <div className="space-y-6">
                {/* WhatsApp Button */}
                <motion.a
                  href="https://wa.me/447549214155"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-4 bg-[#25D366] border-2 border-white text-white font-semibold rounded-full hover:bg-[#1ebe57] transition-all duration-200 w-full justify-center touch-manipulation min-h-[48px]"
                  title="Contact us on WhatsApp"
                >
                  <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-base sm:text-lg font-bold">WHATSAPP</span>
                </motion.a>

                {/* Instagram Button */}
                <motion.a
                  href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 border-2 border-white text-white font-semibold rounded-full hover:opacity-90 transition-all duration-200 w-full justify-center touch-manipulation min-h-[48px]"
                  title="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-base sm:text-lg font-bold">INSTAGRAM</span>
                </motion.a>
              </div>

              {/* Additional Info */}
              <div className="bg-[#C65D2B]/10 border border-[#C65D2B]/30 rounded-xl p-4 sm:p-6 mt-6 sm:mt-8">
                <h3 className="text-[#F7F5EB] font-semibold mb-2 sm:mb-3 text-base sm:text-lg">Questions About the Retreat?</h3>
                <p className="text-[#DCCCA3] text-sm sm:text-base">
                  Whether you're wondering about fitness requirements, what to pack, dietary accommodations, 
                  or anything else - we're here to help! Send us a message and we'll answer all your questions.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <footer className="bg-[#1a2d20] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center space-y-6">
            {/* Contact Links */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <a 
                href="https://wa.me/447549214155"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] border-2 border-white text-white font-semibold rounded-full hover:bg-[#1ebe57] transition-all duration-200"
                title="Contact us on WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span className="text-sm font-bold">WHATSAPP</span>
              </a>

              <a 
                href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 border-2 border-white text-white font-semibold rounded-full hover:opacity-90 transition-all duration-200"
                title="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
                <span className="text-sm font-bold">INSTAGRAM</span>
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
    </>
  );
};

export default ContactPage;
