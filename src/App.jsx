import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/Navigation';
import HomePage from '@/pages/HomePage';
import RetreatsPage from '@/pages/RetreatsPage';
import BookingPage from '@/pages/BookingPage';
import BookingSuccessPage from '@/pages/BookingSuccessPage';
import ContactPage from '@/pages/ContactPage';
import ChamonixRetreatPage from '@/pages/ChamonixRetreatPage';
import AugustRetreatPage from '@/pages/AugustRetreatPage';

function App() {
  // Enable smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/retreats" element={<RetreatsPage />} />
        <Route path="/retreat/chamonix" element={<ChamonixRetreatPage />} />
        <Route path="/retreat/august" element={<AugustRetreatPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/booking/success" element={<BookingSuccessPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;