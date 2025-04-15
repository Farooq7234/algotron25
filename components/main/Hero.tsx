'use client';
import React from 'react';
import Timer from '../sub/Timer';
import { motion } from 'framer-motion';
import { fromTop } from '@/public/utils/motion';
import Link from 'next/link';
import { SparklesCore } from '../ui/sparkles';
import { TypingAnimation } from '../magicui/typing-animation';
import { AuroraText } from '../magicui/aurora-text';
import { LineShadowText } from '../magicui/line-shadow-text';

const Hero: React.FC = () => {
  const shadowColor = "white";
  return (
    <section className='relative flex flex-col items-center justify-center min-h-screen overflow-hidden'>
      {/* Sparkles Background (full screen) */}
      <div className="w-full absolute inset-0 h-screen pointer-events-none">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={80}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

    

      {/* Main Content Container */}
      <div className='flex flex-col items-center justify-center z-20 w-full px-4 py-24 space-y-20'>

        {/* Title Section */}
        <motion.div 
          variants={fromTop(0.8)} 
          initial="initial" 
          animate="animate"
          className='text-center space-y-6'
        >
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white uppercase">
            <AuroraText className='mr-6'>Algotron </AuroraText>
            <LineShadowText className="italic" shadowColor={shadowColor}> 4.0</LineShadowText>
          </h1>
          <p className='text-3xl text-purple-300/80'>A National Level Technical symposium</p>
        </motion.div>

        {/* Date Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='bg-white/10 backdrop-blur-md rounded-full px-8 py-3 border border-purple-300/50'
        >
          <p className='text-white text-xl font-medium tracking-wider'>APRIL 25</p>
        </motion.div>

        {/* Timer and Button Section */}
        <div className='flex flex-col items-center space-y-20'>
          <motion.div 
            variants={fromTop(1.2)} 
            initial="initial" 
            animate="animate"
            className='mt-4'
          >
            <Timer />
          </motion.div>
          
          <motion.div
            variants={fromTop(1.8)} 
            initial="initial" 
            animate="animate"
          >
            <Link href={'/sign-up'}>
            <motion.button
            className="sm:mt-6 mt-[-25px] cursor-pointer w-[14em] h-[3em] text-white font-bold relative text-[12px] sm:text-[18px] sm:w-[18em] sm:h-[3em] text-center bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-[10px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-purple-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[10px] before:hover:blur-lg before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700"
            variants={fromTop(1.8)} initial="initial" animate="animate"
            style={{ zIndex: 0 }}
          >
            Register Now
          </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

     
    </section>
  );
};

export default Hero;