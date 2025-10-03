import React, { ReactNode } from "react";

// Fix: Extend from React.HTMLAttributes<HTMLDivElement> to allow passing standard div props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-brand-primary p-4 sm:p-6 rounded-2xl shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
