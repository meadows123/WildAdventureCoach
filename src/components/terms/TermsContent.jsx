import React from 'react';
import {
  Mountain,
  Heart,
  Backpack,
  Home,
  AlertTriangle,
  Shield,
  Clock,
  CreditCard,
  XCircle,
  RefreshCw,
  Lock,
  FileText,
  Mail,
  Phone,
} from 'lucide-react';

const TermsContent = ({ className = '' }) => (
  <div
    className={`bg-[#1A1A1A]/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 md:p-10 border border-[#6B8E23]/20 space-y-8 ${className}`}
  >
    <div className="pb-6 border-b border-[#6B8E23]/20">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4">
        Retreat Terms & Conditions – Hiking & Yoga Retreat 2026
      </h2>
      <p className="text-[#DCCCA3] leading-relaxed mb-4">
        Welcome to the Hiking and Yoga Retreat 2026.
      </p>
      <p className="text-[#DCCCA3] leading-relaxed mb-2">
        Please read these Terms and Conditions carefully before confirming your booking.
      </p>
      <p className="text-[#DCCCA3] leading-relaxed">
        By proceeding with payment, you acknowledge that you have read, understood, and agreed to these terms.
      </p>
    </div>

    <div>
      <div className="flex items-center mb-4">
        <Mountain className="w-6 h-6 text-[#C65D2B] mr-3 flex-shrink-0" />
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">1. Retreat Types</h2>
      </div>
      <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
        <p>
          <strong className="text-[#F7F5EB]">Traveling Retreat:</strong> Multi-day guided hike through mountain
          regions, staying in different accommodations (chalets, refuges, or mountain lodges).
        </p>
        <p>
          <strong className="text-[#F7F5EB]">Stationary Retreat:</strong> Hosted at a single accommodation with daily
          yoga, meditation, and local hiking activities.
        </p>
        <p>Both retreat types require good fitness, appropriate gear, and active participation.</p>
      </div>
    </div>

    <div>
      <div className="flex items-center mb-4">
        <Heart className="w-6 h-6 text-[#C65D2B] mr-3 flex-shrink-0" />
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">2. Fitness & Preparedness</h2>
      </div>
      <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
        <p>You are responsible for ensuring you are physically fit to participate.</p>
        <p>The traveling retreat includes up to 8–9 hours of hiking per day on mountainous terrain.</p>
        <p>Adequate preparation and training before arrival are required for your safety and enjoyment.</p>
      </div>
    </div>

    <div>
      <div className="flex items-center mb-4">
        <Backpack className="w-6 h-6 text-[#C65D2B] mr-3 flex-shrink-0" />
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">3. Equipment & Gear</h2>
      </div>
      <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
        <p>You must bring all required personal equipment as listed in the provided packing list.</p>
        <p>For the traveling retreat, all belongings must be carried personally (recommended maximum 8 kg).</p>
        <p>The organizers are not responsible for issues arising from missing, unsuitable, or damaged equipment.</p>
      </div>
    </div>

    <div>
      <div className="flex items-center mb-4">
        <Home className="w-6 h-6 text-[#C65D2B] mr-3 flex-shrink-0" />
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">4. Accommodation & Meals</h2>
      </div>
      <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
        <p>Accommodation and meal arrangements differ by retreat type and may include shared rooms.</p>
        <p>Meals as listed in the retreat program are included. Snacks, extra food, and drinking water are your responsibility.</p>
      </div>
    </div>

    <div>
      <div className="flex items-center mb-4">
        <AlertTriangle className="w-6 h-6 text-[#C65D2B] mr-3 flex-shrink-0" />
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">5. Safety & Personal Responsibility</h2>
      </div>
      <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
        <p>Hiking and outdoor activities carry inherent risks including terrain challenges, altitude, and weather changes.</p>
        <p>You participate voluntarily and accept full responsibility for your own safety and belongings.</p>
        <p>You agree to follow all instructions from guides and teachers during the retreat.</p>
        <p>The organizers are not liable for accidents, injuries, or losses except in cases of proven negligence.</p>
      </div>
    </div>

    <div>
      <div className="flex items-center mb-4">
        <Shield className="w-6 h-6 text-[#C65D2B] mr-3 flex-shrink-0" />
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">6. Insurance & Medical Emergencies</h2>
      </div>
      <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
        <p>You must hold valid travel and health insurance covering hiking and outdoor activities.</p>
        <p>The organizers will assist in emergencies but are not responsible for medical or evacuation costs.</p>
        <p>You must inform the organizers of any relevant medical conditions prior to the retreat.</p>
      </div>
    </div>

    <div>
      <div className="flex items-center mb-4">
        <Clock className="w-6 h-6 text-[#C65D2B] mr-3 flex-shrink-0" />
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">7. Punctuality & Conduct</h2>
      </div>
      <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
        <p>Retreat activities start and end on fixed schedules.</p>
        <p>Late arrivals or missed sessions are non-refundable.</p>
        <p>Participants are expected to respect group timings and conduct themselves responsibly.</p>
      </div>
    </div>

    <div>
      <div className="flex items-center mb-4">
        <CreditCard className="w-6 h-6 text-[#C65D2B] mr-3 flex-shrink-0" />
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">8. Payment Policy</h2>
      </div>
      <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
        <p>A non-refundable deposit is required to confirm your booking.</p>
        <p>This covers insurance, accommodation, and operational pre-booking costs.</p>
        <p>The remaining balance must be paid by the stated deadline (typically 90 days before the retreat start).</p>
        <p>If payment is not received by the deadline, your spot may be reassigned.</p>
      </div>
    </div>

    <div>
      <div className="flex items-center mb-4">
        <XCircle className="w-6 h-6 text-[#C65D2B] mr-3 flex-shrink-0" />
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">9. Cancellation Policy</h2>
      </div>
      <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
        <p>
          <strong className="text-[#F7F5EB]">Deposit:</strong> Non-refundable under all circumstances.
        </p>
        <p>
          <strong className="text-[#F7F5EB]">Full Payment:</strong> Once paid, it is non-refundable.
        </p>
        <p>If you cannot attend, you may transfer your place to another participant (subject to organizer approval).</p>
        <p>Refunds are not provided for late arrival, early departure, or non-participation in activities.</p>
      </div>
    </div>

    <div>
      <div className="flex items-center mb-4">
        <RefreshCw className="w-6 h-6 text-[#C65D2B] mr-3 flex-shrink-0" />
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">10. Changes or Cancellations by Organizer</h2>
      </div>
      <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
        <p>In case of unforeseen events (e.g., extreme weather, border closures, force majeure), the organizer may adjust or reschedule the retreat.</p>
        <p>Credits or partial refunds will be considered only for unrecoverable costs.</p>
        <p>The organizer is not responsible for additional expenses (flights, insurance, personal gear, etc.) incurred by participants.</p>
      </div>
    </div>

    <div>
      <div className="flex items-center mb-4">
        <Lock className="w-6 h-6 text-[#C65D2B] mr-3 flex-shrink-0" />
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">11. Privacy & Data Protection</h2>
      </div>
      <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
        <p>Your personal data will be used solely for retreat communication and emergency purposes.</p>
        <p>Data will not be shared externally except when necessary for logistics or safety.</p>
        <p>You may request modification or deletion of your data at any time by contacting the organizer.</p>
      </div>
    </div>

    <div>
      <div className="flex items-center mb-4">
        <FileText className="w-6 h-6 text-[#C65D2B] mr-3 flex-shrink-0" />
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB]">12. Liability Waiver</h2>
      </div>
      <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
        <p>By joining this retreat, you acknowledge and accept that:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Participation involves inherent risks.</li>
          <li>You are responsible for your own safety, decisions, and well-being.</li>
          <li>The organizers, guides, and teachers are not liable for personal injury, loss, or damage except in cases of proven negligence.</li>
        </ul>
      </div>
    </div>

    <div className="pt-6 border-t border-[#6B8E23]/20">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4">Organizer Contact:</h2>
      <div className="space-y-3 text-[#DCCCA3]">
        <p className="font-semibold text-[#F7F5EB]">Rugilė Bazytė</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <a href="tel:+447549214155" className="flex items-center text-[#C65D2B] hover:text-[#C65D2B]/80">
            <Phone className="w-5 h-5 mr-2" />
            <span>+44 7549 214155</span>
          </a>
          <a href="mailto:wildadventurecoach@gmail.com" className="flex items-center text-[#C65D2B] hover:text-[#C65D2B]/80">
            <Mail className="w-5 h-5 mr-2" />
            <span>wildadventurecoach@gmail.com</span>
          </a>
        </div>
      </div>
    </div>

    <div className="pt-6 border-t border-[#6B8E23]/20">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F5EB] mb-4">Acknowledgment</h2>
      <div className="space-y-4 text-[#DCCCA3] leading-relaxed">
        <p>Proceeding with payment constitutes your full acceptance of these Terms and Conditions.</p>
        <p className="font-semibold">If you do not agree, please do not finalize your booking.</p>
      </div>
    </div>
  </div>
);

export default TermsContent;

