import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const Input = forwardRef(({ 
  label,
  type = 'text',
  error,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(props.value || props.defaultValue || '');

  const handleFocus = (e) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const handleChange = (e) => {
    setHasValue(e.target.value);
    props.onChange?.(e);
  };

  const inputClasses = `
    w-full px-3 py-2 border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    ${error ? 'border-error focus:ring-error/50 focus:border-error' : 'border-gray-300'}
    ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${className}
  `;

  const labelVariants = {
    default: {
      top: '50%',
      left: icon && iconPosition === 'left' ? '2.5rem' : '0.75rem',
      fontSize: '1rem',
      color: '#6B7280'
    },
    focused: {
      top: '-0.5rem',
      left: '0.75rem',
      fontSize: '0.875rem',
      color: error ? '#EF4444' : '#4F46E5'
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
            <ApperIcon 
              name={icon} 
              className={`w-5 h-5 ${error ? 'text-error' : 'text-gray-400'}`} 
            />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        {label && (
          <motion.label
            className="absolute bg-white px-1 pointer-events-none transform -translate-y-1/2"
            variants={labelVariants}
            animate={isFocused || hasValue ? 'focused' : 'default'}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center"
        >
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;