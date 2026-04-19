import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { useState, useEffect } from 'react';
import { subscribeToSettings } from '../../lib/cms';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const unsub = subscribeToSettings(setSettings);
    return () => unsub();
  }, []);

  return (
    <footer className="bg-[#111] border-t border-white/5 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-24 relative z-10">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-6 sm:mb-8 group">
              <img 
                src="https://i.imgur.com/vQ18UQb.png" 
                alt="OutaTime Detail Logo" 
                className="h-24 sm:h-32 md:h-48 object-contain transition-opacity group-hover:opacity-80 mix-blend-screen contrast-125 brightness-90" 
                referrerPolicy="no-referrer"
              />
            </Link>
            <p className="text-[#d1d1d1]/60 text-sm mb-8 leading-relaxed font-light whitespace-pre-wrap">
              {settings?.home?.heroDesc || (
                <>
                  <strong className="text-white font-normal block mb-2">Detailed Car Ceramic Coating & Mobile Detailing</strong>
                  Serving Collin County, Texas. <br /><br />
                  <span className="text-[#d1d1d1] font-medium border-l-2 border-white/50 pl-3 block">
                    Focusing on <strong className="text-white">100% DI Spot Free Water</strong> for a flawless finish every time.
                  </span>
                </>
              )}
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/outatimedetail" 
                target="_blank" 
                rel="noreferrer" 
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#d1d1d1]/60 hover:text-white hover:border-white/50 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-500"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://web.facebook.com/OutatimeDetail/" 
                target="_blank" 
                rel="noreferrer" 
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#d1d1d1]/60 hover:text-white hover:border-white/50 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-500"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-10">
            <div>
              <h4 className="font-serif text-white text-xl mb-6 tracking-tight">Quick Links</h4>
              <ul className="space-y-4">
                <li><Link to="/services" className="text-[#d1d1d1]/60 hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em]">Services</Link></li>
                <li><Link to="/gallery" className="text-[#d1d1d1]/60 hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em]">Gallery</Link></li>
                <li><Link to="/about" className="text-[#d1d1d1]/60 hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em]">About</Link></li>
                <li><Link to="/contact" className="text-[#d1d1d1]/60 hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em]">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-serif text-white text-xl mb-6 tracking-tight">Hours</h4>
              <ul className="space-y-3 text-[#d1d1d1]/60 text-sm font-light">
                <li className="flex justify-between items-center"><span className="text-white/80">Mon - Fri</span><span>8:00 am - 8:00 pm</span></li>
                <li className="flex justify-between items-center"><span className="text-white/80">Saturday</span><span>9:00 am - 7:00 pm</span></li>
                <li className="flex justify-between items-center"><span className="text-white/80">Sunday</span><span>9:00 am - 7:00 pm</span></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-serif text-white text-xl mb-6 tracking-tight">Contact Us</h4>
            <ul className="space-y-8">
              <li className="flex items-start gap-4 text-[#d1d1d1]/60 text-sm font-light">
                <MapPin size={18} className="mt-0.5 text-white/30 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-white font-normal">Address</strong><br />
                  1401 Rolling Hills<br/>
                  Celina, TX 75009
                </span>
              </li>
              <li className="flex items-start gap-4 text-[#d1d1d1]/60 text-sm font-light">
                <Phone size={18} className="mt-0.5 text-white/30 shrink-0" />
                <div className="leading-relaxed flex flex-col">
                  <span className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Martin Bedard, Owner</span>
                  <a href={`tel:${settings?.contact?.phone || '469-815-1949'}`} className="hover:text-white transition-colors text-white">{settings?.contact?.phone || '469-815-1949'}</a>
                </div>
              </li>
              <li className="flex items-start gap-4 text-[#d1d1d1]/60 text-sm font-light w-full">
                <Mail size={18} className="mt-0.5 text-white/30 shrink-0" />
                <a href={`mailto:${settings?.contact?.email || 'martin@outatimedetail.com'}`} className="hover:text-white transition-colors block leading-relaxed" style={{ wordBreak: 'break-all' }} title={settings?.contact?.email || 'martin@outatimedetail.com'}>{settings?.contact?.email || 'martin@outatimedetail.com'}</a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
             <div className="w-full h-48 md:h-full min-h-[240px] rounded-sm overflow-hidden border border-white/10 group relative bg-[#171717]">
               <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.1378370959085!2d-96.80415302341258!3d33.36746975084931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c4786d79a4fa1%3A0xc3fde9b8e8f80459!2s1401%20Rolling%20Hills%20Ln%2C%20Celina%2C%20TX%2075009!5e0!3m2!1sen!2sus!4v1714589000000!5m2!1sen!2sus" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen={false} 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
                 className="absolute inset-0 w-full h-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 object-cover"
               ></iframe>
             </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#d1d1d1]/40 text-[10px] uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} OUTATIME DETAIL. ALL RIGHTS RESERVED.
          </p>
          <p className="text-[#d1d1d1]/40 text-[10px] uppercase tracking-[0.2em]">
            OWNED BY MARTIN BEDARD
          </p>
        </div>
      </div>
    </footer>
  );
}
