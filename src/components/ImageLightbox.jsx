import { useEffect } from 'react';
import '../styles/ImageLightbox.css';

export default function ImageLightbox({ src, alt = "Service Request Full View", isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="image-lightbox" 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="image-lightbox__content" onClick={handleContentClick}>
        <button 
          className="image-lightbox__close" 
          onClick={onClose}
          aria-label="Close image viewer"
        >
          &times;
        </button>
        <img 
          src={src} 
          alt={alt} 
          className="image-lightbox__img" 
        />
      </div>
    </div>
  );
}
