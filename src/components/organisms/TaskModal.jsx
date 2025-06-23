import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import ApperIcon from '../ApperIcon';
import { taskService } from '../../services/api/taskService';
import { commentService } from '../../services/api/commentService';
import { userService } from '../../services/api/userService';

const TaskModal = ({ task, isOpen, onClose, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && task) {
      loadTaskData();
      setEditData(task);
    }
  }, [isOpen, task]);

const loadTaskData = async () => {
    setLoading(true);
    try {
      const [commentsResult, usersResult] = await Promise.all([
        commentService.getByTaskId(task.Id),
        userService.getAll()
      ]);
      setComments(commentsResult || []);
      setUsers(usersResult || []);
    } catch (err) {
      toast.error('Failed to load task data');
    } finally {
      setLoading(false);
    }
  };

const handleSave = async () => {
    setSaving(true);
    try {
      const updatedTask = await taskService.update(task.Id, editData);
      if (updatedTask) {
        onUpdate && onUpdate(updatedTask);
        setEditMode(false);
      }
    } catch (err) {
      // Error handling is done in the service
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(task.Id);
        onDelete && onDelete(task.Id);
        onClose();
        toast.success('Task deleted successfully');
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = await commentService.create({
        taskId: task.Id,
        userId: 1, // Default user for demo
        content: newComment.trim()
      });
      setComments([...comments, comment]);
      setNewComment('');
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const getUserById = (userId) => {
    return users.find(user => user.Id === userId);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Badge variant={getPriorityColor(task.priority)} size="sm">
                    {task.priority}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Task #{task.Id}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={editMode ? "X" : "Edit"}
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? 'Cancel' : 'Edit'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="X"
                    onClick={onClose}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  {editMode ? (
                    <Input
                      value={editData.title || ''}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="text-lg font-semibold"
                    />
                  ) : (
                    <h1 className="text-xl font-semibold text-gray-900">
                      {task.title}
                    </h1>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  {editMode ? (
                    <textarea
                      value={editData.description || ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {task.description || 'No description provided'}
                    </p>
                  )}
                </div>

                {/* Task Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Assignee */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignee
                    </label>
                    {editMode ? (
                      <select
                        value={editData.assigneeId || ''}
                        onChange={(e) => setEditData({ ...editData, assigneeId: parseInt(e.target.value) || null })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      >
                        <option value="">Unassigned</option>
                        {users.map(user => (
                          <option key={user.Id} value={user.Id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {getUserById(task.assigneeId) ? (
                          <>
                            <Avatar 
                              src={getUserById(task.assigneeId).avatar}
                              name={getUserById(task.assigneeId).name}
                              size="sm"
                            />
                            <span className="text-sm text-gray-700">
                              {getUserById(task.assigneeId).name}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">Unassigned</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    {editMode ? (
                      <Input
                        type="date"
                        value={editData.dueDate ? format(new Date(editData.dueDate), 'yyyy-MM-dd') : ''}
                        onChange={(e) => setEditData({ 
                          ...editData, 
                          dueDate: e.target.value ? new Date(e.target.value).toISOString() : null 
                        })}
                      />
                    ) : (
                      <span className="text-sm text-gray-700">
                        {task.dueDate 
                          ? format(new Date(task.dueDate), 'MMM d, yyyy')
                          : 'No due date'
                        }
                      </span>
                    )}
                  </div>
                </div>

                {/* Labels */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Labels
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(task.labels || []).map((label, index) => (
                      <Badge key={index} variant="default" size="sm">
                        {label}
                      </Badge>
                    ))}
                    {(!task.labels || task.labels.length === 0) && (
                      <span className="text-sm text-gray-500">No labels</span>
                    )}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Comments ({comments.length})
                  </label>
                  
                  {/* Add Comment */}
                  <form onSubmit={handleAddComment} className="mb-4">
                    <div className="flex space-x-3">
                      <Avatar name="Current User" size="sm" />
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        />
                        <div className="mt-2 flex justify-end">
                          <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={!newComment.trim()}
                          >
                            Add Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map(comment => {
                      const user = getUserById(comment.userId);
                      return (
                        <div key={comment.Id} className="flex space-x-3">
                          <Avatar 
                            src={user?.avatar}
                            name={user?.name}
                            size="sm"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm text-gray-900">
                                {user?.name || 'Unknown User'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {format(new Date(comment.createdAt), 'MMM d, yyyy at h:mm a')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {comments.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200">
                <Button
                  variant="danger"
                  size="sm"
                  icon="Trash2"
                  onClick={handleDelete}
                >
                  Delete Task
                </Button>
                
                {editMode && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      loading={saving}
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;