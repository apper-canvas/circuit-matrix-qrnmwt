import { motion } from 'framer-motion';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';

const ErrorState = ({ 
  message = "Something went wrong", 
  description,
  onRetry,
  icon = "AlertTriangle",
  className = '' 
}) => {
  const errorVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 }
  };

  const iconBounce = {
    animate: { y: [0, -10, 0] },
    transition: { duration: 2, repeat: Infinity }
  };

  return (
    <motion.div
      variants={errorVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      <motion.div
        variants={iconBounce}
        animate="animate"
        className="mb-4"
      >
        <ApperIcon 
          name={icon} 
          className="w-16 h-16 text-error" 
        />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {message}
      </h3>
      
      {description && (
        <p className="text-gray-600 mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          icon="RefreshCw"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;