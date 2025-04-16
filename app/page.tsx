'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/main/Hero';
import About from '@/components/main/About';
import Footer from '@/components/main/Footer';
import FlareCursor from '@/components/main/Cursor';
import Loading from '@/components/main/Loading'
import Questions from '@/components/main/FAQs';
import Events from '@/components/main/Event';
import Contact from '@/components/main/Contact';
import { SparklesCore } from '@/components/ui/sparkles';
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import ImageGallery from '@/components/main/ImageGallery';


import SponsorSection from '@/components/main/Sponsors';
import Faculty from '@/components/main/Faculty';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(delay);
  }, []);


  return (
    <main
      className="h-full w-full " >
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loading/>
        </div>
      ) : (
        <>
      
      
<div className=" relative w-full overflow-x-hidden">
      <div className="w-full absolute inset-0 ">
        <ScrollProgress className="top-[70px]" />
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <FlareCursor/>
      <Hero />
      <About />
      <ImageGallery/>
      <Events/>
      <Faculty/>
      <SponsorSection/>
      <Contact/>
      <Questions/>
      <Footer />

    </div>
   
        </>

        
      )}
    </main>
  );
};



export default Home;