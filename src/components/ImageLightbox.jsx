import { useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  const overlay = (
    <div 
      className="image-lightbox-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="image-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="image-lightbox-close" 
          onClick={onClose}
          aria-label="Close image viewer"
        >
          &times;
        </button>
        <img 
          src={src} 
          alt={alt} 
          className="image-lightbox-image" 
        />
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
