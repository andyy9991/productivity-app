/**
 * Reward service for handling all reward-related API calls
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
 * Fetch all rewards for the current user
 * @param {Object} filters - Optional filters to apply (claimed status)
 * @returns {Promise<Array>} Array of reward objects
 */
export const fetchRewards = async (filters = {}) => {
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
    
    const response = await fetch(`${API_BASE_URL}/api/rewards?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch rewards: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchRewards:', error);
    throw error;
  }
};

/**
 * Create a new reward
 * @param {Object} rewardData - The reward data
 * @returns {Promise<Object>} Created reward object
 */
export const createReward = async (rewardData) => {
  try {
    // Ensure user_id is set
    const rewardWithUserId = {
      ...rewardData,
      user_id: getUserId()
    };
    
    const response = await fetch(`${API_BASE_URL}/api/rewards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rewardWithUserId)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create reward: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating reward:', error);
    throw error;
  }
};

/**
 * Claim a reward
 * @param {number} rewardId - The ID of the reward to claim
 * @returns {Promise<Object>} Response with claimed reward and remaining coins
 */
export const claimReward = async (rewardId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rewards/${rewardId}/claim`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      // Parse error message if available
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to claim reward: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error claiming reward ${rewardId}:`, error);
    throw error;
  }
};