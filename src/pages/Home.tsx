import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Star, Droplets, Sparkles, ArrowRight, Award, MapPin, Shield, Wind, Settings2, Wrench } from 'lucide-react';
import { subscribeToServices, subscribeToSettings } from '../lib/cms';

const ease = [0.16, 1, 0.3, 1];

const iconMap: Record<string, any> = {
  Sparkles, Star, Droplets, Wind, Settings2, Wrench
};

const defaultServices = [
  {
    title: 'Paint Reconditioning',
    desc: 'Certified correction to remove swirls, scratches, and oxidation.',
    icon: 'Sparkles',
    img: 'https://www.clearpro.com/wp-content/uploads/2024/07/how-to-restore-paint-on-a-car-2.webp'
  },
  {
    title: 'Full Detail',
    desc: 'Comprehensive interior and exterior reset for a showroom finish.',
    icon: 'Star',
    img: 'https://sharpdetailsilverspring.com/images/car2.jpg'
  },
  {
    title: 'Exterior Detail',
    desc: 'Deep wash using spot-free water for a flawless finish, decontamination, and premium sealant.',
    icon: 'Droplets',
    img: 'https://www.apexautoperformance.com/wp-content/uploads/2023/02/What-is-Exterior-Detailing-of-a-Car.jpg'
  },
  {
    title: 'Interior Detail',
    desc: 'Deep cleaning, stain treatment, and surface restoration for a factory-fresh feel.',
    icon: 'Wind',
    img: 'https://shineprosnh.com/wp-content/uploads/2024/07/interior-detail.jpeg'
  },
  {
    title: 'Trim Restoration',
    desc: 'Permanent ceramic-infused restoration of faded exterior plastics.',
    icon: 'Settings2',
    img: 'https://www.carzspa.com/wp-content/uploads/2021/01/trim-restoration-carzspa.jpg'
  },
  {
    title: 'Rock Chip Repair',
    desc: 'Precise color-matched touch-up to prevent rust and improve appearance.',
    icon: 'Wrench',
    img: 'https://www.motorbiscuit.com/wp-content/uploads/2022/07/Chrisfix-DIY-Rock-Chip-Repair-Demo-Video.jpg'
  }
];

