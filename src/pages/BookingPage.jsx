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
  const [availableSpots, setAvailableSpots] = useState(null);
  const [soldOut, setSoldOut] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // API URL - since backend serves the frontend, use relative URLs in production
  const API_URL = import.meta.env.VITE_API_URL || '';
  
  // Get retreat from URL parameter
  const retreatParam = searchParams.get('retreat');
  
  // Define retreat configurations
  const retreats = {
    'Hiking and Yoga Retreat in Chamonix': {
      name: 'Hiking & Yoga Retreat Chamonix',
      beginnerFriendly: true,
      hasAccommodationOptions: true,
      accommodationOptions: [
        {
          name: 'Basic Single',
          price: 1250,
          deposit: 250,
          description: 'Single bed in a shared room (up to 3 total), ensuite bathroom'
        },
        {
          name: 'Economy Single',
          price: 1450,
          deposit: 250,
          description: 'One bed in a shared twin, same-gender accommodation'
        },
        {
          name: 'Double',
          price: 1700,
          deposit: 250,
          description: 'Single occupancy in a double room'
        }
      ],
      // Default values for backward compatibility
      price: 1250,
      deposit: 250,
      dates: 'June 4 - 9, 2026',
      duration: '6 days / 5 nights',
      location: 'Chamonix, French Alps',
      description: '',
      participants: 'Up to 10 like-minded professionals',
      included: [
        "Accommodation",
        "Daily Guided Hikes & Yoga Sessions",
        "Meditation & Self-Reflection Sessions",
        "Introduction to Climbing",
        "All Meals, Packed Lunches & Tea/Coffee",
        "Honesty Bar at the Chalet"
      ],
      optional: [
        "Airport Transfers & Local Transport",
        "Optional Activities"
      ],
      notIncluded: [
        'Flights',
        'Airport transfer',
        'Insurance',
        'Personal gear'
      ]
    },
    'Hiking and Yoga Retreat - August': {
      name: 'Hiking & Yoga Retreat Chamonix',
      beginnerFriendly: false,
      price: 1250,
      deposit: 375,
      dates: 'August 30 - September 4, 2026',
      duration: '6 Days',
      location: 'Mont Blanc (France and Italy)',
      description: '4 iconic stages of the Tour du Mont Blanc covering 65 km across France and Italy. 15 km each day and 1000 D+ each day. Good fitness level is required.',
      included: [
        '5 nights accommodation',
        '3 meals / day',
        '4 guided hiking days',
        'Daily yoga & mindfulness sessions'
      ],
      notIncluded: [
        'Flights & transfer to Chamonix',
        'Hiking & yoga equipment',
        'Snacks and drinks'
      ]
    }
  };
  
  // Select the retreat based on URL parameter or default to August
  const retreat = retreats[retreatParam] || retreats['Hiking and Yoga Retreat - August'];

  const [formData, setFormData] = useState({
    retreat: retreat.name,
    accommodationType: '',
    travelingAloneOrGroup: '',
    numberOfPeople: '',
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    age: '',
    beenHiking: '',
    hikingExperience: ''
  });
  
  // State for "not suitable" contact form
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

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

  // Fetch available spots on page load
  useEffect(() => {
    fetch(`${API_URL}/retreat-capacity/${retreat.name}`)
      .then(res => res.json())
      .then(data => {
        setAvailableSpots(data.availableSpots);
        setSoldOut(data.soldOut);
        
        if (data.soldOut) {
          toast({
            title: "Retreat is Sold Out",
            description: "This retreat has reached maximum capacity. Please contact us to join the waitlist.",
            variant: "destructive",
            duration: 8000
          });
        }
      })
      .catch(error => {
        console.error('Error fetching capacity:', error);
      });
  }, [retreat.name, toast]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Check if accommodation selection is required (July retreat)
      const needsAccommodation = retreat.hasAccommodationOptions && !formData.accommodationType;
      
      // Check if number of people is required for groups
      const needsGroupCount = formData.travelingAloneOrGroup === 'Group' && !formData.numberOfPeople;
      
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.gender || !formData.age || !formData.beenHiking || !formData.hikingExperience || 
          !formData.travelingAloneOrGroup || needsAccommodation || needsGroupCount) {
        toast({
          title: "Missing information",
          description: needsAccommodation ? "Please select your accommodation preference" : 
                       needsGroupCount ? "Please enter the number of people in your group" :
                       "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (step === 2) {
      if (!termsAccepted) {
        toast({
          title: "Acknowledgment Required",
          description: "You must read and accept the terms before proceeding",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Scroll to top when submitting (step 3)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsProcessing(true);

    try {
      const response = await fetch(`${API_URL}/create-checkout-session`, {
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

  // Calculate total price - now returns deposit amount
  const calculateTotal = () => {
    // If accommodation is selected (July retreat), use that price
    if (retreat.hasAccommodationOptions && formData.accommodationType) {
      const selectedAccommodation = retreat.accommodationOptions.find(
        opt => opt.name === formData.accommodationType
      );
      return selectedAccommodation?.deposit || selectedAccommodation?.price || 375;
    }
    return retreat.deposit || retreat.price;
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

      <div className="min-h-screen pt-16 sm:pt-20 pb-12 sm:pb-16 px-3 sm:px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-[#F7F5EB] leading-tight px-2">
              Book Your Adventure
            </h1>
          </motion.div>

          <div className="flex justify-center mb-8 sm:mb-12 overflow-x-auto px-2">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-max">
              {[1, 2, 3].map((num) => (
                <React.Fragment key={num}>
                  <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all text-sm sm:text-base ${
                    step >= num 
                      ? 'bg-[#C65D2B] border-[#C65D2B] text-[#F7F5EB]' 
                      : 'border-[#6B8E23] text-[#DCCCA3]'
                  }`}>
                    {step > num ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" /> : num}
                  </div>
                  {num < 3 && (
                    <div className={`w-8 sm:w-16 h-1 ${step > num ? 'bg-[#C65D2B]' : 'bg-[#DCCCA3]'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <motion.div
            {...fadeInUp}
            className="bg-[#6B8E23]/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-[#6B8E23]/30"
          >
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-6">
                  {/* Retreat Package Overview */}
                  <div className="bg-[#C65D2B]/10 border border-[#C65D2B]/30 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#F7F5EB] leading-tight">{retreat.name}</h3>
                      {soldOut && (
                        <span className="px-3 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                          SOLD OUT
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <span className="text-sm sm:text-base text-[#DCCCA3]">{retreat.dates}</span>
                      <div className="flex flex-col items-end">
                        {(() => {
                          let depositToShow = retreat.deposit;
                          let priceToShow = retreat.price;
                          
                          if (retreat.hasAccommodationOptions && formData.accommodationType) {
                            const selectedAccom = retreat.accommodationOptions.find(opt => opt.name === formData.accommodationType);
                            if (selectedAccom) {
                              depositToShow = selectedAccom.deposit;
                              priceToShow = selectedAccom.price;
                            }
                          }
                          
                          return (
                            <>
                              <span className="text-xl sm:text-2xl font-bold text-[#C65D2B]">£{depositToShow} deposit</span>
                              {retreat.hasAccommodationOptions ? (() => {
                                const prices = retreat.accommodationOptions.map(o => o.price);
                                const min = Math.min(...prices);
                                const max = Math.max(...prices);
                                return <p className="text-xs text-[#DCCCA3] mt-1">Full price: £{min}–£{max}</p>;
                              })() : (
                                <p className="text-xs text-[#DCCCA3] mt-1">Full price: £{priceToShow}</p>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    
                    <div className="bg-[#6B8E23]/20 border border-[#6B8E23]/40 rounded-lg px-4 py-2 mb-4">
                      <p className="text-center text-[#DCCCA3] text-sm">
                        {(() => {
                          let depositToShow = retreat.deposit;
                          let priceToShow = retreat.price;
                          
                          if (retreat.hasAccommodationOptions && formData.accommodationType) {
                            const selectedAccom = retreat.accommodationOptions.find(opt => opt.name === formData.accommodationType);
                            if (selectedAccom) {
                              depositToShow = selectedAccom.deposit;
                              priceToShow = selectedAccom.price;
                            }
                          }
                          
                          return `Secure your spot today with a £${depositToShow} deposit • Remaining balance due closer to the retreat date`;
                        })()}
                      </p>
                    </div>
                    
                    {/* Capacity Indicator */}
                    {availableSpots !== null && !soldOut && (
                      <div className="bg-[#6B8E23]/20 border border-[#6B8E23]/40 rounded-lg px-4 py-2 mb-4">
                        <div className="flex items-center justify-center">
                          <span className="text-[#F7F5EB] font-semibold text-sm">
                            ⚡ {availableSpots} spot{availableSpots === 1 ? '' : 's'} remaining
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="text-sm text-[#DCCCA3] mb-4">
                      <strong className="text-[#F7F5EB]">Duration:</strong> {retreat.duration} | <strong className="text-[#F7F5EB]">Location:</strong> {retreat.location}
                    </div>
                    
                    <p className="text-[#DCCCA3] text-sm mb-4 leading-relaxed">
                      {retreat.description}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-[#6B8E23]/30">
                      <p className="text-sm font-semibold text-[#F7F5EB] mb-3">Package Includes:</p>
                      <ul className="grid md:grid-cols-2 gap-2 mb-4">
                        {retreat.included.map((item, index) => (
                          <li key={index} className="flex items-start text-[#DCCCA3] text-sm">
                            <CheckCircle className="w-4 h-4 mr-2 text-[#6B8E23] flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {retreat.optional && retreat.optional.length > 0 && (
                        <>
                          <p className="text-sm font-semibold text-[#F7F5EB] mb-3 mt-4">Optional (costs may apply):</p>
                          <ul className="grid md:grid-cols-2 gap-2 mb-4">
                            {retreat.optional.map((item, index) => (
                              <li key={index} className="flex items-start text-[#DCCCA3] text-sm">
                                <CheckCircle className="w-4 h-4 mr-2 text-[#6B8E23] flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      
                      <p className="text-sm font-semibold text-[#F7F5EB] mb-3 mt-4">Not Included:</p>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {retreat.notIncluded.map((item, index) => (
                          <li key={index} className="flex items-start text-[#DCCCA3] text-sm">
                            <span className="text-[#C65D2B] mr-2 flex-shrink-0">✗</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Accommodation Selection - Only for July retreat */}
                  {retreat.hasAccommodationOptions && (
                    <div className="bg-[#C65D2B]/10 border border-[#C65D2B]/30 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#F7F5EB] mb-4">Choose Your Accommodation</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {retreat.accommodationOptions.map((option, index) => (
                          <label
                            key={index}
                            className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all ${index === 2 ? 'md:col-start-1 md:col-span-2 md:max-w-md md:mx-auto' : ''} ${
                              formData.accommodationType === option.name
                                ? 'border-[#C65D2B] bg-[#C65D2B]/30 ring-2 ring-[#C65D2B] shadow-lg'
                                : 'border-[#6B8E23] bg-[#6B8E23]/10 hover:border-[#C65D2B] hover:bg-[#C65D2B]/10'
                            }`}
                          >
                            <input
                              type="radio"
                              name="accommodationType"
                              value={option.name}
                              checked={formData.accommodationType === option.name}
                              onChange={(e) => setFormData({...formData, accommodationType: e.target.value})}
                              className="hidden"
                            />
                            {formData.accommodationType === option.name && (
                              <span className="absolute bottom-2 right-2 bg-[#C65D2B] text-[#F7F5EB] text-xs font-bold px-2 py-1 rounded-full">Selected</span>
                            )}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-[#F7F5EB] text-lg">{option.name}</h3>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-bold text-[#C65D2B]">£{option.price}</span>
                                </div>
                              </div>
                              <p className="text-[#DCCCA3] text-sm">{option.description}</p>
                              <p className="text-[#6B8E23] text-xs font-semibold mt-2">Deposit: £{option.deposit}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 sm:mb-6">Your Information</h2>
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
                  
                  {/* Traveling Alone or in Group */}
                  <div>
                    <Label htmlFor="travelingAloneOrGroup" className="text-[#DCCCA3] mb-2 block">Are you traveling alone or in a group? *</Label>
                    <select
                      id="travelingAloneOrGroup"
                      name="travelingAloneOrGroup"
                      value={formData.travelingAloneOrGroup}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-[#6B8E23] bg-[#2E4A34] px-3 py-2 text-sm text-[#F7F5EB] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#DCCCA3]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65D2B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
                      style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207l5%205%205-5%22%20stroke%3D%22%23DCCCA3%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')", backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                      required
                    >
                      <option value="">Select an option</option>
                      <option value="Alone">Alone</option>
                      <option value="Group">Group</option>
                    </select>
                  </div>
                  
                  {/* Number of People - Only show if "Group" */}
                  {formData.travelingAloneOrGroup === 'Group' ? (
                    <div>
                      <Label htmlFor="numberOfPeople" className="text-[#DCCCA3] mb-2 block">How many people? (including you) *</Label>
                      <select
                        id="numberOfPeople"
                        name="numberOfPeople"
                        value={formData.numberOfPeople}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-[#6B8E23] bg-[#2E4A34] px-3 py-2 text-sm text-[#F7F5EB] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#DCCCA3]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65D2B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
                        style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207l5%205%205-5%22%20stroke%3D%22%23DCCCA3%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')", backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                        required
                      >
                        <option value="">Select number</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                      </select>
                    </div>
                  ) : null}
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="gender" className="text-[#DCCCA3] mb-2 block">Gender *</Label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-[#6B8E23] bg-[#2E4A34] px-3 py-2 text-sm text-[#F7F5EB] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#DCCCA3]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65D2B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
                        style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207l5%205%205-5%22%20stroke%3D%22%23DCCCA3%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')", backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="age" className="text-[#DCCCA3] mb-2 block">Age *</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        min="18"
                        max="99"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="bg-[#2E4A34] border-[#6B8E23] text-[#F7F5EB]"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="beenHiking" className="text-[#DCCCA3] mb-2 block">Have you ever been hiking? *</Label>
                      <select
                        id="beenHiking"
                        name="beenHiking"
                        value={formData.beenHiking}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-[#6B8E23] bg-[#2E4A34] px-3 py-2 text-sm text-[#F7F5EB] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#DCCCA3]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65D2B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
                        style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207l5%205%205-5%22%20stroke%3D%22%23DCCCA3%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')", backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                        required
                      >
                        <option value="">Select answer</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="hikingExperience" className="text-[#DCCCA3] mb-2 block">Hiking Experience *</Label>
                      <select
                        id="hikingExperience"
                        name="hikingExperience"
                        value={formData.hikingExperience}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-[#6B8E23] bg-[#2E4A34] px-3 py-2 text-sm text-[#F7F5EB] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#DCCCA3]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65D2B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
                        style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207l5%205%205-5%22%20stroke%3D%22%23DCCCA3%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')", backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                        required
                      >
                        <option value="">Select level</option>
                        {retreat.beginnerFriendly && <option value="Beginner">Beginner</option>}
                        <option value="Intermediate">Intermediate</option>
                        <option value="Experienced">Experienced</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  {formData.beenHiking === 'No' && !retreat.beginnerFriendly ? (
                    // Different message for users with no hiking experience on non-beginner-friendly retreat
                    <>
                      <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/20 border-2 border-red-600 mb-4 sm:mb-6">
                          <span className="text-4xl sm:text-5xl">🚫</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-2 px-2 leading-tight">This Retreat is Not Suitable for You</h2>
                      </div>

                      <div className="bg-red-600/10 border-2 border-red-600/50 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8">
                        <div className="space-y-4 text-[#F7F5EB] leading-relaxed">
                          <p className="text-lg">
                            We appreciate your interest in our retreat, but this hiking trip is <strong className="text-red-400">not suitable for beginners</strong> or those without prior hiking experience.
                          </p>
                          
                          <p className="text-lg">
                            This retreat involves <strong className="text-red-400">challenging terrain, steep climbs, and extended walking periods</strong> that require a <strong className="text-red-400">moderate to high fitness level</strong> and prior hiking experience.
                          </p>
                          
                          <div className="my-6 pt-6 border-t border-red-600/30">
                            <p className="text-lg font-semibold text-red-400 mb-4">Why this retreat requires hiking experience:</p>
                            <ul className="space-y-3 text-[#DCCCA3]">
                              <li className="flex items-start">
                                <span className="text-red-400 mr-3 mt-1 flex-shrink-0">•</span>
                                <span>Participants must be comfortable with uneven surfaces and sustained physical effort.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-red-400 mr-3 mt-1 flex-shrink-0">•</span>
                                <span>Daily hikes cover 15km with 1000m elevation gain - challenging for beginners.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-red-400 mr-3 mt-1 flex-shrink-0">•</span>
                                <span>Outdoor conditions may include altitude, variable weather, and long distances.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-red-400 mr-3 mt-1 flex-shrink-0">•</span>
                                <span>Safety requires prior experience with hiking techniques and equipment.</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="bg-[#2E4A34] rounded-lg p-4 border border-[#6B8E23]/50">
                            <p className="text-[#DCCCA3] text-sm italic">
                              We recommend gaining hiking experience through easier trails and day hikes before attempting this challenging retreat. Contact our team for guidance on suitable beginner-friendly activities.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Form for Unsuitable Users */}
                      {contactSubmitted ? (
                        <div className="bg-[#6B8E23]/30 border border-[#6B8E23] rounded-lg p-6 text-center">
                          <p className="text-[#6B8E23] font-semibold text-lg">✓ Thank you!</p>
                          <p className="text-[#DCCCA3] mt-2">We'll reach out soon to find the perfect adventure for you.</p>
                        </div>
                      ) : (
                        <div className="bg-[#6B8E23]/20 border-2 border-[#6B8E23] rounded-lg p-6 mt-6">
                          <h3 className="text-xl font-bold text-[#C65D2B] mb-4 text-center">Find Your Perfect Fit</h3>
                          <p className="text-[#DCCCA3] mb-6 text-center">
                            Leave your contact details and we'll help you find a retreat that's perfect for your experience level!
                          </p>
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            setIsSubmittingContact(true);
                            // For now, just log it and show success
                            console.log('Contact request:', { email: contactEmail, phone: contactPhone, retreat: retreat.name });
                            setContactSubmitted(true);
                            setIsSubmittingContact(false);
                          }} className="space-y-4">
                            <div>
                              <Label htmlFor="contactEmail" className="text-[#DCCCA3] mb-2 block">Email *</Label>
                              <Input
                                id="contactEmail"
                                type="email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="bg-[#2E4A34] border-[#6B8E23] text-[#F7F5EB]"
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactPhone" className="text-[#DCCCA3] mb-2 block">Phone Number *</Label>
                              <Input
                                id="contactPhone"
                                type="tel"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                placeholder="+44 123 456 789"
                                required
                                className="bg-[#2E4A34] border-[#6B8E23] text-[#F7F5EB]"
                              />
                            </div>
                            <Button
                              type="submit"
                              disabled={isSubmittingContact}
                              className="w-full bg-[#C65D2B] hover:bg-[#C65D2B]/90 text-[#F7F5EB] py-3 disabled:opacity-50"
                            >
                              {isSubmittingContact ? 'Submitting...' : 'Submit'}
                            </Button>
                          </form>
                        </div>
                      )}
                    </>
                  ) : formData.beenHiking === 'No' && retreat.beginnerFriendly ? (
                    // Message for beginners on the July retreat
                    <>
                      <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#6B8E23]/20 border-2 border-[#6B8E23] mb-4 sm:mb-6">
                          <span className="text-4xl sm:text-5xl">🌿</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-2 px-2 leading-tight">Perfect for Beginners!</h2>
                      </div>

                      <div className="bg-[#6B8E23]/10 border-2 border-[#6B8E23]/50 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8">
                        <div className="space-y-4 text-[#F7F5EB] leading-relaxed">
                          <p className="text-lg">
                            Great news! This retreat is <strong className="text-[#6B8E23]">beginner-friendly</strong> and perfect for your first hiking adventure.
                          </p>
                          
                          <p className="text-lg">
                            This experience is designed to be accessible for all fitness levels. You'll experience stunning landscapes and breathtaking views at your own pace.
                          </p>
                          
                          <div className="my-6 pt-6 border-t border-[#6B8E23]/30">
                            <p className="text-lg font-semibold text-[#6B8E23] mb-4">What makes this retreat beginner-friendly:</p>
                            <ul className="space-y-3 text-[#DCCCA3]">
                              <li className="flex items-start">
                                <span className="text-[#6B8E23] mr-3 mt-1 flex-shrink-0">✓</span>
                                <span>Flexible hiking distances - hike as much or as little as you like.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-[#6B8E23] mr-3 mt-1 flex-shrink-0">✓</span>
                                <span>Flexible difficulty levels - our guides adapt to your fitness level.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-[#6B8E23] mr-3 mt-1 flex-shrink-0">✓</span>
                                <span>No prior hiking experience required - we'll teach you the basics.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-[#6B8E23] mr-3 mt-1 flex-shrink-0">✓</span>
                                <span>Supportive group environment - everyone starts somewhere!</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="bg-[#2E4A34] rounded-lg p-4 border border-[#6B8E23]/50">
                            <p className="text-[#DCCCA3] text-sm italic">
                              You'll experience the same stunning landscapes of Mont Blanc, but with the flexibility to choose your adventure level. You'll have an unforgettable experience!
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Acknowledgment Checkbox for beginner-friendly retreat */}
                      <div className="bg-[#2E4A34]/50 rounded-xl p-6 border-2 border-[#6B8E23]/50">
                        <label className="flex items-start cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-2 border-[#6B8E23] bg-[#2E4A34] text-[#C65D2B] focus:ring-2 focus:ring-[#C65D2B] focus:ring-offset-0 cursor-pointer"
                          />
                          <span className="ml-3 text-[#DCCCA3] text-sm leading-relaxed group-hover:text-[#F7F5EB] transition-colors">
                            I understand that this is an adventure activity and will follow all safety instructions and guidelines provided by the guides.
                          </span>
                        </label>
                      </div>
                    </>
                  ) : formData.beenHiking === 'Yes' && retreat.beginnerFriendly ? (
                    // Message for experienced hikers on beginner-friendly July retreat
                    <>
                      <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#6B8E23]/20 border-2 border-[#6B8E23] mb-4 sm:mb-6">
                          <span className="text-4xl sm:text-5xl">🏔️</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-2 px-2 leading-tight">Welcome Hikers!</h2>
                      </div>

                      <div className="bg-[#6B8E23]/10 border-2 border-[#6B8E23]/50 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8">
                        <div className="space-y-4 text-[#F7F5EB] leading-relaxed">
                          <p className="text-lg">
                            Great to have you with your hiking experience! This retreat offers <strong className="text-[#6B8E23]">flexible difficulty levels</strong> so you can choose your adventure intensity.
                          </p>
                          
                          <p className="text-lg">
                            Whether you want to challenge yourself on full hiking days or take a more relaxed pace, you'll have an amazing experience in Mont Blanc.
                          </p>
                          
                        </div>
                      </div>

                      {/* Acknowledgment Checkbox */}
                      <div className="bg-[#2E4A34]/50 rounded-xl p-6 border-2 border-[#6B8E23]/50">
                        <label className="flex items-start cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-2 border-[#6B8E23] bg-[#2E4A34] text-[#C65D2B] focus:ring-2 focus:ring-[#C65D2B] focus:ring-offset-0 cursor-pointer"
                          />
                          <span className="ml-3 text-[#DCCCA3] text-sm leading-relaxed group-hover:text-[#F7F5EB] transition-colors">
                            I understand that this is an adventure activity and will follow all safety instructions and guidelines provided by the guides.
                          </span>
                        </label>
                      </div>
                    </>
                  ) : (
                    // Original message for users with hiking experience on August retreat
                    <>
                      <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/20 border-2 border-red-600 mb-4 sm:mb-6">
                          <span className="text-4xl sm:text-5xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-2 px-2 leading-tight">Important Notice — Read Before Booking</h2>
                      </div>

                      <div className="bg-red-600/10 border-2 border-red-600/50 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8">
                        <div className="space-y-4 text-[#F7F5EB] leading-relaxed">
                          <p className="text-lg">
                            This hiking trip involves <strong className="text-red-400">challenging terrain, steep climbs, and extended walking periods</strong> that require a <strong className="text-red-400">moderate to high fitness level</strong>.
                          </p>
                          
                          <p className="text-lg">
                            It is <strong className="text-red-400">not recommended for beginners</strong> or those with limited hiking experience. Participants should be comfortable with uneven surfaces, sustained physical effort, and outdoor conditions that may include altitude, variable weather, and long distances.
                          </p>
                          
                          <div className="my-6 pt-6 border-t border-red-600/30">
                            <p className="text-lg font-semibold text-red-400 mb-4">Before booking, please ensure you:</p>
                            <ul className="space-y-3 text-[#DCCCA3]">
                              <li className="flex items-start">
                                <span className="text-red-400 mr-3 mt-1 flex-shrink-0">✓</span>
                                <span>Have prior hiking or trekking experience.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-red-400 mr-3 mt-1 flex-shrink-0">✓</span>
                                <span>Are in good physical condition and can manage uphill and downhill sections safely.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-red-400 mr-3 mt-1 flex-shrink-0">✓</span>
                                <span>Understand that this is an adventure activity, not a casual walk.</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="bg-[#2E4A34] rounded-lg p-4 border border-[#6B8E23]/50">
                            <p className="text-[#DCCCA3] text-sm italic">
                              If you're unsure whether this trip is suitable for you, we recommend contacting our team for guidance before completing your purchase.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Acknowledgment Checkbox - only show for users with hiking experience */}
                      <div className="bg-[#2E4A34]/50 rounded-xl p-6 border-2 border-[#6B8E23]/50">
                        <label className="flex items-start cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-2 border-[#6B8E23] bg-[#2E4A34] text-[#C65D2B] focus:ring-2 focus:ring-[#C65D2B] focus:ring-offset-0 cursor-pointer"
                          />
                          <span className="ml-3 text-[#F7F5EB] text-lg leading-relaxed group-hover:text-[#DCCCA3] transition-colors">
                            I have read and understood the above notice. I confirm that I have the necessary experience and fitness level for this challenging hiking retreat, and I accept full responsibility for my participation.
                          </span>
                        </label>
                      </div>
                    </>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4 sm:mb-6">Review & Confirm</h2>
                  
                  {/* Retreat Summary */}
                  <div className="bg-[#C65D2B]/10 border border-[#C65D2B]/30 rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-[#F7F5EB] mb-3">{formData.retreat}</h3>
                    <div className="grid md:grid-cols-2 gap-3 text-sm mb-4">
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
                      {formData.accommodationType && (
                        <div>
                          <span className="text-[#DCCCA3]">Accommodation:</span>
                          <p className="text-[#F7F5EB] font-semibold">{formData.accommodationType}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Price Display */}
                    <div className="border-t border-[#C65D2B]/30 pt-4">
                      {retreat.hasAccommodationOptions && formData.accommodationType ? (
                        // Show selected accommodation pricing
                        (() => {
                          const selectedAccom = retreat.accommodationOptions.find(opt => opt.name === formData.accommodationType);
                          return (
                            <div className="grid md:grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-[#DCCCA3]">Total Price:</span>
                                <p className="text-[#F7F5EB] font-semibold">£{selectedAccom.price} per person</p>
                              </div>
                              <div>
                                <span className="text-[#DCCCA3]">Deposit Required:</span>
                                <p className="text-[#F7F5EB] font-semibold">£{selectedAccom.deposit} per person</p>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        // Default pricing
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-[#DCCCA3]">Total Price:</span>
                            <p className="text-[#F7F5EB] font-semibold">£{retreat.price} per person</p>
                          </div>
                          <div>
                            <span className="text-[#DCCCA3]">Deposit Required:</span>
                            <p className="text-[#F7F5EB] font-semibold">£{retreat.deposit} per person</p>
                          </div>
                        </div>
                      )}
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
                      <div>
                        <span className="text-[#DCCCA3] text-sm">Gender:</span>
                        <p className="text-[#F7F5EB] text-lg">{formData.gender}</p>
                      </div>
                      <div>
                        <span className="text-[#DCCCA3] text-sm">Age:</span>
                        <p className="text-[#F7F5EB] text-lg">{formData.age}</p>
                      </div>
                      <div>
                        <span className="text-[#DCCCA3] text-sm">Have you ever been hiking?</span>
                        <p className="text-[#F7F5EB] text-lg">{formData.beenHiking}</p>
                      </div>
                      <div>
                        <span className="text-[#DCCCA3] text-sm">Hiking Experience:</span>
                        <p className="text-[#F7F5EB] text-lg">{formData.hikingExperience}</p>
                      </div>
                      <div>
                        <span className="text-[#DCCCA3] text-sm">Traveling:</span>
                        <p className="text-[#F7F5EB] text-lg">{formData.travelingAloneOrGroup}</p>
                      </div>
                      {formData.numberOfPeople && (
                        <div>
                          <span className="text-[#DCCCA3] text-sm">Number of People:</span>
                          <p className="text-[#F7F5EB] text-lg">{formData.numberOfPeople}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t border-[#6B8E23]/30 pt-4 mt-4">
                      <div className="space-y-3">
                        {(() => {
                          // Get the selected accommodation pricing
                          let fullPrice = retreat.price;
                          let deposit = retreat.deposit;
                          
                          if (retreat.hasAccommodationOptions && formData.accommodationType) {
                            const selectedAccom = retreat.accommodationOptions.find(opt => opt.name === formData.accommodationType);
                            if (selectedAccom) {
                              fullPrice = selectedAccom.price;
                              deposit = selectedAccom.deposit;
                            }
                          }
                          
                          return (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-[#DCCCA3] text-lg">Deposit to Pay Today:</span>
                                <p className="text-[#C65D2B] text-3xl font-bold">£{deposit}</p>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t border-[#6B8E23]/20">
                                <span className="text-[#DCCCA3] text-sm">Full Price: £{fullPrice}</span>
                                <span className="text-[#DCCCA3] text-sm">Remaining Balance: £{fullPrice - deposit}</span>
                              </div>
                              <p className="text-[#DCCCA3] text-sm mt-4 italic">
                                You'll pay the remaining balance closer to the retreat date
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6 sm:mt-8">
                {step > 1 && (
                  <Button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    variant="outline"
                    className="border-[#6B8E23] text-[#F7F5EB] hover:bg-[#6B8E23]/20 w-full sm:w-auto px-6 py-3 text-base sm:text-lg touch-manipulation"
                  >
                    Back
                  </Button>
                )}
                {/* Only show next/continue button if user has hiking experience OR is on beginner-friendly retreat OR is not on step 2 */}
                {step < 3 && !(step === 2 && formData.beenHiking === 'No' && !retreat.beginnerFriendly) ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={step === 2 && !termsAccepted}
                    className="bg-[#C65D2B] hover:bg-[#C65D2B]/90 disabled:opacity-50 disabled:cursor-not-allowed text-[#F7F5EB] w-full sm:w-auto sm:ml-auto px-6 py-3 text-base sm:text-lg touch-manipulation"
                  >
                    {step === 2 && retreat.beginnerFriendly && formData.beenHiking === 'No' ? 'Sounds Great - Continue' : step === 2 ? 'I Understand - Continue' : 'Next Step'}
                  </Button>
                ) : step === 3 ? (
                  <Button
                    type="submit"
                    disabled={isProcessing || soldOut}
                    className={`w-full sm:w-auto sm:ml-auto disabled:opacity-50 px-6 py-3 text-base sm:text-lg touch-manipulation ${
                      soldOut ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#C65D2B] hover:bg-[#C65D2B]/90'
                    } text-[#F7F5EB]`}
                  >
                    {soldOut ? (
                      'Sold Out'
                    ) : isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </Button>
                ) : null}
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

export default BookingPage;