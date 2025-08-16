import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  variant = 'default', 
  size = 'default', 
  children, 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    default: 'bg-black text-white hover:bg-gray-800',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100'
  };
  
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 py-3 text-lg'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export { Button };
