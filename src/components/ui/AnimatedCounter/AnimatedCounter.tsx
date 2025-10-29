import { useState, useRef, useEffect } from "react";

const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (end === 0) {
      setCount(0);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function para suavizar la animación
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    const animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      startTimeRef.current = null;
    };
  }, [end, duration]);

  return count;
};

export const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const count = useCounter(value, duration);
  
  return (
    <span>
      {count.toLocaleString('es-ES')}
    </span>
  );
};