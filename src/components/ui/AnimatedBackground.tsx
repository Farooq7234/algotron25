import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!particlesRef.current) return;

    const particles = particlesRef.current.querySelectorAll('.particle');
    const particleCount = particles.length;
    const particleData = Array.from(particles).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2
    }));

    const animate = () => {
      particles.forEach((particle, i) => {
        const data = particleData[i];
        
        // Update position with velocity
        data.x += data.vx;
        data.y += data.vy;
        
        // Bounce off edges
        if (data.x <= 0 || data.x >= 100) data.vx *= -1;
        if (data.y <= 0 || data.y >= 100) data.vy *= -1;
        
        // Apply new position
        (particle as HTMLElement).style.left = `${data.x}%`;
        (particle as HTMLElement).style.top = `${data.y}%`;
        
        // Occasionally change direction for more organic movement
        if (Math.random() < 0.02) {
          data.vx += (Math.random() - 0.5) * 0.05;
          data.vy += (Math.random() - 0.5) * 0.05;
          
          // Limit speed
          const speed = Math.sqrt(data.vx * data.vx + data.vy * data.vy);
          if (speed > 0.3) {
            data.vx = (data.vx / speed) * 0.3;
            data.vy = (data.vy / speed) * 0.3;
          }
        }
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] overflow-hidden bg-black">
      <div className="particles-container absolute inset-0" ref={particlesRef}>
        {[...Array(200)].map((_, i) => (
          <div 
            key={i}
            className="particle absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: `${Math.random() * 0.5 + 0.3}`,
              transform: `translate(-50%, -50%)`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;