import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  const classes = `rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent: React.FC<CardContentProps> = ({ className = '', children, ...props }) => {
  const classes = `p-6 pt-0 ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export { Card, CardContent };
