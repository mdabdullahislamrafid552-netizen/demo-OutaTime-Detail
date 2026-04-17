import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { saveLead, subscribeToSettings } from '../lib/cms';

const ease = [0.16, 1, 0.3, 1];

export default function Contact() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const unsub = subscribeToSettings(setSettings);
    return () => unsub();
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    vehicle: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) return;

    setIsSubmitting(true);
    await saveLead(formData);
    setIsSubmitting(false);
    setSuccess(true);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      vehicle: '',
      service: '',
      message: ''
    });

    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  const handleChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="w-full">
      <section className="pt-40 pb-24 bg-[#111] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <div className="overflow-hidden mb-6">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease }}
                className="text-5xl md:text-7xl font-serif tracking-tight"
              >
                Request a <span className="italic text-white/90">Quote</span>
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.p 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease, delay: 0.2 }}
                className="text-[#d1d1d1]/60 max-w-2xl mx-auto text-lg font-light leading-relaxed"
              >
                Ready to restore your vehicle's finish? Contact us below or use our Urable booking system to schedule your mobile detail.
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease, delay: 0.3 }}
            >
              <h3 className="text-3xl font-serif mb-10 text-white tracking-tight">Contact Information</h3>
              
              <div className="space-y-10 mb-16">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors duration-500">
                    <Phone size={20} className="text-white/50 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50 mb-2">Phone</h4>
                    <a href={`tel:${settings?.contact?.phone || '+15551234567'}`} className="text-xl text-white hover:text-[#d1d1d1] transition-colors font-light tracking-wide">{settings?.contact?.phone || '(555) 123-4567'}</a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors duration-500">
                    <Mail size={20} className="text-white/50 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50 mb-2">Email</h4>
                    <a href={`mailto:${settings?.contact?.email || 'info@outatimedetail.com'}`} className="text-lg text-white hover:text-[#d1d1d1] transition-colors font-light tracking-wide">{settings?.contact?.email || 'info@outatimedetail.com'}</a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors duration-500">
                    <MapPin size={20} className="text-white/50 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50 mb-2">Service Area</h4>
                    <p className="text-lg text-white font-light tracking-wide">{settings?.contact?.area || 'Collin County, TX (Mobile)'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors duration-500">
                    <Clock size={20} className="text-white/50 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50 mb-2">Hours</h4>
                    <p className="text-lg text-white font-light tracking-wide">{settings?.contact?.hours || 'Mon - Sat: 8am - 6pm'}</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-10 rounded-sm">
                <h4 className="font-serif text-2xl mb-4 text-white tracking-tight">Instant Booking</h4>
                <p className="text-[#d1d1d1]/60 text-sm mb-8 leading-relaxed font-light">
                  For the fastest service, use our integrated Urable booking system to select your package and find an available time slot.
                </p>
                <button className="btn-primary w-full">
                  Book via Urable
                </button>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease, delay: 0.4 }}
              className="bg-[#171717] p-10 md:p-12 border border-white/5 rounded-sm relative overflow-hidden"
            >
              <h3 className="text-3xl font-serif mb-10 text-white tracking-tight">Send a Message</h3>
              
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label htmlFor="firstName" className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-white/50 transition-colors font-light"
                      placeholder="John"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="lastName" className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-white/50 transition-colors font-light"
                      placeholder="Doe"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-white/50 transition-colors font-light"
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="vehicle" className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50">Vehicle Make & Model</label>
                  <input 
                    type="text" 
                    id="vehicle" 
                    value={formData.vehicle}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-white/50 transition-colors font-light"
                    placeholder="e.g. 2023 Porsche 911"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="service" className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50">Service of Interest</label>
                  <select 
                    id="service" 
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-white/50 transition-colors appearance-none font-light"
                    disabled={isSubmitting}
                  >
                    <option value="" className="bg-[#171717]">Select a service...</option>
                    <option value="Paint Reconditioning" className="bg-[#171717]">Paint Reconditioning</option>
                    <option value="Full Detail" className="bg-[#171717]">Full Detail</option>
                    <option value="Exterior Detail" className="bg-[#171717]">Exterior Detail</option>
                    <option value="Interior Detail" className="bg-[#171717]">Interior Detail</option>
                    <option value="Other" className="bg-[#171717]">Other / Not Sure</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50">Message</label>
                  <textarea 
                    id="message" 
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-white/50 transition-colors resize-none font-light"
                    placeholder="How can we help you?"
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-outline w-full mt-8 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </form>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 bg-[#171717] flex flex-col items-center justify-center text-center p-10 z-10"
                  >
                    <div className="w-16 h-16 bg-white/5 flex items-center justify-center rounded-full mb-6">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-serif text-white mb-2 tracking-tight">Message Sent</h4>
                    <p className="text-[#d1d1d1]/60 font-light">We've received your request and will get back to you shortly.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
