// src/components/Sidebar.tsx
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-indigo-900 text-white h-screen fixed top-0 left-0 flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold border-b border-indigo-800">
        Guiding Stars
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`
          }
        >
          <span className="ml-3">Dashboard</span>
        </NavLink>

        <NavLink
          to="/mentors"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`
          }
        >
          <span className="ml-3">Mentors</span>
        </NavLink>

        <NavLink
          to="/mentees"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`
          }
        >
          <span className="ml-3">Mentees</span>
        </NavLink>

        <NavLink
          to="/matches"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`
          }
        >
          <span className="ml-3">Matches</span>
        </NavLink>

        <NavLink
          to="/progress"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`
          }
        >
          <span className="ml-3">Progress Tracking</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;