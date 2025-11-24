import React, { useEffect, useRef, useState } from 'react';

// Custom hook for intersection observer
export function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
}

// Fade up animation wrapper
export function FadeUp({ children, delay = 0, duration = 0.5, className = '' }) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0px)' : 'translateY(10px)',
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// Staggered children animation
export function StaggerChildren({ children, staggerDelay = 0.1, baseDelay = 0, duration = 0.4, className = '' }) {
  const [ref, isInView] = useInView();

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0px)' : 'translateY(8px)',
            transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + index * staggerDelay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + index * staggerDelay}s`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// Card with hover animation
export function AnimatedCard({ children, delay = 0, className = '' }) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0px)' : 'translateY(8px)',
        transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, box-shadow 0.15s ease-out`,
      }}
    >
      <div
        className="h-full transition-all duration-150 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg"
      >
        {children}
      </div>
    </div>
  );
}

// Simple fade in
export function FadeIn({ children, delay = 0, duration = 0.4, className = '' }) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}