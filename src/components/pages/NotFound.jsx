import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  const pageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  const iconFloat = {
    animate: { 
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0]
    },
    transition: { 
      duration: 4, 
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="h-full flex items-center justify-center p-6"
    >
      <div className="text-center max-w-md">
        <motion.div
          variants={iconFloat}
          animate="animate"
          className="mb-8"
        >
          <ApperIcon 
            name="FileX" 
            className="w-24 h-24 text-gray-300 mx-auto" 
          />
        </motion.div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to your projects.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            icon="Home"
            onClick={() => navigate('/')}
          >
            Go to Board
          </Button>
          <Button
            variant="outline"
            icon="ArrowLeft"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;