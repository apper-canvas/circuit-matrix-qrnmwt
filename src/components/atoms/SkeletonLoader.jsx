import { motion } from 'framer-motion';

const SkeletonLoader = ({ 
  width = 'w-full', 
  height = 'h-4', 
  rounded = 'rounded',
  count = 1,
  className = '' 
}) => {
  const skeletonVariants = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 }
  };

  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: { x: '100%' }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          variants={skeletonVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: index * 0.1
          }}
          className={`${width} ${height} ${rounded} bg-gray-200 relative overflow-hidden`}
        >
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.1
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;