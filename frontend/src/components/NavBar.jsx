import React from 'react';
import { NavLink } from 'react-router-dom';
import { CheckSquare, Gift, LineChart } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-blue-600 font-bold text-xl">ProductivityApp</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  isActive
                    ? "border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
              >
                <CheckSquare className="mr-1 h-5 w-5" />
                Tasks
              </NavLink>
              <NavLink
                to="/rewards"
                className={({ isActive }) =>
                  isActive
                    ? "border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
              >
                <Gift className="mr-1 h-5 w-5" />
                Rewards
              </NavLink>
              <NavLink
                to="/reflections"
                className={({ isActive }) =>
                  isActive
                    ? "border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                }
              >
                <LineChart className="mr-1 h-5 w-5" />
                Reflections
              </NavLink>
            </div>
          </div>
          <div className="ml-6 flex items-center">
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <span className="mr-1">🪙</span>
              <span id="user-coins">120</span> coins
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive
                ? "bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            }
          >
            <div className="flex items-center">
              <CheckSquare className="mr-2 h-5 w-5" />
              Tasks
            </div>
          </NavLink>
          <NavLink
            to="/rewards"
            className={({ isActive }) =>
              isActive
                ? "bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            }
          >
            <div className="flex items-center">
              <Gift className="mr-2 h-5 w-5" />
              Rewards
            </div>
          </NavLink>
          <NavLink
            to="/reflections"
            className={({ isActive }) =>
              isActive
                ? "bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            }
          >
            <div className="flex items-center">
              <LineChart className="mr-2 h-5 w-5" />
              Reflections
            </div>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;