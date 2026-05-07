/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

// --- Types ---

type ServiceType = 'Strategy' | 'Operations' | 'Finance' | 'IT Consulting';

// --- Components ---

export default function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Strategy' as ServiceType,
    date: '',
    time: '',
    duration: 30
  });

  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorHeader, setErrorHeader] = useState('');

  // Validation
  const [isValid, setIsValid] = useState(false);

  const TIME_SLOTS = Array.from({ length: 19 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minutes = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  useEffect(() => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const selectedDate = new Date(`${formData.date}T${formData.time || '00:00'}`);
    const isFutureDate = selectedDate > new Date();
    
    setIsValid(
      formData.name.trim().length > 2 && 
      isEmailValid && 
      formData.date !== '' && 
      formData.time !== '' &&
      isFutureDate
    );
  }, [formData]);

  const submitBooking = async (data: typeof formData) => {
    setBookingStatus('loading');
    console.log('Attempting to submit booking with data:', {
      customerName: data.name,
      customerEmail: data.email,
      serviceType: data.service,
      appointmentSlot: `${data.date}T${data.time}`,
      duration: data.duration
    });

    try {
      const response = await fetch('https://rwib2je8se.execute-api.ap-south-1.amazonaws.com/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: data.name,
          customerEmail: data.email,
          serviceType: data.service,
          appointmentSlot: `${data.date}T${data.time}`,
          duration: data.duration,
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error body:', errorText);
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      
      setBookingStatus('success'); 
    } catch (error) {
      console.error('Submission error details:', error);
      setBookingStatus('error');
      setErrorHeader('Submission failed. Please check your network and try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    await submitBooking(formData);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      service: 'Strategy',
      date: '',
      time: '',
      duration: 30
    });
    setBookingStatus('idle');
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-200 font-sans selection:bg-blue-500/20 selection:text-blue-200 overflow-x-hidden relative">
      {/* Sophisticated Dark Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation Header */}
      <nav className="relative z-10 w-full px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">BOSTON</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-blue-500 font-semibold mt-[-4px]">Consultancy Services</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 md:space-x-8 text-sm font-medium text-slate-400">
          <span 
            onClick={() => setFormData({ ...formData, service: 'Strategy' })}
            className={`cursor-pointer transition-colors ${formData.service === 'Strategy' ? 'text-blue-500' : 'hover:text-white'}`}
          >
            Strategy
          </span>
          <span 
            onClick={() => setFormData({ ...formData, service: 'Operations' })}
            className={`cursor-pointer transition-colors ${formData.service === 'Operations' ? 'text-blue-500' : 'hover:text-white'}`}
          >
            Operations
          </span>
          <span 
            onClick={() => setFormData({ ...formData, service: 'IT Consulting' })}
            className={`cursor-pointer transition-colors ${formData.service === 'IT Consulting' ? 'text-blue-500' : 'hover:text-white'}`}
          >
            Technology
          </span>
          <div className="h-4 w-[1px] bg-slate-800 hidden md:block"></div>
          <span className="text-blue-500 hover:text-blue-400 cursor-pointer">Client Portal</span>
        </div>
      </nav>

      <main className="relative z-10 grid lg:grid-cols-2 gap-12 px-6 md:px-12 items-center py-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            2026 Advisory Booking
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            Design the future of your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">enterprise.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md">
            Book a strategic alignment session with our senior partners to identify high-growth opportunities and mitigate operational risks.
          </p>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img 
                src="https://lh3.googleusercontent.com/d/1p7slU9VcmN-xFgbOdBeG8crsGTKVAms6" 
                alt="Principal Consultant" 
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border border-white/10 shadow-2xl grayscale transition-all duration-500 group-hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0C10] bg-slate-800" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 font-medium">Joined by 400+ Fortune 500 decision makers.</p>
              </div>
              <p className="text-slate-400 text-sm mt-3 font-medium uppercase tracking-widest flex items-center gap-2">
                <span className="w-8 h-[1px] bg-blue-500/50"></span>
                Lead Strategist
              </p>
            </div>
          </div>
        </motion.div>

        {/* Booking Card */}
        <div className="relative flex justify-center lg:justify-end">
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-[440px] bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {bookingStatus === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-10 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed</h3>
                  <p className="text-slate-400 mb-8 text-sm">
                    A confirmation email has been sent to {formData.email}. Our team will reach out shortly to finalize the agenda.
                  </p>
                  <button
                    onClick={resetForm}
                    className="text-blue-500 text-sm font-bold hover:underline flex items-center gap-2 mx-auto"
                  >
                    Book another session
                    <ArrowRight size={14} />
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" className="p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white">Reserve Your Session</h3>
                    <p className="text-slate-500 text-sm">Select a convenient time for your consultation.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold ml-1 flex items-center gap-2">
                        <User size={12} />
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Alexander Hamilton"
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-slate-700 transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold ml-1 flex items-center gap-2">
                        <Mail size={12} />
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alexander@boston.com"
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-slate-700 transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    {/* Service Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold ml-1 flex items-center gap-2">
                        <Briefcase size={12} />
                        Consultation Service
                      </label>
                      <div className="relative">
                        <select
                          required
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white transition-all appearance-none cursor-pointer"
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value as ServiceType })}
                        >
                          <option value="Strategy">Strategy Consulting</option>
                          <option value="Operations">Operations excellence</option>
                          <option value="Finance">Financial advisory</option>
                          <option value="IT Consulting">IT Transformation</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                          <ChevronRight size={14} className="rotate-90" />
                        </div>
                      </div>
                    </div>

                    {/* Date & Time Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold ml-1 flex items-center gap-2">
                          <Calendar size={12} />
                          Date
                        </label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white transition-all cursor-pointer [color-scheme:dark]"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold ml-1 flex items-center gap-2">
                          <Clock size={12} />
                          Time
                        </label>
                        <div className="relative">
                          <select
                            required
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white transition-all appearance-none cursor-pointer"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          >
                            <option value="" disabled>Select</option>
                            {TIME_SLOTS.map(slot => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <ChevronRight size={14} className="rotate-90" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Duration Slider/Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold ml-1 flex items-center gap-2">
                        <Clock size={12} />
                        Session Duration
                      </label>
                      <div className="relative">
                        <select
                          required
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white transition-all appearance-none cursor-pointer"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                        >
                          <option value={30}>30 Minutes</option>
                          <option value={60}>60 Minutes (1 Hour)</option>
                          <option value={90}>90 Minutes</option>
                          <option value={120}>120 Minutes (2 Hours)</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                          <ChevronRight size={14} className="rotate-90" />
                        </div>
                      </div>
                    </div>

                    {/* Submission Status */}
                    {bookingStatus === 'error' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-rose-500 text-xs text-center font-medium mt-2 flex items-center justify-center gap-1"
                      >
                        <AlertCircle size={14} />
                        {errorHeader}
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                      disabled={!isValid || bookingStatus === 'loading'}
                      className={`w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]
                        ${isValid && bookingStatus !== 'loading' 
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border border-slate-700'
                        }`}
                    >
                      {bookingStatus === 'loading' ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          <span>Syncing with Cloud...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm Booking</span>
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest font-bold mt-4">
                      Boston Consultancy Services Int.
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-slate-600 font-bold border-t border-slate-900 mt-auto">
        <div className="mb-4 md:mb-0">© 2026 Boston Consultancy Services Int.</div>
        <div className="flex space-x-6">
          <span className="hover:text-slate-400 cursor-pointer">Global Presence</span>
          <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-400 cursor-pointer">Terms of Advisory</span>
        </div>
      </footer>
    </div>
  );
}
