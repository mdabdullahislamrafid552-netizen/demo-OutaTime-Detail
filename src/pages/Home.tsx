import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Star, Droplets, Sparkles, ArrowRight, Award, MapPin, Shield, Wind, Settings2, Wrench, PlusCircle } from 'lucide-react';
import { subscribeToServices, subscribeToSettings } from '../lib/cms';

const ease = [0.16, 1, 0.3, 1];

const iconMap: Record<string, any> = {
  Sparkles, Star, Droplets, Wind, Settings2, Wrench, ShieldCheck
};

const defaultServices = [
  {
    title: 'Exterior Detail',
    desc: 'Transform your vehicle with our Exterior Detail service, where we ensure a pristine finish with a full wash using spot-free water for long-lasting wax protection. Every inch of your car will shine, with meticulous attention given to cleaning all glass surfaces. Experience the difference of expert car detailing that prioritizes quality and care—because we believe in attention to detail, every time.',
    icon: 'Droplets',
    img: 'https://www.apexautoperformance.com/wp-content/uploads/2023/02/What-is-Exterior-Detailing-of-a-Car.jpg'
  },
  {
    title: 'Interior Detail',
    desc: 'Interior cleaning where it matters. Seats, carpets, doors, dash, vents, floor mats and glass. The kind of clean that makes you actually want to get in your car!',
    icon: 'Wind',
    img: 'https://shineprosnh.com/wp-content/uploads/2024/07/interior-detail.jpeg'
  },
  {
    title: 'Full Detail',
    desc: 'The complete reset! Every surface, inside and out. Paint is decontaminated, the interior deep cleaned, trim restored. Get your car looking better than new!',
    icon: 'Star',
    img: 'https://sharpdetailsilverspring.com/images/car2.jpg'
  },
  {
    title: 'Date Night Package',
    desc: 'Looking to have a quick detail for that special occasion? This interior/exterior service offers an exterior wash, tires/wheels cleaned and vehicle dried off. Interior will include a quick vacuum, wipe down of all surfaces and glass cleaned.',
    icon: 'Sparkles',
    img: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Ceramic Coating',
    desc: 'The last protection your paint will need. A permanent bond coating that repels water, resists contamination, and keeps your car looking freshly detailed for years, not weeks! Service is applied by hand, paint surface thoroughly and properly prepped to ensure the coating properly bonds to the paint.',
    icon: 'ShieldCheck',
    img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800'
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
            src={sHome.heroBg || "https://scontent.fdac3-2.fna.fbcdn.net/v/t39.30808-6/637986933_10231238088631296_5178247587738125061_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=2a1932&_nc_ohc=EhUAi3tyn4EQ7kNvwH0sSnS&_nc_oc=Adp-62SIXuujXXiIZTIS06Y_f47nsyfuCHtt9OVaMtlKSojFLf7tQVn0OJnY6L1V5LA&_nc_zt=23&_nc_ht=scontent.fdac3-2.fna&_nc_gid=FRqt54OMl59-C-bjVOOa7w&_nc_ss=7a389&oh=00_Af1c0FZcrNG_ab8Y-uceYh-7mxatXal_l6j8fe6EO00SXQ&oe=69E99C05"} 
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
            <a href="https://app.urable.com/virtual-shop/Q6yNmIRJFJJUoAWylz2J" target="_blank" rel="noreferrer" className="btn-primary w-full sm:w-auto">
              Book Now
            </a>
            <a href="https://app.urable.com/virtual-shop/Q6yNmIRJFJJUoAWylz2J" target="_blank" rel="noreferrer" className="btn-outline w-full sm:w-auto">
              Explore Services
            </a>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Services / Add-ons Preview */}
      <section className="py-32 bg-[#0a0a0a] border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]">
          {/* Subtle animated background orbs */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16,1,0.3,1] }}
              className="inline-flex items-center justify-center gap-4 mb-6"
            >
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/20"></div>
              <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#d1d1d1]/50">
                Specialized Care
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/20"></div>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 1, ease: [0.16,1,0.3,1] }}
              className="text-4xl md:text-6xl font-serif tracking-tight"
            >
              Enhanced Sequence
            </motion.h2>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {[
              {
                title: 'Faded Black Trim Restoration',
                desc: 'Revitalize your exterior plastics and seals with our premium trim restoration service. Designed for up to 2 years of protection, our solution safeguards against harsh weather conditions, fading, and wear.',
              },
              {
                title: 'Engine Bay Detail',
                desc: 'Revitalize your engine bay with our specialized cleaning and protection services. We focus on safely cleaning baked on grease and dirt from the engine to ensure they shine like new.',
              },
              {
                title: 'Paint Rock Chip Repair',
                desc: 'Our service works best for small to medium sized chips and can transform a heavily chipped car into a pristine almost new condition. Most repairs will dramatically improve your vehicle’s overall appearance.',
              },
              {
                title: 'Custom Add-Ons',
                desc: 'Any service or package can be customized to your needs. We offer additional localized paint correction, interior ozone treatments, pet hair removal, and more to perfect your vehicle.',
              }
            ].map((addon, idx) => (
              <motion.div 
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: [0.16,1,0.3,1] } }
                }}
                className="relative bg-[#111] bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] border border-white/5 p-8 group hover:border-white/20 focus-within:border-white/20 transition-all duration-700 rounded-2xl overflow-hidden flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] hover:-translate-y-2"
              >
                {/* Metallic Top Sheen */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Animated Background Large Number */}
                <div className="absolute -right-4 -bottom-6 text-[160px] font-black leading-none italic pointer-events-none select-none z-0 text-transparent bg-clip-text bg-gradient-to-b from-white/[0.04] to-transparent group-hover:from-white/[0.08] transition-all duration-700 group-hover:-translate-x-4 group-hover:-translate-y-4 group-hover:scale-110">
                  0{idx + 1}
                </div>
                
                <div className="relative z-10 w-full mb-10">
                  <div className="flex items-center gap-4 mb-8 relative z-20">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 text-white font-serif text-lg group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-700 shadow-inner">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#d1d1d1]/50 group-hover:text-[#d1d1d1]/90 transition-colors duration-500">Phase 0{idx + 1}</span>
                  </div>
                  
                  <h3 className="text-2xl font-serif text-white mb-4 pr-4 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all duration-500">{addon.title}</h3>
                  <p className="text-[#d1d1d1]/60 text-sm leading-relaxed font-light group-hover:text-[#d1d1d1]/80 transition-colors duration-500 relative z-20">
                    {addon.desc}
                  </p>
                </div>
                
                <div className="relative z-10 mt-auto border-t border-white/5 pt-6 w-full transform transition-all duration-700">
                  <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-white/30 to-transparent group-hover:w-full transition-all duration-1000 ease-[0.16,1,0.3,1]"></div>
                  <a href="https://app.urable.com/virtual-shop/Q6yNmIRJFJJUoAWylz2J" target="_blank" rel="noreferrer" className="relative z-20 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-bold text-white/40 group-hover:text-white transition-all duration-500 w-max">
                    Explore <ArrowRight size={14} className="transform group-hover:translate-x-2 transition-transform duration-500" />
                  </a>
                </div>
              </motion.div>
            ))}
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
                  {sAbout.eyebrow || 'Customer Focused'}
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif mb-6 lg:mb-10 leading-[1.1] tracking-tight">
                  {sAbout.title1 || 'Detailing'} <br/>
                  <span className="italic text-white/90">{sAbout.title2 || 'Services.'}</span>
                </h2>
                
                <div className="space-y-6 lg:space-y-8 text-[#d1d1d1]/70 font-light leading-relaxed text-base lg:text-lg">
                  <p>
                    {sAbout.p1 || "Outatime Detailing LLC is your premier destination for top-quality car detailing services that will breathe new life into your vehicle. We are committed to upholding the highest standards of professionalism and are fully insured for your peace of mind. We take pride in using premium, eco-friendly products to ensure a flawless finish that exceeds your expectations."}
                  </p>
                  <p>
                    {sAbout.p2 || "We use 100% deionized water which ensures no water spots, even in the Texas sun! We not only guarantee an impeccable result but also provide enhanced protection for your vehicle's surfaces."}
                  </p>
                  <p>
                    {sAbout.p3 || "Contact us to view available services and to discuss your vehicle's needs. All services can be customized to deliver a solution that works best for you and your vehicle."}
                  </p>
                  
                  <div className="pt-4">
                    <Link to="/about" className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-white hover:text-[#d1d1d1] transition-colors border-b border-white/30 hover:border-white pb-1 w-max">
                      More Info <ArrowRight size={14} />
                    </Link>
                  </div>
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
              <a href="https://app.urable.com/virtual-shop/Q6yNmIRJFJJUoAWylz2J" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#d1d1d1] hover:text-white transition-colors group pb-2 border-b border-white/10 hover:border-white/50">
                All Services <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500 ease-out" />
              </a>
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
                        <a 
                          href="https://app.urable.com/virtual-shop/Q6yNmIRJFJJUoAWylz2J" target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-colors duration-300 md:opacity-0 group-hover:opacity-100"
                        >
                          Request Quote <ArrowRight size={14} />
                        </a>
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
