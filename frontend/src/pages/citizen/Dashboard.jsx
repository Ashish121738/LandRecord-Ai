import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, XCircle, UploadCloud } from 'lucide-react';

export default function CitizenDashboard() {
  const navigate = useNavigate();

  // 🚨 MOCK DATA: For Hackathon Demo
  const stats = { total: 5, verified: 3, pending: 1, rejected: 1 };
  
  const myRecords = [
    { id: 'LR-089', khasra: '420/1A', village: 'Palampur', district: 'Meerut', status: 'Verified', date: '2026-09-12' },
    { id: 'LR-090', khasra: '15/2', village: 'Sardhana', district: 'Meerut', status: 'Pending Verification', date: '2026-09-13' },
    { id: 'LR-091', khasra: '112 Min', village: 'Khera', district: 'Baghpat', status: 'Rejected', date: '2026-09-10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Welcome, Jayant Kumar</h1>
          <p className="text-stone-500 mt-1">Manage and track your digitized land records securely.</p>
        </div>
        <button 
          onClick={() => navigate('/citizen/upload')}
          className="flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md shadow-sm transition-colors"
        >
          <UploadCloud className="w-5 h-5 mr-2" /> Upload New Record
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-stone-200 rounded-lg shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-stone-100 text-stone-600 rounded-full"><FileText className="w-6 h-6" /></div>
          <div><p className="text-sm font-bold text-stone-500">Total Uploads</p><p className="text-2xl font-black text-stone-800">{stats.total}</p></div>
        </div>
        <div className="bg-white p-5 border border-stone-200 rounded-lg shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full"><CheckCircle2 className="w-6 h-6" /></div>
          <div><p className="text-sm font-bold text-stone-500">Verified</p><p className="text-2xl font-black text-stone-800">{stats.verified}</p></div>
        </div>
        <div className="bg-white p-5 border border-stone-200 rounded-lg shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-full"><Clock className="w-6 h-6" /></div>
          <div><p className="text-sm font-bold text-stone-500">Pending</p><p className="text-2xl font-black text-stone-800">{stats.pending}</p></div>
        </div>
        <div className="bg-white p-5 border border-stone-200 rounded-lg shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-full"><XCircle className="w-6 h-6" /></div>
          <div><p className="text-sm font-bold text-stone-500">Rejected</p><p className="text-2xl font-black text-stone-800">{stats.rejected}</p></div>
        </div>
      </div>

      {/* RECENT RECORDS TABLE */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
          <h3 className="font-bold text-stone-800">My Recent Records</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="text-stone-500 uppercase text-xs font-bold bg-white border-b border-stone-100">
            <tr>
              <th className="px-6 py-3">Record ID</th>
              <th className="px-6 py-3">Khasra No.</th>
              <th className="px-6 py-3">Village / District</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {myRecords.map((rec) => (
              <tr key={rec.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 font-mono font-medium text-stone-900">{rec.id}</td>
                <td className="px-6 py-4 font-bold text-stone-700">{rec.khasra}</td>
                <td className="px-6 py-4">{rec.village} <span className="text-stone-400 block text-xs">{rec.district}</span></td>
                <td className="px-6 py-4 text-stone-500">{rec.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    rec.status === 'Verified' ? 'bg-green-100 text-green-800' :
                    rec.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rec.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-green-600 font-bold hover:text-green-800 text-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}