export default function Home() {
  const [services, setServices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const unsub = subscribeToServices((data) => {
      if (data.length > 0) {
        setServices(data);
      } else {
        setServices(defaultServices); // Fallback
      }
    });
    const unsubSettings = subscribeToSettings(setSettings);
    return () => { unsub(); unsubSettings(); };
  }, []);

  const sAbout = settings?.about || {};
  const sHome = settings?.home || {};

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            src={sHome.heroBg || "https://i.pinimg.com/736x/25/b6/8f/25b68f7a4561e2c460dab0fdf768a35f.jpg"} 
            alt="Luxury car detailing" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171717] via-[#171717]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full mt-20">
          <div className="overflow-hidden mb-8 flex justify-start">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
            >
              <ShieldCheck size={16} className="text-[#d1d1d1]" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#d1d1d1]">{sHome.heroPreTitle || 'Paint Reconditioning Certified • Koch Chemie USA'}</span>
            </motion.div>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 leading-[1.1] tracking-tight text-left">
            <div className="overflow-hidden">
              <motion.span 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease, delay: 0.3 }}
                className="block"
              >
                {sHome.heroTitle1 || 'Premium Mobile'}
              </motion.span>
            </div>
            <div className="overflow-hidden pb-4">
              <motion.span 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease, delay: 0.4 }}
                className="block italic text-white/90"
              >
                {sHome.heroTitle2 || 'Auto Detailing'}
              </motion.span>
            </div>
          </h1>
          
          <div className="overflow-hidden mb-12">
            <motion.p 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease, delay: 0.5 }}
              className="text-lg md:text-xl text-[#d1d1d1]/70 max-w-2xl font-light tracking-wide leading-relaxed text-left whitespace-pre-wrap"
            >
              {sHome.heroDesc || `Convenience. Quality. Professional Results. \nServing Collin County, Texas directly at your location.`}
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-start gap-6"
          >
            <Link to="/contact" className="btn-primary w-full sm:w-auto">
              Book Now
            </Link>
            <Link to="/services" className="btn-outline w-full sm:w-auto">
              Explore Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="pt-32 pb-32 lg:pt-40 bg-[#171717]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0 lg:gap-20 items-center relative">
            
            {/* Image (Mobile: Top Left, Desktop: Right) */}
            <div className="w-[85%] sm:w-[70%] lg:w-full self-start lg:self-auto order-1 lg:order-2 z-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease }}
                className="relative"
              >
                <div className="aspect-[4/5] lg:aspect-[3/4] relative overflow-hidden rounded-sm group shadow-2xl">
                  <img 
                    src={sAbout.image || "https://instagram.fdac2-2.fna.fbcdn.net/v/t39.30808-6/653704684_122107888677280371_1967502274310306261_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ig_cache_key=Mzg1ODE4NTk4MzUxMTMyNzMwNQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjExNTJ4MTE1Mi5zZHIuQzMifQ%3D%3D&_nc_ohc=nWDc7TtmN6MQ7kNvwFkrzqR&_nc_oc=AdohPHylcaQc8Wb96RzqbaixDBgT_9Ir_OSGbbrYI_L3_sdkGP1tNI4L08BPbSO2K-0&_nc_ad=z-m&_nc_cid=1112&_nc_zt=23&_nc_ht=instagram.fdac2-2.fna&_nc_gid=sKHClttrTjDfqjlNIkBcvg&_nc_ss=7a32e&oh=00_Af3aphSrdegm7xz9Adyk7QhNWg-zzq6TJD5wfraadxqPrQ&oe=69E59C13"}
                    alt={sAbout.title1 || "Martin Bedard Detailing"} 
                    className="w-full h-full object-cover transition-transform duration-[3s] ease-[0.16,1,0.3,1] group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Decorative element */}
                <div className="absolute -bottom-12 -left-12 w-64 h-64 border border-white/5 rounded-full -z-10 hidden lg:block"></div>
                <div className="absolute -top-12 -right-12 w-48 h-48 border border-white/5 rounded-full -z-10 hidden lg:block"></div>
              </motion.div>
            </div>

            {/* Text (Mobile: Bottom Right overlapping, Desktop: Left) */}
            <div className="w-[90%] sm:w-[80%] lg:w-full self-end lg:self-auto order-2 lg:order-1 -mt-24 sm:-mt-32 lg:mt-0 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease }}
                className="bg-[#171717] lg:bg-transparent p-6 sm:p-8 lg:p-0 shadow-2xl lg:shadow-none border border-white/5 lg:border-none"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#d1d1d1]/50 mb-4 lg:mb-6 block">
                  {sAbout.eyebrow || 'The Story'}
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif mb-6 lg:mb-10 leading-[1.1] tracking-tight">
                  {sAbout.title1 || 'Craftsmanship'} <br/>
                  <span className="italic text-white/90">{sAbout.title2 || 'in Motion.'}</span>
                </h2>
                
                <div className="space-y-6 lg:space-y-8 text-[#d1d1d1]/70 font-light leading-relaxed text-base lg:text-lg">
                  <p>
                    {sAbout.p1 || "Founded by Martin Bedard, OutaTime Detail was born from a singular obsession: restoring vehicles to their absolute peak condition. We don't just wash cars; we preserve investments."}
                  </p>
                  <p>
                    {sAbout.p2 || "Based in Collin County, Texas, we recognized a need for high-end, uncompromising auto detailing that doesn't require you to leave your home or office. Our fully equipped mobile unit brings the studio experience directly to you."}
                  </p>
                  <p>
                    {sAbout.p3 || "We are proud to be Paint Reconditioning Certified by Koch Chemie USA, utilizing world-class German abrasives and compounds to achieve flawless finishes that standard detailing simply cannot match."}
                  </p>
                </div>

                <div className="mt-10 lg:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 border-t border-white/5 pt-8 lg:pt-12">
                  <div>
                    <Award className="text-white/30 mb-3 lg:mb-4" size={24} strokeWidth={1.5} />
                    <h4 className="font-serif text-lg lg:text-xl text-white mb-1 lg:mb-2">Certified</h4>
                    <p className="text-[9px] lg:text-[10px] text-[#d1d1d1]/50 uppercase tracking-[0.2em]">{sAbout.certs || 'Koch Chemie USA'}</p>
                  </div>
                  <div>
                    <MapPin className="text-white/30 mb-3 lg:mb-4" size={24} strokeWidth={1.5} />
                    <h4 className="font-serif text-lg lg:text-xl text-white mb-1 lg:mb-2">Mobile</h4>
                    <p className="text-[9px] lg:text-[10px] text-[#d1d1d1]/50 uppercase tracking-[0.2em]">{settings?.contact?.area || 'Collin County, TX'}</p>
                  </div>
                  <div>
                    <Shield className="text-white/30 mb-3 lg:mb-4" size={24} strokeWidth={1.5} />
                    <h4 className="font-serif text-lg lg:text-xl text-white mb-1 lg:mb-2">Insured</h4>
                    <p className="text-[9px] lg:text-[10px] text-[#d1d1d1]/50 uppercase tracking-[0.2em]">{sAbout.license || 'Fully Covered'}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-32 bg-[#171717]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="overflow-hidden">
              <motion.h2 
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease }}
                className="text-4xl md:text-6xl font-serif mb-6 tracking-tight"
              >
                Masterful Care
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-[#d1d1d1]/60 max-w-md text-lg font-light"
              >
                Precision detailing tailored to restore and protect your vehicle's finish.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease }}
            >
              <Link to="/services" className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#d1d1d1] hover:text-white transition-colors group pb-2 border-b border-white/10 hover:border-white/50">
                All Services <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500 ease-out" />
              </Link>
            </motion.div>
          </div>

          <div className="relative w-full">
            {/* Mobile swipe hint */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="md:hidden flex items-center gap-3 text-[#d1d1d1]/40 text-[10px] uppercase tracking-[0.3em] mb-6 ml-2"
            >
              <ArrowRight size={12} className="animate-pulse" /> Swipe to explore
            </motion.div>

            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6 pb-12 -mx-6 px-6 md:mx-0 md:px-0">
              {services.map((service, i) => {
                const Icon = iconMap[service.icon] || Sparkles;
                return (
                <motion.div 
                  key={service.id || i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.15, duration: 1.2, ease }}
                  className="group relative w-[85vw] sm:w-[400px] md:w-[calc(33.333%-1rem)] shrink-0 snap-center overflow-hidden rounded-sm bg-[#111] border border-white/5"
                >
                  <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
                    <img 
                      src={service.img} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-110 opacity-70 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-60"></div>
                    
                    <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between z-10">
                      <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center transform transition-all duration-700 group-hover:scale-110 group-hover:bg-white/20 group-hover:border-white/30">
                        <Icon size={20} className="text-white" strokeWidth={1.5} />
                      </div>
                      
                      <div className="transform transition-transform duration-700 ease-[0.16,1,0.3,1] md:translate-y-12 group-hover:translate-y-0">
                        <h3 className="text-3xl md:text-4xl font-serif mb-2 text-white tracking-tight">{service.title}</h3>
                        {service.price && <div className="text-sm font-medium text-white/90 mb-4">{service.price}</div>}
                        <p className="text-[#d1d1d1]/80 text-sm md:text-base leading-relaxed font-light md:opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 mb-6">
                          {service.desc}
                        </p>
                        <Link 
                          to="/contact" 
                          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-colors duration-300 md:opacity-0 group-hover:opacity-100"
                        >
                          Request Quote <ArrowRight size={14} />
                        </Link>
                        <div className="w-0 h-[1px] bg-white/30 mt-6 transition-all duration-700 ease-[0.16,1,0.3,1] group-hover:w-full hidden md:block"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )})}
            </div>
          </div>
        </div>
      </section>

      {/* Before / After Preview */}
      <section className="py-32 bg-[#111] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <div className="overflow-hidden mb-4">
              <motion.h2 
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease }}
                className="text-4xl md:text-6xl font-serif tracking-tight"
              >
                The Transformation
              </motion.h2>
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-[#d1d1d1]/60 max-w-lg mx-auto text-lg font-light"
            >
              Witness the difference of professional paint reconditioning and detailing.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease }}
              className="relative h-[60vh] md:h-[80vh] group overflow-hidden rounded-sm"
            >
              <img 
                src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1000" 
                alt="Before Detailing" 
                className="w-full h-full object-cover grayscale opacity-60 transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute bottom-10 left-10">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-3 block">The Condition</span>
                <span className="font-serif text-4xl text-white/80">Before</span>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease, delay: 0.2 }}
              className="relative h-[60vh] md:h-[80vh] group overflow-hidden rounded-sm"
            >
              <img 
                src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1000" 
                alt="After Detailing" 
                className="w-full h-full object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/80 mb-3 block">The Result</span>
                <span className="font-serif text-4xl text-white">After</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease, delay: 0.4 }}
            className="text-center mt-16"
          >
            <Link to="/gallery" className="btn-outline inline-block">
              View Full Gallery
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
