import React from 'react';
import { Users, FileText, AlertTriangle, CheckCircle2, Activity, Database, ServerCrash } from 'lucide-react';

export default function AdminDashboard() {
  // 🚨 MOCK DATA: System-wide telemetry for Hackathon Demo
  const stats = { total: 12450, verified: 8930, pending: 2150, conflicts: 1370 };
  
  const districtData = [
    { name: 'Meerut', processed: 85 },
    { name: 'Baghpat', processed: 62 },
    { name: 'Ghaziabad', processed: 92 },
    { name: 'Hapur', processed: 45 },
    { name: 'Bulandshahr', processed: 78 }
  ];

  const recentLogs = [
    { id: 'LOG-0991', user: 'Ashish K. (Verifier)', action: 'Resolved Area Mismatch', target: 'LR-001', time: '2 mins ago', status: 'success' },
    { id: 'LOG-0990', user: 'System AI', action: 'Flagged Low Confidence (45%)', target: 'LR-003', time: '15 mins ago', status: 'warning' },
    { id: 'LOG-0989', user: 'Jayant K. (Citizen)', action: 'Uploaded New Khasra', target: 'LR-089', time: '1 hr ago', status: 'info' },
    { id: 'LOG-0988', user: 'System Admin', action: 'Updated RBAC Policy', target: 'Global', time: '3 hrs ago', status: 'info' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-end bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-stone-800 tracking-tight">System Control Center</h1>
          <p className="text-stone-500 mt-1">Real-time pipeline telemetry and state-wide digitization metrics.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-md border border-green-200">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>System Healthy</span>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-stone-200 rounded-lg shadow-sm border-t-4 border-t-stone-800">
          <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-stone-500 text-sm">Total Ingested</h3><Database className="w-5 h-5 text-stone-400" /></div>
          <p className="text-3xl font-black text-stone-800">{stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 border border-stone-200 rounded-lg shadow-sm border-t-4 border-t-green-500">
          <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-stone-500 text-sm">Successfully Verified</h3><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
          <p className="text-3xl font-black text-stone-800">{stats.verified.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 border border-stone-200 rounded-lg shadow-sm border-t-4 border-t-amber-500">
          <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-stone-500 text-sm">Pending HITL Queue</h3><FileText className="w-5 h-5 text-amber-500" /></div>
          <p className="text-3xl font-black text-stone-800">{stats.pending.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 border border-stone-200 rounded-lg shadow-sm border-t-4 border-t-red-500">
          <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-stone-500 text-sm">Owner/Area Conflicts</h3><AlertTriangle className="w-5 h-5 text-red-500" /></div>
          <p className="text-3xl font-black text-stone-800">{stats.conflicts.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* DISTRICT THROUGHPUT (CSS BARS) */}
        <div className="bg-white p-6 border border-stone-200 rounded-lg shadow-sm lg:col-span-2">
          <h3 className="font-bold text-stone-800 mb-6">AI Processing Throughput by District</h3>
          <div className="space-y-5">
            {districtData.map((dist, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm font-bold text-stone-600 mb-1">
                  <span>{dist.name}</span>
                  <span>{dist.processed}%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-amber-500 h-3 rounded-full" style={{ width: `${dist.processed}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LIVE SYSTEM AUDIT LOG */}
        <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
            <h3 className="font-bold text-stone-800 text-sm">Live System Audit</h3>
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Real-time</span>
          </div>
          <div className="p-0 overflow-y-auto max-h-[300px]">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-4 border-b border-stone-100 hover:bg-stone-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-stone-800">{log.user}</span>
                  <span className="text-[10px] text-stone-400 font-medium">{log.time}</span>
                </div>
                <p className="text-xs text-stone-600 font-medium">{log.action}</p>
                <div className="mt-2 text-[10px] font-mono text-stone-400">Target: {log.target}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}