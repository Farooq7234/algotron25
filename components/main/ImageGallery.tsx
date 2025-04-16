'use client';
import React from 'react';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';

const ImageGallery = () => {
  const images = [
    '/images/img1.jpg',
    '/images/img3.jpg',
    '/images/img4.jpg',
    '/images/img5.jpg',
    '/images/img6.jpg',
    '/images/img7.jpg',
    '/images/img8.jpg',
    '/images/img9.jpg',
  ].map((url, index) => ({
    id: index + 1,
    url,
    alt: '', // You can add alt text here if needed
  }));

  return (
    <section className="py-12">
      <Marquee 
        pauseOnHover 
        speed={150} 
        gradient={false}
        className="overflow-hidden"
      >
        {images.map((image) => (
          <div 
            key={image.id} 
            className="relative w-[250px] h-[180px] sm:w-72 sm:h-72 lg:w-[400px] lg:h-[300px] mx-3 flex-shrink-0 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform"
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
