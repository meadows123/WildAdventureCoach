import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MessageCircle, MapPin, Send, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
    setIsSending(true);

    try {
      const response = await fetch('/send-contact', {
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
        phone: '',
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-[#F7F5EB]">
              Get In Touch
            </h1>
            <p className="text-xl text-[#DCCCA3] max-w-2xl mx-auto">
              Have questions about our mountain retreat? Ready to start your adventure? 
              We'd love to hear from you!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              {...fadeInLeft}
              className="bg-[#6B8E23]/10 backdrop-blur-sm rounded-2xl p-8 border border-[#6B8E23]/30"
            >
              <h2 className="text-3xl font-bold text-[#F7F5EB] mb-6">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="phone" className="text-[#DCCCA3] mb-2 block">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-[#2E4A34] border-[#6B8E23] text-[#F7F5EB]"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-[#DCCCA3] mb-2 block">Your Message *</Label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full bg-[#2E4A34] border border-[#6B8E23] rounded-md p-3 text-[#F7F5EB] focus:border-[#C65D2B] focus:outline-none focus:ring-2 focus:ring-[#C65D2B]/50"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB] text-lg py-6 rounded-full disabled:opacity-50"
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
                <h2 className="text-3xl font-bold text-[#F7F5EB] mb-6">Contact Information</h2>
                <p className="text-[#DCCCA3] text-lg mb-8">
                  Reach out to us directly or fill out the form. We typically respond within 24 hours.
                </p>
              </motion.div>

              <div className="space-y-6">
                {/* WhatsApp */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  className="flex items-start space-x-4 p-4 bg-[#6B8E23]/10 rounded-xl border border-[#6B8E23]/30"
                >
                  <MessageCircle className="w-6 h-6 text-[#C65D2B] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-[#F7F5EB] font-semibold mb-1">WhatsApp</h3>
                    <a 
                      href="https://wa.me/447549214155"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#DCCCA3] hover:text-[#C65D2B] transition-colors"
                    >
                      +44 7549 214155
                    </a>
                  </div>
                </motion.div>

                {/* Instagram */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  className="flex items-start space-x-4 p-4 bg-[#6B8E23]/10 rounded-xl border border-[#6B8E23]/30"
                >
                  <Instagram className="w-6 h-6 text-[#C65D2B] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-[#F7F5EB] font-semibold mb-1">Instagram</h3>
                    <a 
                      href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#DCCCA3] hover:text-[#C65D2B] transition-colors"
                    >
                      @wildadventurecoach
                    </a>
                  </div>
                </motion.div>

                {/* Location */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  className="flex items-start space-x-4 p-4 bg-[#6B8E23]/10 rounded-xl border border-[#6B8E23]/30"
                >
                  <MapPin className="w-6 h-6 text-[#C65D2B] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-[#F7F5EB] font-semibold mb-1">Retreat Location</h3>
                    <p className="text-[#DCCCA3]">Mont Blanc</p>
                  </div>
                </motion.div>
              </div>

              {/* Additional Info */}
              <div className="bg-[#C65D2B]/10 border border-[#C65D2B]/30 rounded-xl p-6 mt-8">
                <h3 className="text-[#F7F5EB] font-semibold mb-3">Questions About the Retreat?</h3>
                <p className="text-[#DCCCA3] text-sm">
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
                href="https://www.instagram.com/wildadventurecoach/?igsh=MW5kZ2ZpYzJwNm5nOQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-[#DCCCA3] hover:text-[#C65D2B] transition-colors group"
              >
                <Instagram className="w-6 h-6" />
                <span className="text-lg">@wildadventurecoach</span>
              </a>

              {/* WhatsApp */}
              <a 
                href="https://wa.me/447549214155"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-[#DCCCA3] hover:text-[#C65D2B] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-lg">+44 7549 214155</span>
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
