import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import ApperIcon from '../ApperIcon';

const QuickAddTask = ({ onAddTask, projectId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      if (onAddTask) {
        await onAddTask({ title: title.trim(), projectId });
      }
      setTitle('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' }
  };

  return (
    <div className="space-y-3">
      <Button
        variant={isOpen ? 'ghost' : 'primary'}
        icon={isOpen ? 'X' : 'Plus'}
        className="w-full justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Cancel' : 'Quick Add Task'}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <Input
              label="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              autoFocus
            />
            <div className="flex space-x-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={loading}
                disabled={!title.trim()}
                className="flex-1"
              >
                Add Task
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickAddTask;