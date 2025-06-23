import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';
import { projectService } from '../../services/api/projectService';
import SkeletonLoader from '../atoms/SkeletonLoader';

const ProjectSwitcher = () => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
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
      if (result.length > 0 && !currentProject) {
        setCurrentProject(result[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (project) => {
    setCurrentProject(project);
    setIsOpen(false);
    toast.success(`Switched to ${project.name}`);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  if (loading) {
    return <SkeletonLoader height="h-10" rounded="rounded-lg" />;
  }

  if (error) {
    return (
      <Button
        variant="ghost"
        onClick={loadProjects}
        className="w-full justify-center text-error"
      >
        <ApperIcon name="AlertCircle" className="w-4 h-4 mr-2" />
        Retry
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-md flex items-center justify-center">
            <ApperIcon name="Folder" className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {currentProject?.name || 'Select Project'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          className="w-4 h-4 text-gray-400" 
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          >
            <div className="p-2">
              {projects.map((project) => (
                <motion.button
                  key={project.Id}
                  whileHover={{ backgroundColor: '#F3F4F6' }}
                  onClick={() => handleProjectSelect(project)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors
                    ${currentProject?.Id === project.Id ? 'bg-primary/10 text-primary' : 'text-gray-700'}
                  `}
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-md flex items-center justify-center">
                    <ApperIcon name="Folder" className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{project.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {project.description}
                    </p>
                  </div>
                  {currentProject?.Id === project.Id && (
                    <ApperIcon name="Check" className="w-4 h-4 text-primary" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectSwitcher;