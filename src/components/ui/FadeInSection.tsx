"use client";
import { useEffect, useRef, useState } from "react";

export const FadeInSection: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target); // only trigger once
          }
        });
      },
      { threshold: 0.2 }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`flex flex-col md:flex justify-center items-center gap-10 transform transition-all duration-700 ease-out 
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      {children}
    </div>
  );
};
