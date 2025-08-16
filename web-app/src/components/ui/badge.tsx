import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

const Badge: React.FC<BadgeProps> = ({ className = '', children, ...props }) => {
  const classes = `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export { Badge };
