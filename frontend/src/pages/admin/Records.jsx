import React, { useState } from 'react';
import { Search, Filter, FileText, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

export default function AdminRecords() {
  const [searchTerm, setSearchTerm] = useState('');

  // 🚨 MOCK DATA: Global System Records
  const globalRecords = [
    { id: 'LR-001', owner: 'Ramesh Kumar', khasra: '420/1A', district: 'Meerut', status: 'Pending Review', date: '2026-09-13' },
    { id: 'LR-089', owner: 'Smt. Sunita', khasra: '112 Min', district: 'Meerut', status: 'Verified', date: '2026-09-12' },
    { id: 'LR-090', owner: 'Rajesh Singh', khasra: '15/2', district: 'Baghpat', status: 'Rejected', date: '2026-09-12' },
    { id: 'LR-091', owner: 'Amit Yadav', khasra: '78', district: 'Ghaziabad', status: 'Verified', date: '2026-09-11' },
    { id: 'LR-092', owner: 'Priya Sharma', khasra: '34/1', district: 'Hapur', status: 'AI Processing', date: '2026-09-13' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-800 tracking-tight">Master Records Database</h1>
          <p className="text-stone-500 mt-1">System-wide search and audit of all digitized Khasra and Khatauni documents.</p>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50 gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search by Record ID, Owner, Khasra, or District..." 
              className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 text-stone-600 bg-white border border-stone-300 hover:bg-stone-100 rounded-md font-bold transition-colors text-sm">
            <Filter className="w-4 h-4 mr-2" /> Advanced Filter
          </button>
        </div>

        {/* Master Table */}
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-stone-600 uppercase text-xs font-bold border-b border-stone-200">
            <tr>
              <th className="px-6 py-4">Record ID</th>
              <th className="px-6 py-4">Registered Owner</th>
              <th className="px-6 py-4">Khasra & District</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4 text-right">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {globalRecords.map((rec) => (
              <tr key={rec.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-stone-800">{rec.id}</td>
                <td className="px-6 py-4 font-semibold text-stone-700">{rec.owner}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-stone-800">{rec.khasra}</div>
                  <div className="text-xs text-stone-500">{rec.district}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                    rec.status === 'Verified' ? 'bg-green-50 text-green-700 border-green-200' :
                    rec.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                    rec.status === 'Pending Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {rec.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-stone-500 text-xs font-medium">{rec.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-stone-400 hover:text-stone-800 transition-colors" title="View Audit Log">
                    <Eye className="w-5 h-5 ml-auto" />
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