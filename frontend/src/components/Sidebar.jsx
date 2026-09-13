import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Map, CheckSquare } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const role = localStorage.getItem('user_role') || 'citizen';

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

  return (
    <div className="w-64 bg-[#3E2723] text-white flex flex-col h-full min-h-screen">
      <div className="p-6 text-2xl font-bold tracking-wider border-b border-stone-700">Bhumi-AI</div>
      <nav className="flex-1 p-4 space-y-2">
        {getNavLinks().map((link) => (
          <Link 
            key={link.name} 
            to={link.path}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${location.pathname.includes(link.path) ? 'bg-amber-600 text-white font-bold' : 'hover:bg-stone-800 text-stone-300'}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}