import { motion } from 'motion/react';
import { Award, MapPin, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { subscribeToSettings } from '../lib/cms';

const ease = [0.16, 1, 0.3, 1];

export default function About() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const unsub = subscribeToSettings(setSettings);
    return () => unsub();
  }, []);

  const sAbout = settings?.about || {};

  return (
    <div className="w-full">
      <section className="pt-40 pb-32 bg-[#171717]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease }}
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#d1d1d1]/50 mb-6 block">
                  {sAbout.eyebrow || 'Customer Focused'}
                </span>
                <h1 className="text-5xl md:text-7xl font-serif mb-10 leading-[1.1] tracking-tight">
                  {sAbout.title1 || 'Detailing'} <br/>
                  <span className="italic text-white/90">{sAbout.title2 || 'Services.'}</span>
                </h1>
                
                <div className="space-y-8 text-[#d1d1d1]/70 font-light leading-relaxed text-lg">
                  <p>
                    {sAbout.p1 || "Outatime Detailing LLC is your premier destination for top-quality car detailing services that will breathe new life into your vehicle. We are committed to upholding the highest standards of professionalism and are fully insured for your peace of mind. We take pride in using premium, eco-friendly products to ensure a flawless finish that exceeds your expectations."}
                  </p>
                  <p>
                    {sAbout.p2 || "We use 100% deionized water which ensures no water spots, even in the Texas sun! We not only guarantee an impeccable result but also provide enhanced protection for your vehicle's surfaces."}
                  </p>
                  <p>
                    {sAbout.p3 || "Contact us to view available services and to discuss your vehicle's needs. All services can be customized to deliver a solution that works best for you and your vehicle."}
                  </p>
                </div>

                <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-white/5 pt-12">
                  <div>
                    <Award className="text-white/30 mb-4" size={28} strokeWidth={1.5} />
                    <h4 className="font-serif text-xl text-white mb-2">Certified</h4>
                    <p className="text-[10px] text-[#d1d1d1]/50 uppercase tracking-[0.2em]">{sAbout.certs || 'Koch Chemie USA'}</p>
                  </div>
                  <div>
                    <MapPin className="text-white/30 mb-4" size={28} strokeWidth={1.5} />
                    <h4 className="font-serif text-xl text-white mb-2">Mobile</h4>
                    <p className="text-[10px] text-[#d1d1d1]/50 uppercase tracking-[0.2em]">{settings?.contact?.area || 'Collin County, TX'}</p>
                  </div>
                  <div>
                    <Shield className="text-white/30 mb-4" size={28} strokeWidth={1.5} />
                    <h4 className="font-serif text-xl text-white mb-2">Insured</h4>
                    <p className="text-[10px] text-[#d1d1d1]/50 uppercase tracking-[0.2em]">{sAbout.license || 'Fully Covered'}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease }}
                className="relative"
              >
                <div className="aspect-[3/4] relative overflow-hidden rounded-sm group">
                  <img 
                    src={sAbout.image || "https://instagram.fdac2-2.fna.fbcdn.net/v/t39.30808-6/653704684_122107888677280371_1967502274310306261_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ig_cache_key=Mzg1ODE4NTk4MzUxMTMyNzMwNQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjExNTJ4MTE1Mi5zZHIuQzMifQ%3D%3D&_nc_ohc=nWDc7TtmN6MQ7kNvwFkrzqR&_nc_oc=AdohPHylcaQc8Wb96RzqbaixDBgT_9Ir_OSGbbrYI_L3_sdkGP1tNI4L08BPbSO2K-0&_nc_ad=z-m&_nc_cid=1112&_nc_zt=23&_nc_ht=instagram.fdac2-2.fna&_nc_gid=sKHClttrTjDfqjlNIkBcvg&_nc_ss=7a32e&oh=00_Af3aphSrdegm7xz9Adyk7QhNWg-zzq6TJD5wfraadxqPrQ&oe=69E59C13"}
                    alt={sAbout.title1 || "Martin Bedard Detailing"} 
                    className="w-full h-full object-cover transition-transform duration-[3s] ease-[0.16,1,0.3,1] group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Decorative element */}
                <div className="absolute -bottom-12 -left-12 w-64 h-64 border border-white/5 rounded-full -z-10"></div>
                <div className="absolute -top-12 -right-12 w-48 h-48 border border-white/5 rounded-full -z-10"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
