import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { userService } from "@/services/api/userService";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import EmptyState from "@/components/molecules/EmptyState";
import TaskCard from "@/components/molecules/TaskCard";
import SkeletonLoader from "@/components/atoms/SkeletonLoader";
import Button from "@/components/atoms/Button";
const KanbanBoard = ({ project, onTaskClick, onAddTask }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (project) {
      loadData();
    }
  }, [project]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksResult, usersResult] = await Promise.all([
        taskService.getByProjectId(project.Id),
        userService.getAll()
      ]);
      setTasks(tasksResult);
      setUsers(usersResult);
    } catch (err) {
      setError(err.message || 'Failed to load board data');
      toast.error('Failed to load board data');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      const taskId = parseInt(draggableId, 10);
      await taskService.updateColumn(taskId, destination.droppableId);
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.Id === taskId 
            ? { ...task, column: destination.droppableId }
            : task
        )
      );

      toast.success('Task moved successfully');
    } catch (err) {
      toast.error('Failed to move task');
      console.error('Drag error:', err);
    }
  };

  const getTasksForColumn = (columnId) => {
    return tasks.filter(task => task.column === columnId);
  };

  const getUserById = (userId) => {
    return users.find(user => user.Id === userId);
  };

  const getColumnStats = (columnId) => {
    const columnTasks = getTasksForColumn(columnId);
    return {
      total: columnTasks.length,
      completed: columnTasks.filter(task => task.column === 'done').length
    };
  };

  const columnVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="space-y-4">
            <SkeletonLoader height="h-12" />
            <div className="space-y-3">
              <SkeletonLoader height="h-24" count={3} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load board</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadData} variant="primary" icon="RefreshCw">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <EmptyState
        title="No project selected"
        description="Select a project to view its board"
        icon="LayoutGrid"
      />
    );
  }
}

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
          // Handle project.columns which might be a string, null, or undefined
          let columnsArray = [];
          
          if (project && project.columns) {
            try {
              // If columns is a string, try to parse it as JSON
              if (typeof project.columns === 'string') {
                columnsArray = JSON.parse(project.columns);
              } else if (Array.isArray(project.columns)) {
                columnsArray = project.columns;
              }
            } catch (error) {
              console.warn('Failed to parse project columns:', error);
              // Fall back to default columns
              columnsArray = [];
            }
          }
          
          // If no valid columns found, use default columns
          if (!Array.isArray(columnsArray) || columnsArray.length === 0) {
            columnsArray = [
              { id: 'todo', title: 'To Do', color: '#6B7280' },
              { id: 'in-progress', title: 'In Progress', color: '#F59E0B' },
              { id: 'review', title: 'Review', color: '#3B82F6' },
              { id: 'done', title: 'Done', color: '#10B981' }
            ];
          }
          
          return columnsArray.map((column, index) => {
            const columnTasks = getTasksForColumn(column.id);
            
            return (
            <motion.div
              key={column.id}
              variants={columnVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              className="flex flex-col bg-gray-50 rounded-lg"
            >
              {/* Column Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <h3 className="font-semibold text-gray-900">
                      {column.title}
                    </h3>
                  </div>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {columnTasks.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Plus"
                  onClick={() => onAddTask && onAddTask(column.id)}
                  className="w-full justify-center"
                >
                  Add Task
                </Button>
              </div>

              {/* Column Content */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      flex-1 p-4 space-y-3 min-h-[200px] transition-colors duration-200
                      ${snapshot.isDraggingOver ? 'bg-primary/5 animate-drop-zone' : ''}
                    `}
                  >
                    <AnimatePresence>
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.Id}
                          draggableId={task.Id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                user={getUserById(task.assigneeId)}
                                commentsCount={0} // Will be populated when comments are loaded
                                onClick={() => onTaskClick && onTaskClick(task)}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}

                    {columnTasks.length === 0 && (
                      <div className="flex items-center justify-center h-32 text-gray-400">
                        <div className="text-center">
                          <ApperIcon name="Package" className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">No tasks</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </motion.div>
);
        })()}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;