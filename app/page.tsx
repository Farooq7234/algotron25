'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/main/Hero';
import Navbar from '@/components/main/Navbar';
const StarsCanvas = dynamic(() => import('@/components/main/StarCanvas'), { ssr: false });
import About from '@/components/main/About';
import Footer from '@/components/main/Footer';
import FlareCursor from '@/components/main/Cursor';
import Loading from '@/components/main/Loading'
import Questions from '@/components/main/FAQs';
import Events from '@/components/main/Event';
import Contact from '@/components/main/Contact';

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
      className="h-full w-full bg-[#030014] " >
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loading/>
        </div>
      ) : (
        <>
      <FlareCursor/>
      <StarsCanvas />
      <Hero />
      <About />
      <Events/>
      <Questions/>
      <Contact/>
      <Footer />
      <Navbar />
        </>
      )}
    </main>
  );
};

export default Home;