import React, { useState, useEffect } from 'react';
import { Loader2, Save, AlertCircle, Plus, ChevronDown, Clock, Gauge, Brain } from 'lucide-react';
import { fetchReflections, createReflection, updateReflection } from '../services/reflectionService';

const Reflection = () => {
  const timeBlocks = [
    { value: 'early_morning', label: 'Early Morning (6am-9am)' },
    { value: 'morning', label: 'Morning Execution (9am-12pm)' },
    { value: 'midday', label: 'Midday (12pm-2pm)' },
    { value: 'afternoon', label: 'Afternoon Push (2pm-5pm)' },
    { value: 'evening', label: 'Evening Window (5pm-8pm)' },
    { value: 'night', label: 'Night Reflection (8pm-10pm)' },
    { value: 'late_night', label: 'Late Night (10pm+)' }
  ];

  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    time_block: timeBlocks[0].value,
    energy_level: 5,
    focus_level: 5,
    main_task: '',
    reflection: '',
    mode: '',
    feedback: ''
  });

  // Compute mode based on energy and focus levels
  const calculateMode = (energy, focus) => {
    if (energy >= 7 && focus >= 7) return "👺 Demon Mode";
    if (focus >= 7 && energy < 7) return "⛩️ Monk Mode";
    if (focus < 7 && energy >= 4) return "😵 Free Roam";
    return "💤 Drift Mode";
  };

  // Compute feedback based on mode
  const calculateFeedback = (mode) => {
    if (mode === "👺 Demon Mode") return "You're on fire. Stay locked in 🔥";
    if (mode === "⛩️ Monk Mode") return "Calm control. Focus and breathe.";
    if (mode === "😵 Free Roam") return "You're drifting. Pick a mission.";
    return "Low energy. Time to reset or take a break.";
  };

  // Update mode and feedback when energy or focus levels change
  useEffect(() => {
    const mode = calculateMode(formData.energy_level, formData.focus_level);
    const feedback = calculateFeedback(mode);
    
    setFormData(prev => ({
      ...prev,
      mode,
      feedback
    }));
  }, [formData.energy_level, formData.focus_level]);

  // Fetch reflections from the backend
  useEffect(() => {
    const loadReflections = async () => {
      try {
        setLoading(true);
        const data = await fetchReflections();
        setReflections(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reflections:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadReflections();
  }, []);

  // Handle input change for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Convert range inputs to numbers
    if (name === 'energy_level' || name === 'focus_level') {
      processedValue = parseInt(value);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    // Validate form
    if (!formData.main_task.trim()) {
      setError('Please enter your main task');
      setSubmitting(false);
      return;
    }
    
    try {
      const reflectionData = {
        ...formData,
        date: new Date().toISOString()
      };
      
      const result = await createReflection(reflectionData);
      
      // Add to reflections list
      setReflections([result, ...reflections]);
      
      // Reset form partial
      setFormData({
        ...formData,
        main_task: '',
        reflection: ''
      });
      
      setSuccess('Reflection saved successfully!');
      setSubmitting(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving reflection:', err);
      setError(err.message);
      setSubmitting(false);
    }
  };



  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Helper to get time block label from value
  const getTimeBlockLabel = (value) => {
    const block = timeBlocks.find(b => b.value === value);
    return block ? block.label : value;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Daily Reflection</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form section */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">How are you feeling?</h2>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-center">
                <AlertCircle size={18} className="mr-2" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 flex items-center">
                <Save size={18} className="mr-2" />
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Time Block Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="time_block">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    Time Block
                  </div>
                </label>
                <div className="relative">
                  <select
                    id="time_block"
                    name="time_block"
                    value={formData.time_block}
                    onChange={handleInputChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md appearance-none"
                  >
                    {timeBlocks.map(block => (
                      <option key={block.value} value={block.value}>
                        {block.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
              
              {/* Energy Level Slider */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="energy_level">
                  <div className="flex items-center">
                    <Gauge size={16} className="mr-2" />
                    Energy Level: <span className="ml-2 text-blue-600 font-bold">{formData.energy_level}/10</span>
                  </div>
                </label>
                <input
                  type="range"
                  id="energy_level"
                  name="energy_level"
                  min="1"
                  max="10"
                  value={formData.energy_level}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
              
              {/* Focus Level Slider */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="focus_level">
                  <div className="flex items-center">
                    <Brain size={16} className="mr-2" />
                    Focus Level: <span className="ml-2 text-blue-600 font-bold">{formData.focus_level}/10</span>
                  </div>
                </label>
                <input
                  type="range"
                  id="focus_level"
                  name="focus_level"
                  min="1"
                  max="10"
                  value={formData.focus_level}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Scattered</span>
                  <span>Focused</span>
                  <span>Locked In</span>
                </div>
              </div>
              
              {/* Main Task with Category Dropdown */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="main_task">
                  What's your main task?
                </label>
                <input
                  type="text"
                  id="main_task"
                  name="main_task"
                  value={formData.main_task}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What are you working on?"
                />
              </div>

              {/* Mode and Feedback Display */}
              <div className="mb-6 bg-gray-50 rounded-md p-4 border">
                <h3 className="font-medium text-gray-700 mb-2">Current Mode:</h3>
                <div className="text-lg font-bold mb-2">{formData.mode}</div>
                <p className="text-gray-600">{formData.feedback}</p>
              </div>
              
              {/* Reflection Textarea */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="reflection">
                  Reflection (optional)
                </label>
                <textarea
                  id="reflection"
                  name="reflection"
                  value={formData.reflection}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How did this time block go? What worked well? What didn't?"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Reflection
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Recent Reflections Section */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Reflections</h2>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="mt-2 text-gray-600">Loading reflections...</p>
              </div>
            ) : reflections.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-500">No reflections yet. Start by creating one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reflections.slice(0, 5).map((reflection) => (
                  <div 
                    key={reflection.id} 
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="text-sm font-medium text-gray-800">
                          {getTimeBlockLabel(reflection.time_block)}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDate(reflection.date)}
                        </span>
                      </div>
                      <span className="text-lg">{reflection.mode.split(' ')[0]}</span>
                    </div>
                    
                    <p className="text-gray-700 font-medium">{reflection.main_task}</p>
                    
                    <div className="flex mt-2 space-x-2 text-sm">
                      <span className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        <Gauge size={14} className="mr-1" />
                        Energy: {reflection.energy_level}/10
                      </span>
                      <span className="flex items-center bg-purple-50 text-purple-700 px-2 py-1 rounded">
                        <Brain size={14} className="mr-1" />
                        Focus: {reflection.focus_level}/10
                      </span>
                    </div>
                    
                    {reflection.reflection && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                        {reflection.reflection}
                      </p>
                    )}
                  </div>
                ))}
                
                {reflections.length > 5 && (
                  <div className="text-center pt-2">
                    <button className="text-blue-500 text-sm hover:text-blue-700">
                      View all reflections
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reflection;