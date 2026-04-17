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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-8 group">
              <img 
                src="https://i.imgur.com/vQ18UQb.png" 
                alt="OutaTime Detail Logo" 
                className="h-24 md:h-32 object-contain transition-opacity group-hover:opacity-80 mix-blend-screen contrast-125 brightness-90" 
                referrerPolicy="no-referrer"
              />
            </Link>
            <p className="text-[#d1d1d1]/60 max-w-sm mb-10 leading-relaxed font-light text-lg whitespace-pre-wrap">
              {settings?.home?.heroDesc || `Premium mobile auto detailing serving Collin County, Texas.`}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#d1d1d1]/60 hover:text-white hover:border-white/30 transition-all duration-500">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#d1d1d1]/60 hover:text-white hover:border-white/30 transition-all duration-500">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-white text-xl mb-8 tracking-tight">Quick Links</h4>
            <ul className="space-y-5">
              <li><Link to="/services" className="text-[#d1d1d1]/60 hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em]">Services</Link></li>
              <li><Link to="/gallery" className="text-[#d1d1d1]/60 hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em]">Gallery</Link></li>
              <li><Link to="/about" className="text-[#d1d1d1]/60 hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em]">About</Link></li>
              <li><Link to="/contact" className="text-[#d1d1d1]/60 hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em]">Contact</Link></li>
              <li><Link to="/admin" className="text-[#d1d1d1]/60 hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em]">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-white text-xl mb-8 tracking-tight">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-[#d1d1d1]/60 text-sm font-light">
                <MapPin size={18} className="mt-0.5 text-white/30 shrink-0" />
                <span className="leading-relaxed">{settings?.contact?.area || 'Collin County, TX'}<br/>Mobile Service</span>
              </li>
              <li className="flex items-center gap-4 text-[#d1d1d1]/60 text-sm font-light">
                <Phone size={18} className="text-white/30 shrink-0" />
                <a href={`tel:${settings?.contact?.phone || '(555) 123-4567'}`} className="hover:text-white transition-colors truncate">{settings?.contact?.phone || '(555) 123-4567'}</a>
              </li>
              <li className="flex items-center gap-4 text-[#d1d1d1]/60 text-sm font-light w-full">
                <Mail size={18} className="text-white/30 shrink-0" />
                <a href={`mailto:${settings?.contact?.email || 'info@outatimedetail.com'}`} className="hover:text-white transition-colors truncate block max-w-[200px]" title={settings?.contact?.email || 'info@outatimedetail.com'}>{settings?.contact?.email || 'info@outatimedetail.com'}</a>
              </li>
            </ul>
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
