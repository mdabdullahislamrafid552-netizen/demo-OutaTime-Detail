import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscribeToServices, subscribeToSettings } from '../lib/cms';

const ease = [0.16, 1, 0.3, 1];

const defaultServices = [
  {
    id: 'exterior-detail',
    title: 'Exterior Detail',
    subtitle: 'Gloss & Protection',
    description: 'Transform your vehicle with our Exterior Detail service, where we ensure a pristine finish with a full wash using spot-free water for long-lasting wax protection. Every inch of your car will shine, with meticulous attention given to cleaning all glass surfaces. Experience the difference of expert car detailing that prioritizes quality and care—because we believe in attention to detail, every time.',
    features: ['Spot-free water wash', 'Long-lasting wax protection', 'Glass cleaning', 'Meticulous attention to detail'],
    img: 'https://www.apexautoperformance.com/wp-content/uploads/2023/02/What-is-Exterior-Detailing-of-a-Car.jpg'
  },
  {
    id: 'interior-detail',
    title: 'Interior Detail',
    subtitle: 'Sanitize & Restore',
    description: 'Interior cleaning where it matters. Seats, carpets, doors, dash, vents, floor mats and glass. The kind of clean that makes you actually want to get in your car!',
    features: ['Seats and carpets', 'Doors and dash', 'Vents and floor mats', 'Glass cleaning'],
    img: 'https://shineprosnh.com/wp-content/uploads/2024/07/interior-detail.jpeg'
  },
  {
    id: 'full-detail',
    title: 'Full Detail',
    subtitle: 'The Complete Reset',
    description: 'The complete reset! Every surface, inside and out. Paint is decontaminated, the interior deep cleaned, trim restored. Get your car looking better than new!',
    features: ['Every surface inside and out', 'Paint decontamination', 'Interior deep clean', 'Trim restoration'],
    img: 'https://sharpdetailsilverspring.com/images/car2.jpg'
  },
  {
    id: 'date-night-package',
    title: 'Date Night Package',
    subtitle: 'Quick & Clean',
    description: 'Looking to have a quick detail for that special occasion? This interior/exterior service offers an exterior wash, tires/wheels cleaned and vehicle dried off. Interior will include a quick vacuum, wipe down of all surfaces and glass cleaned.',
    features: ['Exterior wash', 'Tires/wheels cleaned', 'Vehicle dried off', 'Quick interior vacuum and wipe down'],
    img: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ceramic-coating',
    title: 'Ceramic Coating',
    subtitle: 'Permanent Bond',
    description: 'The last protection your paint will need. A permanent bond coating that repels water, resists contamination, and keeps your car looking freshly detailed for years, not weeks! Service is applied by hand, paint surface thoroughly and properly prepped to ensure the coating properly bonds to the paint.',
    features: ['Permanent bond coating', 'Repels water', 'Resists contamination', 'Applied by hand with thorough prep'],
    img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800'
  }
];

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const unsub = subscribeToServices((data) => {
      if (data.length > 0) {
        setServices(data.sort((a,b) => a.order - b.order));
      } else {
        setServices(defaultServices); // Fallback
      }
    });
    const unsubSettings = subscribeToSettings(setSettings);
    return () => { unsub(); unsubSettings(); };
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <section className="pt-40 pb-24 bg-[#111] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="overflow-hidden mb-6">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease }}
              className="text-5xl md:text-7xl font-serif tracking-tight"
            >
              Our <span className="italic text-white/90">Services</span>
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.p 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease, delay: 0.2 }}
              className="text-[#d1d1d1]/60 max-w-2xl mx-auto text-lg font-light leading-relaxed"
            >
              Uncompromising quality and attention to detail. We bring premium auto care directly to your driveway in Collin County.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-32 bg-[#171717]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="space-y-40">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                id={service.id}
                className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 lg:gap-24 items-center`}
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2, ease }}
                  className="w-full md:w-1/2"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm group">
                    <img 
                      src={service.img} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors duration-700 group-hover:bg-transparent"></div>
                  </div>
                </motion.div>

                <div className="w-full md:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease, delay: 0.2 }}
                  >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#d1d1d1]/50 mb-4 block">
                      {service.subtitle}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif mb-4 tracking-tight">{service.title}</h2>
                    
                    {service.price && (
                      <div className="text-xl text-white/90 font-medium mb-8 border-l-2 border-white/50 pl-4 py-1">
                        {service.price}
                      </div>
                    )}
                    
                    {service.description && (
                      <p className="text-[#d1d1d1]/70 leading-relaxed mb-10 font-light text-lg">
                        {service.description}
                      </p>
                    )}
                    
                    <ul className="space-y-4 mb-10 w-full">
                      {(service.features || []).slice(0, 6).map((feature: string, i: number) => (
                        <li key={i} className="flex items-center gap-4">
                          <CheckCircle2 size={16} className="text-white/40 shrink-0" />
                          <span className="text-base text-[#d1d1d1] font-light tracking-wide">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a href="https://app.urable.com/virtual-shop/Q6yNmIRJFJJUoAWylz2J" target="_blank" rel="noreferrer" className="btn-outline inline-block">
                      Request Quote
                    </a>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
