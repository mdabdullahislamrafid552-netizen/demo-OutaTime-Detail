import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1];

export default function Contact() {
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
                    <a href="tel:+1234567890" className="text-xl text-white hover:text-[#d1d1d1] transition-colors font-light tracking-wide">(555) 123-4567</a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors duration-500">
                    <Mail size={20} className="text-white/50 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50 mb-2">Email</h4>
                    <a href="mailto:info@outatimedetail.com" className="text-lg text-white hover:text-[#d1d1d1] transition-colors font-light tracking-wide">info@outatimedetail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors duration-500">
                    <MapPin size={20} className="text-white/50 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50 mb-2">Service Area</h4>
                    <p className="text-lg text-white font-light tracking-wide">Collin County, TX (Mobile)</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors duration-500">
                    <Clock size={20} className="text-white/50 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50 mb-2">Hours</h4>
                    <p className="text-lg text-white font-light tracking-wide">Mon - Sat: 8am - 6pm</p>
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
              className="bg-[#171717] p-10 md:p-12 border border-white/5 rounded-sm"
            >
              <h3 className="text-3xl font-serif mb-10 text-white tracking-tight">Send a Message</h3>
              
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label htmlFor="firstName" className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-white/50 transition-colors font-light"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="lastName" className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-white/50 transition-colors font-light"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-white/50 transition-colors font-light"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="vehicle" className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50">Vehicle Make & Model</label>
                  <input 
                    type="text" 
                    id="vehicle" 
                    className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-white/50 transition-colors font-light"
                    placeholder="e.g. 2023 Porsche 911"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="service" className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50">Service of Interest</label>
                  <select 
                    id="service" 
                    className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-white/50 transition-colors appearance-none font-light"
                  >
                    <option value="" className="bg-[#171717]">Select a service...</option>
                    <option value="paint-reconditioning" className="bg-[#171717]">Paint Reconditioning</option>
                    <option value="full-detail" className="bg-[#171717]">Full Detail</option>
                    <option value="exterior" className="bg-[#171717]">Exterior Detail</option>
                    <option value="interior" className="bg-[#171717]">Interior Detail</option>
                    <option value="other" className="bg-[#171717]">Other / Not Sure</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] text-[#d1d1d1]/50">Message</label>
                  <textarea 
                    id="message" 
                    rows={4}
                    className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-white/50 transition-colors resize-none font-light"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button type="submit" className="btn-outline w-full mt-8">
                  Submit Request
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
