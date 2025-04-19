'use client';
import React from 'react';
import Marquee from 'react-fast-marquee';

const ImageGallery = () => {
  const images = [
    'gallery/img1.jpg',
    'gallery/img3.jpg',
    'gallery/img4.jpg',
    'gallery/img5.jpg',
    'gallery/img6.jpg',
    'gallery/img7.jpg',
    'gallery/img8.jpg',
    'gallery/img9.jpg',
    
    
  ].map((url, index) => ({
    id: index + 1,
    url,
    alt: '', // You can add alt text here if needed
  }));

  return (
    <section className="py-12">
      <Marquee pauseOnHover speed={100} gradient={false} className="overflow-hidden">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative w-[250px] h-[180px] sm:w-72 sm:h-72 lg:w-[400px] lg:h-[300px] mx-3 flex-shrink-0 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform"
          >
            <img
              src={image.url}
              alt={image.alt}
              className="object-cover w-full h-full"
              loading="lazy" // You can add lazy loading to images for better performance
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
