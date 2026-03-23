import React from 'react';

const DoodleBackground = () => {
  // Define doodle configurations with random positions, rotations, scales, and opacity
  const doodles = [
    // pirate-ship.webp
    {
      src: '/assets/pirate-ship.webp',
      left: '15%',
      top: '8%',
      rotate: -12,
      scale: 0.35,
      opacity: 0.15,
    },
    {
      src: '/assets/pirate-ship.webp',
      left: '88%',
      top: '25%',
      rotate: 25,
      scale: 0.28,
      opacity: 0.12,
    },
    {
      src: '/assets/pirate-ship.webp',
      left: '45%',
      top: '78%',
      rotate: -8,
      scale: 0.32,
      opacity: 0.18,
    },
    {
      src: '/assets/pirate-ship.webp',
      left: '92%',
      top: '85%',
      rotate: 15,
      scale: 0.25,
      opacity: 0.14,
    },

    // pirate-flag.webp
    {
      src: '/assets/pirate-flag.webp',
      left: '72%',
      top: '12%',
      rotate: 18,
      scale: 0.38,
      opacity: 0.16,
    },
    {
      src: '/assets/pirate-flag.webp',
      left: '8%',
      top: '45%',
      rotate: -22,
      scale: 0.3,
      opacity: 0.13,
    },
    {
      src: '/assets/pirate-flag.webp',
      left: '55%',
      top: '92%',
      rotate: 10,
      scale: 0.35,
      opacity: 0.17,
    },

    // pirate-hat.webp
    {
      src: '/assets/pirate-hat.webp',
      left: '25%',
      top: '18%',
      rotate: -15,
      scale: 0.32,
      opacity: 0.14,
    },
    {
      src: '/assets/pirate-hat.webp',
      left: '82%',
      top: '35%',
      rotate: 20,
      scale: 0.28,
      opacity: 0.16,
    },
    {
      src: '/assets/pirate-hat.webp',
      left: '12%',
      top: '65%',
      rotate: -10,
      scale: 0.35,
      opacity: 0.15,
    },
    {
      src: '/assets/pirate-hat.webp',
      left: '68%',
      top: '88%',
      rotate: 12,
      scale: 0.3,
      opacity: 0.13,
    },
    {
      src: '/assets/pirate-hat.webp',
      left: '38%',
      top: '5%',
      rotate: -18,
      scale: 0.26,
      opacity: 0.12,
    },

    // pirate-compass.webp
    {
      src: '/assets/pirate-compass.webp',
      left: '5%',
      top: '28%',
      rotate: 22,
      scale: 0.33,
      opacity: 0.17,
    },
    {
      src: '/assets/pirate-compass.webp',
      left: '62%',
      top: '42%',
      rotate: -14,
      scale: 0.29,
      opacity: 0.14,
    },
    {
      src: '/assets/pirate-compass.webp',
      left: '95%',
      top: '58%',
      rotate: 16,
      scale: 0.31,
      opacity: 0.15,
    },
    {
      src: '/assets/pirate-compass.webp',
      left: '28%',
      top: '95%',
      rotate: -20,
      scale: 0.27,
      opacity: 0.13,
    },

    // Additional scattered elements for more coverage
    {
      src: '/assets/pirate-hat.webp',
      left: '48%',
      top: '32%',
      rotate: 8,
      scale: 0.24,
      opacity: 0.11,
    },
    {
      src: '/assets/pirate-ship.webp',
      left: '18%',
      top: '88%',
      rotate: -25,
      scale: 0.29,
      opacity: 0.16,
    },
    {
      src: '/assets/pirate-flag.webp',
      left: '78%',
      top: '68%',
      rotate: 14,
      scale: 0.33,
      opacity: 0.14,
    },
    {
      src: '/assets/pirate-compass.webp',
      left: '42%',
      top: '58%',
      rotate: -11,
      scale: 0.28,
      opacity: 0.12,
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {doodles.map((doodle, index) => (
        <img
          key={index}
          src={doodle.src}
          alt=''
          style={{
            position: 'absolute',
            left: doodle.left,
            top: doodle.top,
            transform: `translate(-50%, -50%) rotate(${doodle.rotate}deg) scale(${doodle.scale})`,
            opacity: doodle.opacity,
            pointerEvents: 'none',
            userSelect: 'none',
            maxWidth: '150px',
            maxHeight: '150px',
            animation: `float-gentle ${8 + (index % 5)}s ease-in-out infinite`,
            animationDelay: `${index * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
};

export default DoodleBackground;

// Made with Bob
