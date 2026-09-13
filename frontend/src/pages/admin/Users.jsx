import React from 'react';
import { Search, UserCog, Shield, ShieldCheck, User } from 'lucide-react';

export default function AdminUsers() {
  const users = [
    { id: 'USR-01', name: 'Ashish Kumar Jha', email: 'verifier@gov.in', role: 'Verifier', status: 'Active' },
    { id: 'USR-02', name: 'Jayant Kumar', email: 'jayant@gov.in', role: 'System Admin', status: 'Active' },
    { id: 'USR-03', name: 'Rohan Mahajan', email: 'rohan.m@citizen.in', role: 'Citizen', status: 'Active' },
    { id: 'USR-04', name: 'Aayush Tiwari', email: 'aayush.t@citizen.in', role: 'Citizen', status: 'Inactive' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-800 tracking-tight">Access Management</h1>
          <p className="text-stone-500 mt-1">Manage Role-Based Access Control (RBAC) across the portal.</p>
        </div>
        <button className="px-4 py-2 bg-stone-900 text-white text-sm font-bold rounded-md hover:bg-stone-800 transition-colors">
          + Add Internal User
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2 w-4 h-4 text-stone-400" />
            <input type="text" placeholder="Search users by name or email..." className="w-full pl-9 pr-3 py-1.5 text-sm border border-stone-300 rounded-md outline-none focus:border-amber-500" />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-stone-600 uppercase text-xs font-bold border-b border-stone-200">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role Designation</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-stone-800">{user.name}</div>
                  <div className="text-xs text-stone-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold border ${
                    user.role === 'System Admin' ? 'bg-stone-100 text-stone-800 border-stone-300' :
                    user.role === 'Verifier' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    'bg-green-50 text-green-800 border-green-200'
                  }`}>
                    {user.role === 'System Admin' && <Shield className="w-3 h-3 mr-1" />}
                    {user.role === 'Verifier' && <ShieldCheck className="w-3 h-3 mr-1" />}
                    {user.role === 'Citizen' && <User className="w-3 h-3 mr-1" />}
                    <span>{user.role}</span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center text-xs font-bold ${user.status === 'Active' ? 'text-green-600' : 'text-stone-400'}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${user.status === 'Active' ? 'bg-green-500' : 'bg-stone-300'}`}></span>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-stone-400 hover:text-stone-800 transition-colors">
                    <UserCog className="w-5 h-5 ml-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}