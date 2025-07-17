import { useEffect, useRef } from 'react';

interface SwipeConfig {
  minSwipeDistance?: number;
  maxSwipeTime?: number;
  onSwipeOpen: () => void;
  onSwipeClose: () => void;
  isMobile: boolean;
  isOpen: boolean;
}

export const useSwipeToOpen = ({
  minSwipeDistance = 50,
  maxSwipeTime = 300,
  onSwipeOpen,
  onSwipeClose,
  isMobile,
  isOpen,
}: SwipeConfig) => {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.touches[0];
      const start = touchStartRef.current;
      const currentX = touch.clientX;
      const distanceX = currentX - start.x;

      // Solo prevenir scroll si es un swipe horizontal significativo
      if (Math.abs(distanceX) > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      touchEndRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      const start = touchStartRef.current;
      const end = touchEndRef.current;

      // Calcular distancia y tiempo
      const distanceX = end.x - start.x;
      const distanceY = Math.abs(end.y - start.y);
      const time = end.time - start.time;

      // Verificar que sea un swipe válido
      const isHorizontalSwipe = Math.abs(distanceX) > distanceY;
      const isRightSwipe = distanceX > 0;
      const isLeftSwipe = distanceX < 0;
      const isLongEnough = Math.abs(distanceX) >= minSwipeDistance;
      const isFastEnough = time <= maxSwipeTime;
      const isFromLeftEdge = start.x <= 30; // Para abrir desde el borde izquierdo
      const isFromRightSide = start.x >= window.innerWidth - 100; // Para cerrar desde el lado derecho del sidebar

      // console.log('Swipe detection:', {
      //   distanceX,
      //   distanceY,
      //   time,
      //   isHorizontalSwipe,
      //   isRightSwipe,
      //   isLeftSwipe,
      //   isLongEnough,
      //   isFastEnough,
      //   isFromLeftEdge,
      //   isFromRightSide,
      //   isOpen,
      //   startX: start.x,
      //   endX: end.x,
      //   windowWidth: window.innerWidth
      // });

      // Swipe para abrir (derecha desde borde izquierdo)
      if (
        isHorizontalSwipe &&
        isRightSwipe &&
        isLongEnough &&
        isFastEnough &&
        isFromLeftEdge &&
        !isOpen
      ) {
        // console.log('Swipe detected! Opening sidebar...');
        onSwipeOpen();
      }

      // Swipe para cerrar (izquierda desde el sidebar abierto)
      if (
        isHorizontalSwipe &&
        isLeftSwipe &&
        isLongEnough &&
        isFastEnough &&
        isFromRightSide &&
        isOpen
      ) {
        // console.log('Swipe detected! Closing sidebar...');
        onSwipeClose();
      }

      // Reset
      touchStartRef.current = null;
      touchEndRef.current = null;
    };

    // Agregar listeners al body para capturar todos los eventos
    document.body.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.body.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.body.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.body.removeEventListener('touchstart', handleTouchStart);
      document.body.removeEventListener('touchmove', handleTouchMove);
      document.body.removeEventListener('touchend', handleTouchEnd);
    };
  }, [minSwipeDistance, maxSwipeTime, onSwipeOpen, isMobile]);
};
