import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const Avatar = ({ 
  src, 
  alt, 
  name, 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarHover = { scale: 1.1 };

  if (src && !imageError) {
    return (
      <motion.img
        whileHover={avatarHover}
        src={src}
        alt={alt || name}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
        onError={() => setImageError(true)}
        {...props}
      />
    );
  }

  return (
    <motion.div
      whileHover={avatarHover}
      className={`${sizes[size]} rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center font-medium text-white ${className}`}
      {...props}
    >
      {name ? getInitials(name) : <ApperIcon name="User" className="w-1/2 h-1/2" />}
    </motion.div>
  );
};

export default Avatar;