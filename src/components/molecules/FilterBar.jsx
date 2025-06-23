import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';
import Avatar from '../atoms/Avatar';

const FilterBar = ({ 
  users = [], 
  filters = {}, 
  onFiltersChange,
  onClearFilters 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleAssigneeFilter = (userId) => {
    const currentAssignees = filters.assignees || [];
    const newAssignees = currentAssignees.includes(userId)
      ? currentAssignees.filter(id => id !== userId)
      : [...currentAssignees, userId];
    
    onFiltersChange({ ...filters, assignees: newAssignees });
  };

  const handleDueDateFilter = (option) => {
    onFiltersChange({ ...filters, dueDate: option });
  };

  const filterCount = (filters.assignees?.length || 0) + (filters.dueDate ? 1 : 0);

  const filterBarVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' }
  };

  return (
    <div className="space-y-4">
      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          icon="Filter"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          Filters
          {filterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </Button>

        {filterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      <motion.div
        variants={filterBarVariants}
        initial="hidden"
        animate={showFilters ? "visible" : "hidden"}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg border border-gray-200 p-4 space-y-4"
      >
        {/* Assignee Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assignees
          </label>
          <div className="flex flex-wrap gap-2">
            {users.map(user => (
              <motion.button
                key={user.Id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAssigneeFilter(user.Id)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200
                  ${(filters.assignees || []).includes(user.Id)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }
                `}
              >
                <Avatar src={user.avatar} name={user.name} size="xs" />
                <span className="text-sm">{user.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Due Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'overdue', label: 'Overdue', icon: 'AlertTriangle' },
              { value: 'today', label: 'Today', icon: 'Calendar' },
              { value: 'this-week', label: 'This Week', icon: 'CalendarDays' },
              { value: 'no-date', label: 'No Date', icon: 'CalendarX' }
            ].map(option => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDueDateFilter(
                  filters.dueDate === option.value ? null : option.value
                )}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200
                  ${filters.dueDate === option.value
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }
                `}
              >
                <ApperIcon name={option.icon} className="w-4 h-4" />
                <span className="text-sm">{option.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FilterBar;