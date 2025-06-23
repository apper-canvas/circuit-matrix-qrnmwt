import usersData from '../mockData/users.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let users = [...usersData];

export const userService = {
  async getAll() {
    await delay(300);
    return [...users];
  },

  async getById(id) {
    await delay(200);
    const user = users.find(u => u.Id === parseInt(id, 10));
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  },

  async create(userData) {
    await delay(400);
    const newUser = {
      ...userData,
      Id: Math.max(...users.map(u => u.Id), 0) + 1,
      avatar: userData.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`
    };
    users.push(newUser);
    return { ...newUser };
  },

  async update(id, userData) {
    await delay(300);
    const index = users.findIndex(u => u.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...users[index],
      ...userData,
      Id: users[index].Id // Prevent ID modification
    };
    
    users[index] = updatedUser;
    return { ...updatedUser };
  },

  async delete(id) {
    await delay(250);
    const index = users.findIndex(u => u.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('User not found');
    }
    
    const deletedUser = users[index];
    users.splice(index, 1);
    return { ...deletedUser };
  }
};