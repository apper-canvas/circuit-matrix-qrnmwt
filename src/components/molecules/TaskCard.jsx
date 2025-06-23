import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '../ApperIcon';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';

const TaskCard = ({ 
  task, 
  user, 
  commentsCount = 0,
  onClick,
  isDragging = false,
  ...props 
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    hover: { scale: 1.02, y: -2 },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={!isDragging ? "hover" : {}}
      whileTap={!isDragging ? "tap" : {}}
      transition={{ duration: 0.2 }}
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer
        hover:shadow-md transition-all duration-200
        ${isDragging ? 'shadow-lg rotate-2 opacity-80' : ''}
      `}
      onClick={onClick}
      {...props}
    >
      {/* Priority and Labels */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant={getPriorityColor(task.priority)} size="xs">
          {task.priority}
        </Badge>
        {task.labels && task.labels.length > 0 && (
          <div className="flex gap-1">
            {task.labels.slice(0, 2).map((label, index) => (
              <Badge key={index} variant="default" size="xs">
                {label}
              </Badge>
            ))}
            {task.labels.length > 2 && (
              <Badge variant="default" size="xs">
                +{task.labels.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Task Title */}
<h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
        {task.title || task.Name}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {user && (
            <Avatar 
              src={user.avatar} 
              name={user.name} 
              size="sm"
              className="border-2 border-gray-100"
            />
          )}
          {commentsCount > 0 && (
            <div className="flex items-center space-x-1 text-gray-500">
              <ApperIcon name="MessageCircle" className="w-4 h-4" />
              <span className="text-xs">{commentsCount}</span>
            </div>
          )}
        </div>

{(task.dueDate || task.due_date) && (
          <div className={`flex items-center space-x-1 text-xs ${
            isOverdue ? 'text-error' : 'text-gray-500'
          }`}>
            <ApperIcon name="Calendar" className="w-4 h-4" />
            <span>
              {format(new Date(task.dueDate || task.due_date), 'MMM d')}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;