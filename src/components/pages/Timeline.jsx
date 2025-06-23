import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isWithinInterval } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '../atoms/Button';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import ApperIcon from '../ApperIcon';
import SkeletonLoader from '../atoms/SkeletonLoader';
import EmptyState from '../molecules/EmptyState';
import { projectService } from '../../services/api/projectService';
import { taskService } from '../../services/api/taskService';
import { userService } from '../../services/api/userService';

const Timeline = () => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (currentProject) {
      loadProjectTasks();
    }
  }, [currentProject]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsResult, usersResult] = await Promise.all([
        projectService.getAll(),
        userService.getAll()
      ]);
      setProjects(projectsResult);
      setUsers(usersResult);
      if (projectsResult.length > 0) {
        setCurrentProject(projectsResult[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load timeline data');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectTasks = async () => {
    if (!currentProject) return;
    
    try {
      const tasksResult = await taskService.getByProjectId(currentProject.Id);
      setTasks(tasksResult.filter(task => task.dueDate)); // Only show tasks with due dates
    } catch (err) {
      toast.error('Failed to load project tasks');
    }
  };

  const getUserById = (userId) => {
    return users.find(user => user.Id === userId);
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek);
    const end = endOfWeek(currentWeek);
    return eachDayOfInterval({ start, end });
  };

  const getTasksForDay = (day) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, day);
    });
  };

  const getTaskDuration = (task) => {
    // For demo purposes, we'll show tasks as 1-3 day duration
    const priorities = { high: 3, medium: 2, low: 1 };
    return priorities[task.priority] || 1;
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const taskBarVariants = {
    initial: { scaleX: 0, opacity: 0 },
    animate: { scaleX: 1, opacity: 1 },
    hover: { scaleY: 1.1 }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <SkeletonLoader height="h-8" width="w-64" className="mb-4" />
          <SkeletonLoader height="h-10" width="w-full" />
        </div>
        <div className="flex-1 p-6">
          <SkeletonLoader height="h-64" count={3} className="space-y-4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load timeline</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadData} variant="primary" icon="RefreshCw">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const weekDays = getWeekDays();

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
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Timeline View
          </h1>
          <div className="flex items-center space-x-3">
            <select
              value={currentProject?.Id || ''}
              onChange={(e) => {
                const project = projects.find(p => p.Id === parseInt(e.target.value));
                setCurrentProject(project);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {projects.map(project => (
                <option key={project.Id} value={project.Id}>
                  {project.name}
                </option>
              ))}
            </select>
            <Button variant="outline" icon="Calendar">
              Today
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              icon="ChevronLeft"
              onClick={() => navigateWeek(-1)}
            />
            <h2 className="text-lg font-semibold text-gray-900">
              {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
            </h2>
            <Button
              variant="ghost"
              icon="ChevronRight"
              onClick={() => navigateWeek(1)}
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{tasks.length} tasks scheduled</span>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto">
        {!currentProject ? (
          <EmptyState
            title="No project selected"
            description="Select a project to view its timeline"
            icon="Calendar"
          />
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No scheduled tasks"
            description="Tasks with due dates will appear here"
            icon="CalendarX"
          />
        ) : (
          <div className="p-6">
            {/* Timeline Header */}
            <div className="grid grid-cols-8 gap-4 mb-6">
              <div className="col-span-1"></div>
              {weekDays.map(day => (
                <div key={day.toISOString()} className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {format(day, 'EEE')}
                  </div>
                  <div className="text-xl font-bold text-gray-700">
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline Rows */}
            <div className="space-y-4">
              {users.map(user => {
                const userTasks = tasks.filter(task => task.assigneeId === user.Id);
                if (userTasks.length === 0) return null;

                return (
                  <div key={user.Id} className="grid grid-cols-8 gap-4 items-center">
                    {/* User Column */}
                    <div className="col-span-1 flex items-center space-x-3">
                      <Avatar
                        src={user.avatar}
                        name={user.name}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {userTasks.length} task{userTasks.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Columns */}
                    {weekDays.map(day => {
                      const dayTasks = getTasksForDay(day).filter(task => task.assigneeId === user.Id);
                      
                      return (
                        <div key={day.toISOString()} className="relative h-16">
                          {dayTasks.map((task, index) => {
                            const getPriorityColor = (priority) => {
                              switch (priority) {
                                case 'high': return 'bg-error';
                                case 'medium': return 'bg-warning';
                                case 'low': return 'bg-success';
                                default: return 'bg-primary';
                              }
                            };

                            return (
                              <motion.div
                                key={task.Id}
                                variants={taskBarVariants}
                                initial="initial"
                                animate="animate"
                                whileHover="hover"
                                transition={{ delay: index * 0.1 }}
                                className={`
                                  absolute inset-x-0 rounded-md p-2 cursor-pointer shadow-sm
                                  ${getPriorityColor(task.priority)} text-white
                                `}
                                style={{
                                  top: `${index * 20}px`,
                                  height: '16px'
                                }}
                                title={`${task.title} - ${task.priority} priority`}
                              >
                                <div className="text-xs font-medium truncate">
                                  {task.title}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Priority Legend</h3>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-error rounded"></div>
                  <span className="text-sm text-gray-700">High Priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-warning rounded"></div>
                  <span className="text-sm text-gray-700">Medium Priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-success rounded"></div>
                  <span className="text-sm text-gray-700">Low Priority</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Timeline;