import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import ScrollToTop from './components/utils/ScrollToTop';
import { subscribeToSettings } from './lib/cms';

function AnalyticsAndSEO() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const unsub = subscribeToSettings((data) => {
      if (data) setSettings(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!settings) return;

    // Apply SEO
    if (settings.seo) {
      if (settings.seo.title) document.title = settings.seo.title;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', settings.seo.description || '');

      let metaKw = document.querySelector('meta[name="keywords"]');
      if (!metaKw) {
        metaKw = document.createElement('meta');
        metaKw.setAttribute('name', 'keywords');
        document.head.appendChild(metaKw);
      }
      metaKw.setAttribute('content', settings.seo.keywords || '');
    }

    // Apply Analytics
    if (settings.analytics?.gaId) {
      const gaId = settings.analytics.gaId.trim();
      if (!document.getElementById('ga-script')) {
        const script1 = document.createElement('script');
        script1.id = 'ga-script';
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.id = 'ga-config';
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(script2);
      } else {
        // Re-config if it already exists
        const script2 = document.getElementById('ga-config');
        if (script2) {
          script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `;
        }
      }
    }
  }, [settings]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AnalyticsAndSEO />
      <div className="min-h-screen flex flex-col bg-primary text-contrast selection:bg-contrast selection:text-primary">
        <Navbar />
        <main className="flex-grow pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
