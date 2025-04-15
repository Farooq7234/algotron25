'use client';
import React from 'react';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';

const ImageGallery = () => {
  const images = Array(9).fill(0).map((_, i) => ({
    id: i + 1,
    url: `/images/img${i + 1}.jpg`,
    alt: `Image ${i + 1}`,
  }));

  return (
    <section className="py-12">
      <Marquee 
        pauseOnHover 
        speed={50} 
        gradient={false}
        className="overflow-hidden"
      >
        {images.map((image) => (
          <div 
            key={image.id} 
            className="relative w-[400px] h-[300px] mx-3 flex-shrink-0 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform"
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={image.id <= 3}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
              <span className="text-white font-medium">{image.alt}</span>
            </div>
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default ImageGallery;
