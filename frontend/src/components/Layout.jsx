import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Map, LogOut, CheckSquare } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('user_role') || 'citizen'; 

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Role-specific Sidebar Links
  const getNavLinks = () => {
    switch(role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard /> },
          { name: 'Users', path: '/admin/users', icon: <Users /> },
          { name: 'Records', path: '/admin/records', icon: <FileText /> },
          { name: 'GIS Map', path: '/admin/gis', icon: <Map /> }
        ];
      case 'verifier':
        return [
          { name: 'Overview', path: '/verifier/dashboard', icon: <LayoutDashboard /> },
          { name: 'Verification Queue', path: '/verifier/queue', icon: <CheckSquare /> },
          { name: 'GIS Map', path: '/verifier/gis', icon: <Map /> }
        ];
      case 'citizen':
        return [
          { name: 'My Dashboard', path: '/citizen/dashboard', icon: <LayoutDashboard /> },
          { name: 'Upload Record', path: '/citizen/upload', icon: <FileText /> },
        ];
      default: return [];
    }
  };

  // Dynamic Navbar Profile
  const getProfileDetails = () => {
    if (role === 'admin') return { name: 'System Admin', title: 'Administrator' };
    if (role === 'verifier') return { name: 'Verifier Officer', title: 'Revenue Dept' };
    return { name: 'Jayant Kumar', title: 'Citizen' };
  };

  const profile = getProfileDetails();

  return (
    <div className="flex h-screen bg-stone-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#3E2723] text-white flex flex-col">
        <div className="p-6 text-2xl font-bold tracking-wider border-b border-stone-700">Bhumi-AI</div>
        <nav className="flex-1 p-4 space-y-2">
          {getNavLinks().map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${location.pathname.includes(link.path) ? 'bg-amber-600' : 'hover:bg-stone-800'}`}
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* NAVBAR */}
        <header className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800 capitalize">{role} Portal</h2>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm font-bold text-stone-900">{profile.name}</p>
              <p className="text-xs text-stone-500">{profile.title}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-stone-400 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}