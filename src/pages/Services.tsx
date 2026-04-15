import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ease = [0.16, 1, 0.3, 1];

const services = [
  {
    id: 'paint-reconditioning',
    title: 'Paint Reconditioning',
    subtitle: 'Koch Chemie Certified Correction',
    description: 'A meticulous process to permanently remove surface imperfections like swirl marks, scratches, water spots, and oxidation. Restores clarity, depth, and gloss to your vehicle\'s clear coat.',
    features: ['Multi-stage machine compounding & polishing', 'Koch Chemie specialized abrasives', 'Removal of 80-95% of defects', 'Prepares surface for ceramic coating'],
    image: 'https://www.clearpro.com/wp-content/uploads/2024/07/how-to-restore-paint-on-a-car-2.webp'
  },
  {
    id: 'full-detail',
    title: 'Full Detail',
    subtitle: 'The Complete Reset',
    description: 'Our most comprehensive package. A thorough cleaning, decontamination, and protection of both the interior and exterior of your vehicle. Leaves no surface untouched.',
    features: ['Deep exterior wash & clay bar treatment', 'Interior vacuum, steam & extraction', 'Leather conditioning', 'Premium paint sealant applied'],
    image: 'https://sharpdetailsilverspring.com/images/car2.jpg'
  },
  {
    id: 'exterior-detail',
    title: 'Exterior Detail',
    subtitle: 'Gloss & Protection',
    description: 'A deep cleanse of your vehicle\'s exterior to remove embedded contaminants, followed by a high-quality sealant to protect the paint and enhance gloss.',
    features: ['Foam cannon pre-soak & hand wash', 'Iron decontamination & clay bar', 'Wheel faces & barrels cleaned', '6-month paint sealant'],
    image: 'https://www.apexautoperformance.com/wp-content/uploads/2023/02/What-is-Exterior-Detailing-of-a-Car.jpg'
  },
  {
    id: 'interior-detail',
    title: 'Interior Detail',
    subtitle: 'Sanitize & Restore',
    description: 'A deep cleaning of all interior surfaces. We use steam and specialized cleaners to remove dirt, stains, and odors, restoring your cabin to a factory-fresh feel.',
    features: ['Deep vacuuming of carpets & seats', 'Steam cleaning of all plastics & vinyl', 'Carpet & upholstery extraction', 'UV protection applied to dash'],
    image: 'https://shineprosnh.com/wp-content/uploads/2024/07/interior-detail.jpeg'
  },
  {
    id: 'trim-restoration',
    title: 'Trim Restoration',
    subtitle: 'Revive Faded Plastics',
    description: 'Permanent restoration of faded, oxidized exterior plastic trim. We don\'t use temporary dressings; we use ceramic-infused restorers that bond to the plastic.',
    features: ['Deep cleaning of textured plastics', 'Ceramic trim coating application', 'Restores deep black factory look', 'Lasts 12-24 months'],
    image: 'https://www.carzspa.com/wp-content/uploads/2021/01/trim-restoration-carzspa.jpg'
  },
  {
    id: 'rock-chip-repair',
    title: 'Rock Chip Repair',
    subtitle: 'Prevent Rust & Damage',
    description: 'Precise color-matched touch-up of rock chips and deep scratches to prevent rust and improve the overall appearance of your vehicle\'s front end.',
    features: ['Color-matched OEM paint', 'Chemical leveling for smooth finish', 'Prevents clear coat failure', 'Significantly improves appearance'],
    image: 'https://www.motorbiscuit.com/wp-content/uploads/2022/07/Chrisfix-DIY-Rock-Chip-Repair-Demo-Video.jpg'
  }
];

export default function Services() {
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
                      src={service.image} 
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
                    <h2 className="text-4xl md:text-5xl font-serif mb-6 tracking-tight">{service.title}</h2>
                    <p className="text-[#d1d1d1]/70 leading-relaxed mb-10 font-light text-lg">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-5 mb-12">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <CheckCircle2 size={18} className="text-white/30 mt-1 shrink-0" />
                          <span className="text-base text-[#d1d1d1]/80 font-light">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/contact" className="btn-outline inline-block">
                      Request Quote
                    </Link>
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
