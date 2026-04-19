import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { subscribeToGallery } from '../lib/cms';

const ease = [0.16, 1, 0.3, 1];

const defaultGalleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
    title: 'Paint Correction',
    span: 'col-span-1 md:col-span-2 row-span-2'
  },
  {
    url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800',
    title: 'Ceramic Coating',
    span: 'col-span-1 row-span-1'
  },
  {
    url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800',
    title: 'Interior Detail',
    span: 'col-span-1 row-span-1'
  },
  {
    url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=800',
    title: 'Exterior Wash',
    span: 'col-span-1 row-span-1'
  },
  {
    url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800',
    title: 'Leather Restoration',
    span: 'col-span-1 md:col-span-2 row-span-1'
  },
  {
    url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    title: 'Wheel Detailing',
    span: 'col-span-1 row-span-1'
  }
];

export default function Gallery() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const unsub = subscribeToGallery((data) => {
      if (data.length > 0) {
        setImages(data);
      } else {
        setImages(defaultGalleryImages);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#171717]">
      {/* Header */}
      <section className="pt-32 sm:pt-40 pb-20 sm:pb-24 bg-[#111] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="overflow-hidden mb-6">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease }}
              className="text-4xl sm:text-5xl md:text-7xl font-serif tracking-tight"
            >
              The <span className="italic text-white/90">Gallery</span>
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.p 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease, delay: 0.2 }}
              className="text-[#d1d1d1]/60 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed px-4"
            >
              A showcase of our dedication to perfection. Real results from vehicles in Collin County.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Masonry-style Grid */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px] sm:auto-rows-[350px]">
            {images.map((img, i) => (
              <motion.div
                key={img.id || i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 1.2, ease }}
                className={`relative group overflow-hidden bg-[#111] rounded-sm ${img.span || 'col-span-1 row-span-1'}`}
              >
                <img 
                  src={img.url} 
                  alt={img.title || img.caption || 'Gallery Image'} 
                  className="w-full h-full object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-105 opacity-70 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"></div>
                <div className="absolute bottom-8 left-8 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[0.16,1,0.3,1]">
                  <span className="font-serif text-2xl text-white tracking-wide">{img.title || img.caption || ''}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
