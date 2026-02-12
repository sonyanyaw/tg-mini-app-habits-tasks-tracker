import { useRef, type TouchEvent } from "react";

interface SwipeHandlers {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
}

export const useSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: SwipeHandlers) => {
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) return;

    const diff = touchStartX.current - touchEndX.current;

    if (diff > threshold) {
      onSwipeLeft();
    } else if (diff < -threshold) {
      onSwipeRight();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};
