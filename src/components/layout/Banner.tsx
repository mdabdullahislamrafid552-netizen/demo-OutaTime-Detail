import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { subscribeToSettings } from '../../lib/cms';

export default function Banner() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const unsub = subscribeToSettings((data) => {
      if (data) setSettings(data);
    });
    return () => unsub();
  }, []);

  if (!settings?.banner?.enabled) return null;

  return (
    <div className="bg-white text-black overflow-hidden py-2 select-none relative z-[60]">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: settings.banner.speed || 30,
          ease: "linear",
        }}
        className="flex whitespace-nowrap gap-12 items-center"
      >
        <div className="flex shrink-0 gap-12 items-center">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-[10px] uppercase font-bold tracking-[0.25em] flex items-center gap-12">
              {settings.banner.text || "PREMIUM MOBILE DETAILING • PAINT RECONDITIONING CERTIFIED • SERVING COLLIN COUNTY"}
              <span className="w-1.5 h-1.5 rounded-full bg-black/20"></span>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 gap-12 items-center">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-[10px] uppercase font-bold tracking-[0.25em] flex items-center gap-12">
              {settings.banner.text || "PREMIUM MOBILE DETAILING • PAINT RECONDITIONING CERTIFIED • SERVING COLLIN COUNTY"}
              <span className="w-1.5 h-1.5 rounded-full bg-black/20"></span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
