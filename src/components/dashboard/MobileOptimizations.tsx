import React, { useState, useEffect } from 'react';

interface MobileOptimizationsProps {
  children: React.ReactNode;
}

export const MobileOptimizations: React.FC<MobileOptimizationsProps> = ({
  children,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkMobile();
    checkTouch();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add mobile-specific classes to the container
  const mobileClasses = isMobile ? 'mobile-dashboard' : '';
  const touchClasses = isTouch ? 'touch-device' : '';

  return (
    <div className={`${mobileClasses} ${touchClasses}`}>
      {children}
      
      {/* Mobile-specific styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .mobile-dashboard {
          /* Increase touch targets on mobile */
        }
        
        .mobile-dashboard .dashboard-grid {
          gap: 1rem; /* Smaller gaps on mobile */
        }
        
        .touch-device [draggable="true"] {
          /* Better touch feedback */
          touch-action: manipulation;
        }
        
        .touch-device button {
          min-height: 44px; /* iOS recommended touch target size */
          min-width: 44px;
        }
        
        @media (max-width: 640px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          
          .customization-panel {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            top: auto !important;
            max-width: none !important;
            border-radius: 1rem 1rem 0 0 !important;
            max-height: 80vh !important;
          }
        }
        
        @media (max-width: 480px) {
          .card-controls {
            position: static !important;
            opacity: 1 !important;
            margin-top: 0.5rem !important;
            justify-content: center !important;
          }
        }
        `
      }} />
    </div>
  );
};