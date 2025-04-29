import React, { useState, useEffect } from 'react';
import { Loader2, Gift, Check, Plus, X } from 'lucide-react';
import { fetchRewards, createReward, claimReward } from '../services/rewardService';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCoins, setUserCoins] = useState(0);
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'claimed'
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReward, setNewReward] = useState({
    title: '',
    cost: 0,
    description: ''
  });
  const [formError, setFormError] = useState('');

  // Fetch rewards and user data from the backend
  useEffect(() => {
    const loadRewards = async () => {
      try {
        setLoading(true);
        const data = await fetchRewards();
        setRewards(data);
        
        // In a real app, you would fetch the user's coins here
        // For now we'll calculate it from local storage or use a default
        const userId = localStorage.getItem('userId') || 1;
        // This would normally come from a user profile endpoint
        // For demo purposes, we'll simulate it
        // In a real app you would have a userService.fetchUserProfile()
        const storedCoins = localStorage.getItem('userCoins') || 100;
        setUserCoins(parseInt(storedCoins));
        
        // Set default filter to available
        setFilter('available');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rewards:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadRewards();
  }, []);

  // Handle reward claiming
  const handleClaimReward = async (rewardId) => {
    try {
      const result = await claimReward(rewardId);
      
      // Update local state with the claimed reward and new coin total
      setRewards(rewards.map(reward => 
        reward.id === rewardId ? { ...reward, claimed: true } : reward
      ));
      
      setUserCoins(result.user_coins_remaining);
      // Update local storage for demo purposes
      localStorage.setItem('userCoins', result.user_coins_remaining);
      
    } catch (err) {
      console.error('Error claiming reward:', err);
      setError(err.message);
    }
  };

  // Get filtered rewards based on current filter
  const getFilteredRewards = () => {
    switch (filter) {
      case 'available':
        return rewards.filter(reward => !reward.claimed);
      case 'claimed':
        return rewards.filter(reward => reward.claimed);
      default:
        return rewards.filter(reward => !reward.claimed); // Default to available
    }
  };

  // Handle input change for new reward form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReward({
      ...newReward,
      [name]: name === 'cost' ? parseInt(value) || 0 : value
    });
  };

  // Handle form submission for new reward
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validate form
    if (!newReward.title.trim()) {
      setFormError('Title is required');
      return;
    }
    
    if (newReward.cost <= 0) {
      setFormError('Cost must be greater than 0');
      return;
    }
    
    try {
      const createdReward = await createReward(newReward);
      
      // Update local state
      setRewards([...rewards, createdReward]);
      
      // Reset form
      setNewReward({
        title: '',
        cost: 0,
        description: ''
      });
      
      // Close form
      setShowAddForm(false);
    } catch (err) {
      console.error('Error creating reward:', err);
      setFormError(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Rewards Shop</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium flex items-center">
            <span className="mr-2">🪙</span>
            {userCoins} coins
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            {showAddForm ? <X size={20} /> : <Plus size={20} />}
          </button>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilter('available')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'available' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Available
        </button>
        <button
          onClick={() => setFilter('claimed')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'claimed' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Claimed
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Reward</h2>
          {formError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newReward.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Netflix time, New book, etc."
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cost">
                Cost (coins)
              </label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={newReward.cost}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={newReward.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="mr-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Reward
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Loading rewards...</p>
        </div>
      ) : getFilteredRewards().length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-10 text-center">
          <h3 className="text-xl font-medium text-gray-600">No rewards found</h3>
          <p className="text-gray-500 mt-2">
            {filter === 'available' 
              ? "You don't have any available rewards. Add some to motivate yourself!" 
              : filter === 'claimed' 
                ? "You haven't claimed any rewards yet."
                : "You don't have any rewards. Create one to get started!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getFilteredRewards().map((reward) => (
            <div 
              key={reward.id}
              className={`border rounded-lg shadow-sm transition-all ${
                reward.claimed ? 'bg-gray-50' : 'bg-white'
              } hover:shadow-md`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-lg font-medium ${reward.claimed ? 'text-gray-500' : 'text-gray-800'}`}>
                    {reward.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    🪙 {reward.cost}
                  </span>
                </div>
                
                {reward.description && (
                  <p className="mt-1 text-gray-600 text-sm">{reward.description}</p>
                )}
                
                <div className="mt-4 flex justify-end">
                  {reward.claimed ? (
                    <span className="flex items-center text-green-600 text-sm">
                      <Check size={16} className="mr-1" />
                      Claimed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleClaimReward(reward.id)}
                      disabled={userCoins < reward.cost}
                      className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
                        userCoins >= reward.cost
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Gift size={16} className="mr-1" />
                      Claim
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rewards;