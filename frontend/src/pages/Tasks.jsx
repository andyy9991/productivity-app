import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, Circle, Calendar, XCircle, ArrowUpCircle, Plus, ChevronDown, X } from 'lucide-react';
import { 
  fetchTasks, 
  createTask,
  toggleTaskCompletion as toggleTaskCompletionService,
  toggleTaskTodayStatus as toggleTaskTodayStatusService
} from '../services/taskService';

const Tasks = () => {
  const defaultCategories = ['Study', 'Gym', 'Personal', 'Work'];
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'completed'
  const [showAddForm, setShowAddForm] = useState(false);
  const [categories, setCategories] = useState(defaultCategories);
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'Study',
    difficulty: 'Medium',
    motivation_resistance: 'Medium',
    to_be_done_today: false
  });

  // Fetch tasks from the backend
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const data = await fetchTasks();
        setTasks(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Handle task completion toggle
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      const updatedTask = await toggleTaskCompletionService(taskId, currentStatus);
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, done: !currentStatus } : task
      ));
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message);
    }
  };

  // Toggle today status
  const toggleTodayStatus = async (taskId, currentStatus) => {
    try {
      const updatedTask = await toggleTaskTodayStatusService(taskId, currentStatus);
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, to_be_done_today: !currentStatus } : task
      ));
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message);
    }
  };

  // Handle input change for new task form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTask({
      ...newTask,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Add new category
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  // Handle form submission for new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Add default rewards based on difficulty
      let xpReward = 0;
      let coinReward = 0;
      
      switch(newTask.difficulty.toLowerCase()) {
        case 'easy':
          xpReward = 5;
          coinReward = 2;
          break;
        case 'medium':
          xpReward = 10;
          coinReward = 5;
          break;
        case 'hard':
          xpReward = 20;
          coinReward = 10;
          break;
        case 'very hard':
          xpReward = 40;
          coinReward = 20;
          break;
        default:
          xpReward = 10;
          coinReward = 5;
      }
      
      const taskData = {
        ...newTask,
        xp_reward: xpReward,
        coin_reward: coinReward,
        done: false
      };
      
      const createdTask = await createTask(taskData);
      
      // Update local state
      setTasks([createdTask, ...tasks]);
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        category: newTask.category,
        difficulty: 'Medium',
        motivation_resistance: 'Medium',
        to_be_done_today: false
      });
      
      // Close form
      setShowAddForm(false);
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message);
    }
  };

  // Get filtered tasks based on current filter
  const getFilteredTasks = () => {
    switch (filter) {
      case 'today':
        return tasks.filter(task => task.to_be_done_today);
      case 'completed':
        return tasks.filter(task => task.done);
      default:
        return tasks;
    }
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      case 'very hard':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get resistance badge color
  const getResistanceColor = (resistance) => {
    switch (resistance?.toLowerCase()) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'today' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'completed' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Completed
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white border rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add New Task</h2>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                Task Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What do you need to do?"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Add more details about this task"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="category">
                  Category
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={newTask.category}
                    onChange={handleInputChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md appearance-none"
                  >
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
                
                {/* Add Category */}
                <div className="mt-1">
                  {!showAddCategory ? (
                    <button
                      type="button"
                      onClick={() => setShowAddCategory(true)}
                      className="text-blue-500 text-sm flex items-center hover:text-blue-700"
                    >
                      <Plus size={14} className="mr-1" />
                      Add New Category
                    </button>
                  ) : (
                    <div className="flex mt-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="New category name"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="bg-blue-500 text-white px-3 py-1 text-sm rounded-r-md hover:bg-blue-600"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="difficulty">
                  Difficulty
                </label>
                <div className="relative">
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={newTask.difficulty}
                    onChange={handleInputChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md appearance-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Very Hard">Very Hard</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="motivation_resistance">
                Motivation Resistance
              </label>
              <div className="relative">
                <select
                  id="motivation_resistance"
                  name="motivation_resistance"
                  value={newTask.motivation_resistance}
                  onChange={handleInputChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  id="to_be_done_today"
                  name="to_be_done_today"
                  type="checkbox"
                  checked={newTask.to_be_done_today}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="to_be_done_today" className="ml-2 block text-gray-700 text-sm font-medium">
                  Add to today's tasks
                </label>
              </div>
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
                Add Task
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
          <p className="mt-4 text-gray-600">Loading your tasks...</p>
        </div>
      ) : getFilteredTasks().length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-10 text-center">
          <h3 className="text-xl font-medium text-gray-600">No tasks found</h3>
          <p className="text-gray-500 mt-2">
            {filter === 'today' 
              ? "You don't have any tasks scheduled for today." 
              : filter === 'completed' 
                ? "You haven't completed any tasks yet."
                : "You don't have any tasks. Create one to get started!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {getFilteredTasks().map((task) => (
            <div 
              key={task.id}
              className={`border rounded-lg shadow-sm transition-all ${
                task.done ? 'bg-gray-50' : 'bg-white'
              } hover:shadow-md`}
            >
              <div className="p-4 flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <button 
                    onClick={() => toggleTaskCompletion(task.id, task.done)}
                    className="mt-1 flex-shrink-0 focus:outline-none"
                  >
                    {task.done ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400 hover:text-blue-500" />
                    )}
                  </button>
                  
                  <div className={task.done ? 'opacity-60' : ''}>
                    <h3 className={`text-lg font-medium ${task.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className="mt-1 text-gray-600">{task.description}</p>
                    )}
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {task.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {task.category}
                        </span>
                      )}
                      
                      {task.difficulty && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                          {task.difficulty}
                        </span>
                      )}
                      
                      {task.motivation_resistance && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResistanceColor(task.motivation_resistance)}`}>
                          Resistance: {task.motivation_resistance}
                        </span>
                      )}
                      
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        XP: {task.xp_reward}
                      </div>
                      
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Coins: {task.coin_reward}
                      </div>
                    </div>
                    
                    {task.time && (
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(task.time)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => toggleTodayStatus(task.id, task.to_be_done_today)}
                    className={`p-1 rounded-full focus:outline-none ${
                      task.to_be_done_today ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-blue-500'
                    }`}
                    title={task.to_be_done_today ? "Remove from today" : "Add to today"}
                  >
                    {task.to_be_done_today ? (
                      <XCircle className="h-5 w-5" />
                    ) : (
                      <ArrowUpCircle className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;