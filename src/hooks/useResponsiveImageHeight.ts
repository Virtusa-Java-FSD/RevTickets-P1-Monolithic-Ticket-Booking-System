import { useState, useEffect } from 'react';

export const useResponsiveImageHeight = () => {
  const [imageHeight, setImageHeight] = useState(200);

  useEffect(() => {
    const updateImageHeight = () => {
      if (window.innerWidth < 576) {
        setImageHeight(150);
      } else if (window.innerWidth < 768) {
        setImageHeight(180);
      } else {
        setImageHeight(200);
      }
    };

    updateImageHeight();
    window.addEventListener('resize', updateImageHeight);
    return () => window.removeEventListener('resize', updateImageHeight);
  }, []);

  return imageHeight;
};