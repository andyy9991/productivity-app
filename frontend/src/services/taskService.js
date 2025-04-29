/**
 * Task service for handling all task-related API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Empty string for same-origin requests, or set to your API URL if cross-origin

/**
 * Get the current user ID from local storage
 * @returns {number} The user ID
 */
const getUserId = () => {
  return localStorage.getItem('userId') || 1; // Default to 1 for demo
};

/**
 * Fetch all tasks for the current user
 * @param {Object} filters - Optional filters to apply
 * @returns {Promise<Array>} Array of task objects
 */
export const fetchTasks = async (filters = {}) => {
  try {
    const userId = getUserId();
    
    // Build query string from filters
    let queryParams = new URLSearchParams({ user_id: userId });
    
    // Add any additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/api/tasks?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchTasks:', error);
    throw error;
  }
};

/**
 * Fetch a single task by ID
 * @param {number} taskId - The ID of the task to fetch
 * @returns {Promise<Object>} Task object
 */
export const fetchTaskById = async (taskId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch task: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching task ${taskId}:`, error);
    throw error;
  }
};

/**
 * Create a new task
 * @param {Object} taskData - The task data
 * @returns {Promise<Object>} Created task object
 */
export const createTask = async (taskData) => {
  try {
    // Ensure user_id is set
    const taskWithUserId = {
      ...taskData,
      user_id: getUserId()
    };
    
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskWithUserId)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/**
 * Update a task
 * @param {number} taskId - The ID of the task to update
 * @param {Object} updateData - The fields to update
 * @returns {Promise<Object>} Updated task object
 */
export const updateTask = async (taskId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update task: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
    throw error;
  }
};

/**
 * Toggle task completion status
 * @param {number} taskId - The ID of the task
 * @param {boolean} currentStatus - Current completion status
 * @returns {Promise<Object>} Updated task object
 */
export const toggleTaskCompletion = async (taskId, currentStatus) => {
  return updateTask(taskId, { done: !currentStatus });
};

/**
 * Toggle task "to be done today" status
 * @param {number} taskId - The ID of the task
 * @param {boolean} currentStatus - Current "to be done today" status
 * @returns {Promise<Object>} Updated task object
 */
export const toggleTaskTodayStatus = async (taskId, currentStatus) => {
  return updateTask(taskId, { to_be_done_today: !currentStatus });
};

/**
 * Delete a task
 * @param {number} taskId - The ID of the task to delete
 * @returns {Promise<Object>} Response message
 */
export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete task: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    throw error;
  }
};