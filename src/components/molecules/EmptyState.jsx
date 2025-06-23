import { motion } from 'framer-motion';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';

const EmptyState = ({ 
  title = "No items found", 
  description = "Get started by creating your first item",
  actionLabel = "Create Item",
  onAction,
  icon = "Package",
  className = '' 
}) => {
  const emptyVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 }
  };

  const iconFloat = {
    animate: { y: [0, -10, 0] },
    transition: { duration: 3, repeat: Infinity }
  };

  const buttonHover = { scale: 1.05 };
  const buttonTap = { scale: 0.95 };

  return (
    <motion.div
      variants={emptyVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      <motion.div
        variants={iconFloat}
        animate="animate"
        className="mb-4"
      >
        <ApperIcon 
          name={icon} 
          className="w-16 h-16 text-gray-300" 
        />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <motion.div
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <Button
            onClick={onAction}
            variant="primary"
            icon="Plus"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;