import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import TermsContent from '@/components/terms/TermsContent';

const ROOM_OPTIONS = [
  { value: 'Single', label: 'Single', description: 'Private room, shared retreat spaces' },
  { value: 'Double', label: 'Double', description: "Confirmed travelling with a partner" },
  { value: 'Twin', label: 'Twin', description: 'Open to sharing with another participant' }
];

const RETREAT_NAME = 'Beyond The Summit - Adventure for Leaders';

const LakeDistrictRegistrationPage = () => {
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? 'http://localhost:4242' : '');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    room: '',
    dietary: '',
    hikingExperience: '',
    medical: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isTermsModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = previousOverflow;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsTermsModalOpen(false);
    };
    if (isTermsModalOpen) document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTermsModalOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.6, ease: 'easeOut' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.room) {
      toast({
        title: 'Room preference required',
        description: 'Please let us know your room preference.',
        variant: 'destructive'
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: 'Terms & Conditions Required',
        description: 'You must accept the Terms & Conditions before registering.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const message = [
      `New registration for: ${RETREAT_NAME}`,
      '',
      `Phone: ${formData.phone}`,
      `Room preference: ${formData.room}`,
      `Allergies & dietary requirements: ${formData.dietary || 'None provided'}`,
      `Prior hiking experience: ${formData.hikingExperience || 'None provided'}`,
      `Medical conditions: ${formData.medical || 'None provided'}`,
      '',
      'Terms & Conditions accepted: Yes'
    ].join('\n');

    try {
      const response = await fetch(`${API_URL}/send-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      setSubmitted(true);
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: error.message || 'Please try again or reach out to us directly.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 flex items-center">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-2xl p-8 sm:p-12"
          >
            <CheckCircle className="w-16 h-16 text-[#6B8E23] mx-auto mb-6" />
            <h1 className="text-3xl sm:text-4xl font-bold text-[#F7F5EB] mb-4">You're in ✨</h1>
            <p className="text-lg text-[#DCCCA3] mb-2">
              Thanks for registering for Beyond The Summit, {formData.firstName}!
            </p>
            <p className="text-base text-[#DCCCA3] mb-8">
              We've received your details and will be in touch soon with next steps, including how to send your £50 deposit to secure your spot. Until then, don't stop exploring 🌿
            </p>
            <Link to="/retreats" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Button className="bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB] px-8 py-4 rounded-full">
                Back to Retreats
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Register - Beyond The Summit - Wild Adventure Coach</title>
        <meta name="description" content="Register your spot for Beyond The Summit, a 3-day hiking and yoga reset in the Lake District, 12-14 March 2027." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-[#F7F5EB] px-4">
              Register Your Spot
            </h1>
            <p className="text-base sm:text-lg text-[#DCCCA3] max-w-xl mx-auto px-4">
              A few quick details and you're on your way to the Lake District.
            </p>
          </motion.div>

          {/* Retreat Overview */}
          <motion.div {...fadeInUp} className="mb-10">
            <div className="bg-[#6B8E23]/10 border border-[#6B8E23]/30 rounded-2xl p-5 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F7F5EB] mb-3">{RETREAT_NAME}</h2>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base text-[#DCCCA3] mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#C65D2B]" />
                  <span className="text-[#F7F5EB] font-medium">March 12–14, 2027</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C65D2B]" />
                  <span>Lake District, England</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#C65D2B]" />
                  <span>All levels welcome</span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-[#DCCCA3] leading-relaxed mb-4">
                A restorative 3-day mountain escape combining fun guided hikes, grounding yoga, nourishing food, and time to slow down, reconnect, and reset.
              </p>
              <div className="flex items-baseline gap-2 pt-4 border-t border-[#6B8E23]/30">
                <span className="text-2xl font-bold text-[#F7F5EB]">£455</span>
                <span className="text-sm text-[#DCCCA3]">per person</span>
                <span className="text-sm text-[#BFEA8A] font-semibold ml-2">£399 with promo code</span>
              </div>
              <p className="text-xs sm:text-sm text-[#DCCCA3] mt-2">
                £50 deposit to secure your spot — no payment needed to register, we'll send payment details after.
              </p>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div {...fadeInUp} className="bg-[#6B8E23]/10 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-[#6B8E23]/30">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-6">Registration Form</h2>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-[#DCCCA3] mb-2 block">Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-[#2E4A34] border-[#6B8E23] text-[#F7F5EB] min-h-[48px]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-[#DCCCA3] mb-2 block">Surname *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-[#2E4A34] border-[#6B8E23] text-[#F7F5EB] min-h-[48px]"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <Label htmlFor="email" className="text-[#DCCCA3] mb-2 block">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="For confirmation"
                    className="bg-[#2E4A34] border-[#6B8E23] text-[#F7F5EB] min-h-[48px] placeholder:text-[#DCCCA3]/50"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-[#DCCCA3] mb-2 block">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-[#2E4A34] border-[#6B8E23] text-[#F7F5EB] min-h-[48px]"
                    required
                  />
                </div>
              </div>

              {/* Room Preference */}
              <div>
                <Label className="text-[#DCCCA3] mb-3 block">Room Preference *</Label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {ROOM_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={`cursor-pointer rounded-xl p-4 border-2 transition-colors ${
                        formData.room === option.value
                          ? 'border-[#C65D2B] bg-[#C65D2B]/10'
                          : 'border-[#6B8E23]/40 bg-[#2E4A34]/50 hover:border-[#6B8E23]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="room"
                        value={option.value}
                        checked={formData.room === option.value}
                        onChange={handleChange}
                        className="sr-only"
                        required
                      />
                      <p className="font-semibold text-[#F7F5EB] mb-1">{option.label}</p>
                      <p className="text-xs text-[#DCCCA3]">{option.description}</p>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="dietary" className="text-[#DCCCA3] mb-2 block">Allergies &amp; Dietary Requirements</Label>
                <textarea
                  id="dietary"
                  name="dietary"
                  value={formData.dietary}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Let us know about any allergies or dietary requirements"
                  className="w-full bg-[#2E4A34] border border-[#6B8E23] rounded-md p-3 text-[#F7F5EB] placeholder:text-[#DCCCA3]/50 focus:border-[#C65D2B] focus:outline-none focus:ring-2 focus:ring-[#C65D2B]/50"
                />
              </div>

              <div>
                <Label htmlFor="hikingExperience" className="text-[#DCCCA3] mb-2 block">Prior Hiking Experience</Label>
                <textarea
                  id="hikingExperience"
                  name="hikingExperience"
                  value={formData.hikingExperience}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Tell us a little about your hiking background — all levels are welcome"
                  className="w-full bg-[#2E4A34] border border-[#6B8E23] rounded-md p-3 text-[#F7F5EB] placeholder:text-[#DCCCA3]/50 focus:border-[#C65D2B] focus:outline-none focus:ring-2 focus:ring-[#C65D2B]/50"
                />
              </div>

              <div>
                <Label htmlFor="medical" className="text-[#DCCCA3] mb-2 block">Any Medical Conditions We Need to Be Aware Of</Label>
                <textarea
                  id="medical"
                  name="medical"
                  value={formData.medical}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Optional — helps us keep you safe on the trail"
                  className="w-full bg-[#2E4A34] border border-[#6B8E23] rounded-md p-3 text-[#F7F5EB] placeholder:text-[#DCCCA3]/50 focus:border-[#C65D2B] focus:outline-none focus:ring-2 focus:ring-[#C65D2B]/50"
                />
              </div>

              {/* Terms & Conditions */}
              <div className="bg-[#2E4A34]/50 rounded-xl p-5 sm:p-6 border-2 border-[#6B8E23]/50">
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-2 border-[#6B8E23] bg-[#2E4A34] text-[#C65D2B] focus:ring-2 focus:ring-[#C65D2B] focus:ring-offset-0 cursor-pointer"
                    required
                  />
                  <span className="ml-3 text-[#DCCCA3] text-sm leading-relaxed group-hover:text-[#F7F5EB] transition-colors">
                    I have read and agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setIsTermsModalOpen(true)}
                      className="text-[#C65D2B] hover:text-[#C65D2B]/80 underline font-semibold"
                    >
                      Terms &amp; Conditions
                    </button>
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB] text-base sm:text-lg py-6 rounded-full disabled:opacity-50 touch-manipulation min-h-[48px] active:scale-95 transition-transform"
              >
                {isSubmitting ? 'Submitting...' : 'Complete Registration'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      {isTermsModalOpen && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-modal-title"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsTermsModalOpen(false)}
          />
          <div
            className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-[#6B8E23]/40 bg-[#111111]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#6B8E23]/30 px-6 py-4">
              <h3 id="terms-modal-title" className="text-lg sm:text-xl font-semibold text-[#F7F5EB]">
                Terms &amp; Conditions
              </h3>
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(false)}
                className="text-[#DCCCA3] hover:text-[#F7F5EB] rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-[#C65D2B]"
                aria-label="Close terms and conditions"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
              <TermsContent />
            </div>
            <div className="flex justify-end border-t border-[#6B8E23]/30 bg-[#1A1A1A]/80 px-6 py-4">
              <Button
                type="button"
                onClick={() => setIsTermsModalOpen(false)}
                className="bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LakeDistrictRegistrationPage;
