/**
 * Reflection service for handling all reflection-related API calls
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
 * Fetch all reflection logs for the current user
 * @param {Object} filters - Optional filters to apply (date, time_block, mode)
 * @returns {Promise<Array>} Array of reflection log objects
 */
export const fetchReflections = async (filters = {}) => {
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
    
    const response = await fetch(`${API_BASE_URL}/api/reflections?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch reflection logs: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchReflections:', error);
    throw error;
  }
};

/**
 * Create a new reflection log
 * @param {Object} reflectionData - The reflection log data
 * @returns {Promise<Object>} Created reflection log object
 */
export const createReflection = async (reflectionData) => {
  try {
    // Ensure user_id is set
    const reflectionWithUserId = {
      ...reflectionData,
      user_id: getUserId()
    };
    
    const response = await fetch(`${API_BASE_URL}/api/reflections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reflectionWithUserId)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create reflection log: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating reflection log:', error);
    throw error;
  }
};

/**
 * Update an existing reflection log
 * @param {number} reflectionId - The ID of the reflection log to update
 * @param {Object} updateData - The fields to update
 * @returns {Promise<Object>} Updated reflection log object
 */
export const updateReflection = async (reflectionId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reflections/${reflectionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update reflection log: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating reflection log ${reflectionId}:`, error);
    throw error;
  }
};

/**
 * Fetch reflection analytics data (e.g., average energy/focus by time block)
 * @param {Object} params - Parameters for the analytics (time range, grouping, metrics)
 * @returns {Promise<Object>} Analytics data
 */
export const fetchReflectionAnalytics = async (params = {}) => {
  try {
    const userId = getUserId();
    
    // Build query string
    let queryParams = new URLSearchParams({ 
      user_id: userId,
      ...params
    });
    
    const response = await fetch(`${API_BASE_URL}/api/reflections/analytics?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch reflection analytics: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching reflection analytics:', error);
    throw error;
  }
};

/**
 * Fetch a single reflection log by ID
 * @param {number} reflectionId - The ID of the reflection log to fetch
 * @returns {Promise<Object>} Reflection log object
 */
export const fetchReflectionById = async (reflectionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reflections/${reflectionId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch reflection log: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching reflection log ${reflectionId}:`, error);
    throw error;
  }
};