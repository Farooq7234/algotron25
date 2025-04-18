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
      {/* Main Content Container */}
      <div className='flex flex-col items-center justify-center w-full px-4 py-24 space-y-20'>

        {/* Title Section */}
        <motion.div 
          variants={fromTop(0.8)} 
          initial="initial" 
          animate="animate"
          className='text-center space-y-6'
        >
          {/* Separated Logo Containers */}
          <div className="flex justify-between w-full sm:w-[500px] lg:w-[700px] mb-8">
            <div className="flex justify-center items-center">
              <img src="/tpgit_logo.png" className="w-[80px] h-[80px] sm:w-[150px] sm:h-[150px]" alt="TPGIT Logo" />
            </div>
            <div className="flex justify-center items-center">
              <img src="/csealogo.png" className="w-[90px] h-[90px] sm:w-[170px] sm:h-[170px]" alt="CSE Logo" />
            </div>
            <div className="flex justify-center items-center">
              <img src="images/TamilNadu_Logo.svg" className="w-[70px] h-[70px] sm:w-[120px] sm:h-[130px]" alt="Tamil Nadu Logo" />
            </div>
          </div>

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
          
          {/* <motion.div
            variants={fromTop(1.8)} 
            initial="initial" 
            animate="animate"
          >
            <Link href={'/sign-up'}>
              <motion.button
                className="sm:mt-6 mt-[25px] cursor-pointer w-[14em] h-[3em] text-white font-bold relative text-[12px] sm:text-[18px] sm:w-[18em] sm:h-[3em] text-center bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-[10px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-purple-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[10px] before:hover:blur-lg before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700"
                variants={fromTop(1.8)} initial="initial" animate="animate"
                style={{ zIndex: 0 }}
              >
                Register Now
              </motion.button>
            </Link>
          </motion.div> */}
           <p className='text-3xl text-purple-300/80'>Registration opens from tomorrow 10:00 am</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
