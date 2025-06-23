import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import ApperIcon from '../ApperIcon';
import SkeletonLoader from '../atoms/SkeletonLoader';
import { projectService } from '../../services/api/projectService';

const ProjectSettings = () => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await projectService.getAll();
      setProjects(result);
      if (result.length > 0) {
        setCurrentProject(result[0]);
        setEditData(result[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentProject) return;

    setSaving(true);
    try {
      const updatedProject = await projectService.update(currentProject.Id, editData);
      setCurrentProject(updatedProject);
      setProjects(projects.map(p => 
        p.Id === updatedProject.Id ? updatedProject : p
      ));
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error('Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const handleColumnUpdate = (columnIndex, field, value) => {
    const newColumns = [...(editData.columns || [])];
    newColumns[columnIndex] = {
      ...newColumns[columnIndex],
      [field]: value
    };
    setEditData({ ...editData, columns: newColumns });
  };

  const addColumn = () => {
    const newColumns = [...(editData.columns || [])];
    newColumns.push({
      id: `column-${Date.now()}`,
      title: 'New Column',
      color: '#6B7280'
    });
    setEditData({ ...editData, columns: newColumns });
  };

  const removeColumn = (columnIndex) => {
    const newColumns = [...(editData.columns || [])];
    newColumns.splice(columnIndex, 1);
    setEditData({ ...editData, columns: newColumns });
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <SkeletonLoader height="h-8" width="w-64" />
        </div>
        <div className="flex-1 p-6 space-y-6">
          <SkeletonLoader height="h-48" />
          <SkeletonLoader height="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load settings</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadProjects} variant="primary" icon="RefreshCw">
            Try Again
          </Button>
        </div>
      </div>
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Project Settings
          </h1>
          <div className="flex items-center space-x-3">
            <select
              value={currentProject?.Id || ''}
              onChange={(e) => {
                const project = projects.find(p => p.Id === parseInt(e.target.value));
                setCurrentProject(project);
                setEditData(project);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {projects.map(project => (
                <option key={project.Id} value={project.Id}>
                  {project.name}
                </option>
              ))}
            </select>
            <Button
              variant="primary"
              loading={saving}
              onClick={handleSave}
              disabled={!currentProject}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!currentProject ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <ApperIcon name="Settings" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No project selected</h3>
              <p className="text-gray-600">Select a project to configure its settings</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Project Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Project Information
              </h2>
              <div className="space-y-4">
                <Input
                  label="Project Name"
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editData.description || ''}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Enter project description..."
                  />
                </div>
              </div>
            </div>

            {/* Board Columns */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Board Columns
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  icon="Plus"
                  onClick={addColumn}
                >
                  Add Column
                </Button>
              </div>
              
              <div className="space-y-4">
                {(editData.columns || []).map((column, index) => (
                  <motion.div
                    key={column.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Column Title"
                        value={column.title}
                        onChange={(e) => handleColumnUpdate(index, 'title', e.target.value)}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={column.color}
                            onChange={(e) => handleColumnUpdate(index, 'color', e.target.value)}
                            className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={column.color}
                            onChange={(e) => handleColumnUpdate(index, 'color', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => removeColumn(index)}
                      className="text-error hover:text-error/90"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-sm border border-error/20 p-6">
              <h2 className="text-lg font-semibold text-error mb-4">
                Danger Zone
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-error/20 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Delete Project</h3>
                    <p className="text-sm text-gray-600">
                      Permanently delete this project and all its data. This action cannot be undone.
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    icon="Trash2"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                        // Handle project deletion
                        toast.error('Project deletion not implemented in demo');
                      }
                    }}
                  >
                    Delete Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectSettings;