import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertTriangle, Filter, CheckCircle2, Clock } from 'lucide-react';

export default function VerificationQueue() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // 🚨 MOCK DATA: Isolate this for the frontend demo
  const pendingRecords = [
    { id: 'LR-001', khasra: '420/1A', village: 'Palampur', district: 'Meerut', issue: 'Area Mismatch', confidence: 68, date: '2026-09-13' },
    { id: 'LR-002', khasra: '389', village: 'Patera', district: 'Meerut', issue: 'Owner Conflict', confidence: 72, date: '2026-09-13' },
    { id: 'LR-003', khasra: '102', village: 'Rohtak', district: 'Baghpat', issue: 'Low OCR Confidence', confidence: 45, date: '2026-09-12' },
    { id: 'LR-004', khasra: '56 Min', village: 'Sardhana', district: 'Meerut', issue: 'New Record Candidate', confidence: 88, date: '2026-09-12' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* HEADER & STATS */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-800 tracking-tight">Verification Queue</h1>
          <p className="text-stone-500 mt-1">Human-in-the-loop review for flagged anomalies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 border border-stone-200 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3 text-amber-600 mb-2"><Clock className="w-5 h-5" /><h3 className="font-bold">Pending Review</h3></div>
          <p className="text-3xl font-black text-stone-800">18</p>
        </div>
        <div className="bg-white p-4 border border-stone-200 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3 text-red-600 mb-2"><AlertTriangle className="w-5 h-5" /><h3 className="font-bold">Owner Conflicts</h3></div>
          <p className="text-3xl font-black text-stone-800">4</p>
        </div>
        <div className="bg-white p-4 border border-stone-200 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3 text-orange-600 mb-2"><AlertTriangle className="w-5 h-5" /><h3 className="font-bold">Area Mismatches</h3></div>
          <p className="text-3xl font-black text-stone-800">7</p>
        </div>
        <div className="bg-white p-4 border border-stone-200 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3 text-green-600 mb-2"><CheckCircle2 className="w-5 h-5" /><h3 className="font-bold">Verified Today</h3></div>
          <p className="text-3xl font-black text-stone-800">42</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 border border-stone-200 rounded-lg shadow-sm gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-stone-400" />
          <input 
            type="text" 
            placeholder="Search by Khasra or Village..." 
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-2 text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md font-medium transition-colors w-full sm:w-auto">
          <Filter className="w-4 h-4 mr-2" /> Filter Queue
        </button>
      </div>

      {/* QUEUE TABLE */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-stone-600 uppercase text-xs font-bold border-b border-stone-200">
            <tr>
              <th className="px-6 py-4">Record ID</th>
              <th className="px-6 py-4">Khasra / Gata</th>
              <th className="px-6 py-4">Village</th>
              <th className="px-6 py-4">AI Flag Issue</th>
              <th className="px-6 py-4">Confidence</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {pendingRecords.map((record) => (
              <tr key={record.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 font-mono font-medium text-stone-900">{record.id}</td>
                <td className="px-6 py-4 font-bold text-stone-700">{record.khasra}</td>
                <td className="px-6 py-4 text-stone-600">{record.village} <span className="text-xs text-stone-400 block">{record.district}</span></td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    record.issue.includes('Conflict') ? 'bg-red-100 text-red-800' : 
                    record.issue.includes('Mismatch') ? 'bg-orange-100 text-orange-800' : 
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {record.issue}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${record.confidence > 80 ? 'bg-green-500' : record.confidence > 60 ? 'bg-amber-500' : 'bg-red-500'}`} 
                        style={{ width: `${record.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-stone-500">{record.confidence}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => navigate(`/verifier/record/${record.id}`)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md shadow-sm transition-colors text-xs"
                  >
                    Review
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