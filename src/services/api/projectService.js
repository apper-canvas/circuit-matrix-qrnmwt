import projectsData from '../mockData/projects.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let projects = [...projectsData];

export const projectService = {
  async getAll() {
    await delay(300);
    return [...projects];
  },

  async getById(id) {
    await delay(200);
    const project = projects.find(p => p.Id === parseInt(id, 10));
    if (!project) {
      throw new Error('Project not found');
    }
    return { ...project };
  },

  async create(projectData) {
    await delay(400);
    const newProject = {
      ...projectData,
      Id: Math.max(...projects.map(p => p.Id), 0) + 1,
      columns: projectData.columns || [
        { id: "todo", title: "To Do", color: "#6B7280" },
        { id: "in-progress", title: "In Progress", color: "#F59E0B" },
        { id: "review", title: "Review", color: "#3B82F6" },
        { id: "done", title: "Done", color: "#10B981" }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, projectData) {
    await delay(300);
    const index = projects.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    const updatedProject = {
      ...projects[index],
      ...projectData,
      Id: projects[index].Id, // Prevent ID modification
      updatedAt: new Date().toISOString()
    };
    
    projects[index] = updatedProject;
    return { ...updatedProject };
  },

  async delete(id) {
    await delay(250);
    const index = projects.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    const deletedProject = projects[index];
    projects.splice(index, 1);
    return { ...deletedProject };
  }
};