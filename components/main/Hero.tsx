'use client';
import React from 'react';
import Timer from '../sub/Timer';
import { motion } from 'framer-motion';
import { fromTop } from '@/public/utils/motion';
import Link from 'next/link';
import { SparklesCore } from '../ui/sparkles';
import { TypingAnimation } from '../magicui/typing-animation';


const Hero: React.FC = () => {
  const background1 = '';
  return (
    <section className='flex flex-col z-50 items-center justify-center min-h-screen bg-contain bg-center bg-fixed' style={{ backgroundImage: `url(${background1})` }}>
      <div className='mb-20'>
        <motion.div variants={fromTop(0.8)} initial="initial" animate="animate">
        <div className=" w-full ">
      <h1 className="md:text-7xl text-3xl lg:text-8xl font-bold text-center text-white relative z-20">
       <TypingAnimation>ALGOTRON 4.0</TypingAnimation>
      </h1>
      <div className="w-[40rem]  relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[5px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[6px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
 
        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={500}
          className="w-full h-4"
          particleColor="#FFFFFF"
        />
 
      </div>
    </div>
        </motion.div>
      </div>
      <div className='flex flex-col items-center justify-center gap-28'>
        <motion.div className='sm:mt-10' variants={fromTop(1.2)} initial="initial" animate="animate">
          <Timer />
        </motion.div>
        <Link href={'/sign-up'}>
          <motion.button
            className="sm:mt-6 mt-[-25px] cursor-pointer w-[14em] h-[3em] text-white font-bold relative text-[12px] sm:text-[18px] sm:w-[18em] sm:h-[3em] text-center bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-[10px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-purple-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[10px] before:hover:blur-lg before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700"
            variants={fromTop(1.8)} initial="initial" animate="animate"
            style={{ zIndex: 0 }}
          >
            Register Now
          </motion.button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
