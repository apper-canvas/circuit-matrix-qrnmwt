import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import KanbanBoard from '../organisms/KanbanBoard';
import TaskModal from '../organisms/TaskModal';
import FilterBar from '../molecules/FilterBar';
import SearchBar from '../molecules/SearchBar';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';
import { projectService } from '../../services/api/projectService';
import { taskService } from '../../services/api/taskService';
import { userService } from '../../services/api/userService';

const BoardView = () => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [addTaskColumn, setAddTaskColumn] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

const loadInitialData = async () => {
    setLoading(true);
    try {
      const [projectsResult, usersResult] = await Promise.all([
        projectService.getAll(),
        userService.getAll()
      ]);
      setProjects(projectsResult || []);
      setUsers(usersResult || []);
      if (projectsResult && projectsResult.length > 0) {
        setCurrentProject(projectsResult[0]);
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleAddTask = async (columnId) => {
    setAddTaskColumn(columnId);
    setShowAddTaskModal(true);
  };

  const handleQuickAddTask = async (taskData) => {
    if (!currentProject) return;

    try {
      const newTask = await taskService.create({
        ...taskData,
        projectId: currentProject.Id,
        column: addTaskColumn || 'todo'
      });
      toast.success('Task created successfully');
      setShowAddTaskModal(false);
      setAddTaskColumn(null);
      // Force board refresh by updating project state
      setCurrentProject({ ...currentProject });
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    // Update task in the current view
    setSelectedTask(updatedTask);
    // Force board refresh
    setCurrentProject({ ...currentProject });
  };

  const handleTaskDelete = (taskId) => {
    setShowTaskModal(false);
    setSelectedTask(null);
    // Force board refresh
    setCurrentProject({ ...currentProject });
  };

  const handleProjectSwitch = (project) => {
    setCurrentProject(project);
    setFilters({});
    setSearchQuery('');
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              {currentProject?.name || 'Select a Project'}
            </h1>
            {currentProject && (
              <div className="flex items-center space-x-2">
                <ApperIcon name="Users" className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {users.length} team members
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              icon="Settings"
              onClick={() => {/* Navigate to project settings */}}
            >
              Settings
            </Button>
            <Button
              variant="primary"
              icon="Plus"
              onClick={() => handleAddTask('todo')}
              disabled={!currentProject}
            >
              Add Task
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search tasks..."
              className="flex-1 max-w-md"
            />
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                icon="Download"
                size="sm"
              >
                Export
              </Button>
              <Button
                variant="ghost"
                icon="BarChart3"
                size="sm"
              >
                Analytics
              </Button>
            </div>
          </div>
          
          <FilterBar
            users={users}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 p-6 overflow-hidden">
        <KanbanBoard
          project={currentProject}
          onTaskClick={handleTaskClick}
          onAddTask={handleAddTask}
        />
      </div>

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />
    </motion.div>
  );
};

export default BoardView;