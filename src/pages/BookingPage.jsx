import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Instagram, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useSearchParams } from 'react-router-dom';

const BookingPage = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const retreat = {
    name: 'Mountain Summit Experience',
    price: 1499,
    dates: 'June 15-20, 2026',
    duration: '5 Days',
    location: 'Rocky Mountains, Colorado',
    included: [
      'Professional mountain guides',
      'All meals and snacks',
      'Camping equipment and gear',
      'Transportation during retreat',
      'Group activities and workshops',
      'Emergency medical support'
    ]
  };

  const [formData, setFormData] = useState({
    retreat: retreat.name,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    participants: '1',
    specialRequests: ''
  });

  // Check if user returned from canceled payment
  useEffect(() => {
    if (searchParams.get('canceled') === 'true') {
      toast({
        title: "Payment Canceled",
        description: "Your payment was canceled. You can try again when you're ready.",
        variant: "destructive"
      });
    }
  }, [searchParams, toast]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Server error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.url) {
        throw new Error('No checkout URL received from server');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      setIsProcessing(false);
      
      // Provide more helpful error messages
      let errorMessage = error.message;
      let errorTitle = "Payment Error";
      
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        errorTitle = "Server Connection Error";
        errorMessage = "Cannot connect to payment server. Make sure the backend server is running on port 4242. Run 'npm run server' in a separate terminal.";
      } else if (error.message.includes('NetworkError') || error.message.includes('Load failed')) {
        errorTitle = "Network Error";
        errorMessage = "Cannot reach the payment server. Please ensure the backend server is running with 'npm run server'.";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
        duration: 8000
      });
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return retreat.price * parseInt(formData.participants || 1);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <>
      <Helmet>
        <title>Book Your Adventure - Wild Adventure Coach</title>
        <meta name="description" content="Reserve your spot on a transformative adventure retreat. Simple booking process to start your journey." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-[#F7F5EB]">
              Book Your Adventure
            </h1>
            <p className="text-xl text-[#DCCCA3]">
              Mountain Summit Experience - June 15-20, 2026
            </p>
          </motion.div>

          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              {[1, 2].map((num) => (
                <React.Fragment key={num}>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    step >= num 
                      ? 'bg-[#C65D2B] border-[#C65D2B] text-[#F7F5EB]' 
                      : 'border-[#6B8E23] text-[#DCCCA3]'
                  }`}>
                    {step > num ? <CheckCircle className="w-6 h-6" /> : num}
                  </div>
                  {num < 2 && (
                    <div className={`w-16 h-1 ${step > num ? 'bg-[#C65D2B]' : 'bg-[#DCCCA3]'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <motion.div
            {...fadeInUp}
            className="bg-[#6B8E23]/10 backdrop-blur-sm rounded-2xl p-8 border border-[#6B8E23]/30"
          >
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-6">
                  {/* Retreat Package Overview */}
                  <div className="bg-[#C65D2B]/10 border border-[#C65D2B]/30 rounded-xl p-6 mb-8">
                    <h3 className="text-2xl font-bold text-[#F7F5EB] mb-3">{retreat.name}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[#DCCCA3]">{retreat.dates}</span>
                      <span className="text-2xl font-bold text-[#C65D2B]">${retreat.price} <span className="text-sm text-[#DCCCA3]">per person</span></span>
                    </div>
                    <div className="text-sm text-[#DCCCA3] mb-4">
                      <strong className="text-[#F7F5EB]">Duration:</strong> {retreat.duration} | <strong className="text-[#F7F5EB]">Location:</strong> {retreat.location}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-[#6B8E23]/30">
                      <p className="text-sm font-semibold text-[#F7F5EB] mb-3">Package Includes:</p>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {retreat.included.map((item, index) => (
                          <li key={index} className="flex items-start text-[#DCCCA3] text-sm">
                            <CheckCircle className="w-4 h-4 mr-2 text-[#6B8E23] flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-[#F7F5EB] mb-6">Your Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-[#DCCCA3] mb-2 block">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="bg-[#2E4A34] border-[#6B8E23] text-[#F7F5EB]"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-[#DCCCA3] mb-2 block">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="bg-[#2E4A34] border-[#6B8E23] text-[#F7F5EB]"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#DCCCA3] mb-2 block">Email *</Label>
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
                    <Label htmlFor="phone" className="text-[#DCCCA3] mb-2 block">Phone Number</Label>
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
                    <Label htmlFor="participants" className="text-[#DCCCA3] mb-2 block">Number of Participants</Label>
                    <Input
                      id="participants"
                      name="participants"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.participants}
                      onChange={handleInputChange}
                      className="bg-[#2E4A34] border-[#6B8E23] text-[#F7F5EB]"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-[#F7F5EB] mb-6">Review & Confirm</h2>
                  
                  {/* Retreat Summary */}
                  <div className="bg-[#C65D2B]/10 border border-[#C65D2B]/30 rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-[#F7F5EB] mb-3">{formData.retreat}</h3>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-[#DCCCA3]">Dates:</span>
                        <p className="text-[#F7F5EB] font-semibold">{retreat.dates}</p>
                      </div>
                      <div>
                        <span className="text-[#DCCCA3]">Duration:</span>
                        <p className="text-[#F7F5EB] font-semibold">{retreat.duration}</p>
                      </div>
                      <div>
                        <span className="text-[#DCCCA3]">Location:</span>
                        <p className="text-[#F7F5EB] font-semibold">{retreat.location}</p>
                      </div>
                      <div>
                        <span className="text-[#DCCCA3]">Participants:</span>
                        <p className="text-[#F7F5EB] font-semibold">{formData.participants} {parseInt(formData.participants) === 1 ? 'person' : 'people'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Personal Information */}
                  <div className="bg-[#2E4A34]/50 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-[#F7F5EB] mb-4">Your Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[#DCCCA3] text-sm">Name:</span>
                        <p className="text-[#F7F5EB] text-lg">{formData.firstName} {formData.lastName}</p>
                      </div>
                      <div>
                        <span className="text-[#DCCCA3] text-sm">Email:</span>
                        <p className="text-[#F7F5EB] text-lg">{formData.email}</p>
                      </div>
                      {formData.phone && (
                        <div>
                          <span className="text-[#DCCCA3] text-sm">Phone:</span>
                          <p className="text-[#F7F5EB] text-lg">{formData.phone}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t border-[#6B8E23]/30 pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[#DCCCA3] text-xl">Total Amount:</span>
                        <p className="text-[#C65D2B] text-3xl font-bold">${calculateTotal().toLocaleString()}</p>
                      </div>
                      <p className="text-[#DCCCA3] text-sm mt-2 text-right">
                        ${retreat.price} × {formData.participants} {parseInt(formData.participants) === 1 ? 'person' : 'people'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="specialRequests" className="text-[#DCCCA3] mb-2 block">Special Requests or Dietary Requirements</Label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full bg-[#2E4A34] border border-[#6B8E23] rounded-md p-3 text-[#F7F5EB]"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <Button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    variant="outline"
                    className="border-[#6B8E23] text-[#F7F5EB] hover:bg-[#6B8E23]/20"
                  >
                    Back
                  </Button>
                )}
                {step < 2 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB] ml-auto"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB] ml-auto disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </Button>
                )}
              </div>
            </form>
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
    </>
  );
};

export default BookingPage;