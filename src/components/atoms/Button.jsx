import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white focus:ring-primary/50 shadow-md',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white focus:ring-secondary/50 shadow-md',
    accent: 'bg-accent hover:bg-accent/90 text-white focus:ring-accent/50 shadow-md',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300',
    danger: 'bg-error hover:bg-error/90 text-white focus:ring-error/50 shadow-md'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
    xl: 'px-8 py-4 text-lg rounded-xl'
  };

  const buttonHover = { scale: 1.05 };
  const buttonTap = { scale: 0.95 };

  const renderIcon = () => {
    if (loading) {
      return <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />;
    }
    if (icon) {
      return <ApperIcon name={icon} className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <motion.button
      whileHover={!disabled ? buttonHover : {}}
      whileTap={!disabled ? buttonTap : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === 'left' && renderIcon() && (
        <span className={children ? 'mr-2' : ''}>
          {renderIcon()}
        </span>
      )}
      {children}
      {iconPosition === 'right' && renderIcon() && (
        <span className={children ? 'ml-2' : ''}>
          {renderIcon()}
        </span>
      )}
    </motion.button>
  );
};

export default Button;