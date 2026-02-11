import React, { useEffect } from 'react';
import './Carrossel.css';
import { ImageCard } from '../molecules/ImageCard';

export function Carrossel({ images }) {
  useEffect(() => {
    let currentIndex = 0;
    const images = document.querySelectorAll('.carroselImgs .cardImgs');
    const totalImages = images.length;
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');

    function showNextImage() {
      currentIndex = (currentIndex + 1) % totalImages;
      const offset = -currentIndex * 100 / totalImages;
      document.querySelector('.carroselImgs').style.transform = `translateX(${offset}%)`;
      updateIndicators(currentIndex);
    }

    function updateIndicators(currentIndex) {
      indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    }

    const interval = setInterval(showNextImage, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className="carroselLogin" 
      id="carroselLogin" 
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0
      }}
    >
      <div className="carroselImgs">
        {images.map((image, index) => (
          <ImageCard
            key={index}
            src={image.src}
            alt={image.alt || `Image ${index + 1}`}
            className="carroselImgs" // Adiciona a classe diretamente
          />
        ))}
      </div>
    </section>
  );
}