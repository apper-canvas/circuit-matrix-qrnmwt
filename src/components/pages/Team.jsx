import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '../atoms/Button';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import ApperIcon from '../ApperIcon';
import SkeletonLoader from '../atoms/SkeletonLoader';
import EmptyState from '../molecules/EmptyState';
import { userService } from '../../services/api/userService';
import { taskService } from '../../services/api/taskService';
import { projectService } from '../../services/api/projectService';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersResult, tasksResult, projectsResult] = await Promise.all([
        userService.getAll(),
        taskService.getAll(),
        projectService.getAll()
      ]);
      setUsers(usersResult);
      setTasks(tasksResult);
      setProjects(projectsResult);
    } catch (err) {
      setError(err.message || 'Failed to load team data');
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const getUserStats = (userId) => {
    const userTasks = tasks.filter(task => task.assigneeId === userId);
    const completedTasks = userTasks.filter(task => task.column === 'done');
    const inProgressTasks = userTasks.filter(task => task.column === 'in-progress');
    const overdueTasks = userTasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.column !== 'done';
    });

    return {
      total: userTasks.length,
      completed: completedTasks.length,
      inProgress: inProgressTasks.length,
      overdue: overdueTasks.length,
      completionRate: userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0
    };
  };

  const getActivityLevel = (stats) => {
    if (stats.total === 0) return { level: 'inactive', color: 'default' };
    if (stats.total >= 10) return { level: 'very active', color: 'success' };
    if (stats.total >= 5) return { level: 'active', color: 'info' };
    if (stats.total >= 2) return { level: 'moderate', color: 'warning' };
    return { level: 'light', color: 'default' };
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.02, y: -4 }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <SkeletonLoader height="h-8" width="w-64" className="mb-4" />
          <SkeletonLoader height="h-20" width="w-full" />
        </div>
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <SkeletonLoader height="h-16" className="mb-4" />
                <SkeletonLoader height="h-4" count={3} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load team data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadData} variant="primary" icon="RefreshCw">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        title="No team members found"
        description="Add team members to start collaborating on projects"
        actionLabel="Add Member"
        icon="Users"
      />
    );
  }

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
            Team Members
          </h1>
          <div className="flex items-center space-x-3">
            <Button variant="outline" icon="UserPlus">
              Invite Member
            </Button>
            <Button variant="primary" icon="Settings">
              Manage Team
            </Button>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Members</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <ApperIcon name="Users" className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <ApperIcon name="FolderOpen" className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <ApperIcon name="CheckSquare" className="w-8 h-8 text-success" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter(t => t.column === 'done').length}
                </p>
              </div>
              <ApperIcon name="Trophy" className="w-8 h-8 text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => {
            const stats = getUserStats(user.Id);
            const activity = getActivityLevel(stats);

            return (
              <motion.div
                key={user.Id}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer"
              >
                {/* Member Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="lg"
                    className="border-2 border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {user.role}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Badge variant={activity.color} size="sm">
                    {activity.level}
                  </Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{stats.total}</p>
                    <p className="text-xs text-gray-600">Total Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-success">{stats.completed}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-warning">{stats.inProgress}</p>
                    <p className="text-xs text-gray-600">In Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-error">{stats.overdue}</p>
                    <p className="text-xs text-gray-600">Overdue</p>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.completionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.completionRate}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="MessageCircle"
                    className="flex-1"
                  >
                    Message
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="BarChart3"
                    className="flex-1"
                  >
                    View Stats
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Team;