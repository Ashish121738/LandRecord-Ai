import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Clock, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export default function VerifierDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-800 tracking-tight flex items-center">
            <ShieldCheck className="w-8 h-8 mr-3 text-amber-600" />
            Verifier Officer Workspace
          </h1>
          <p className="text-stone-500 mt-2 text-lg">You have <span className="font-bold text-amber-600">18 records</span> requiring human-in-the-loop verification today.</p>
        </div>
        <button 
          onClick={() => navigate('/verifier/queue')}
          className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg shadow-md transition-colors flex items-center"
        >
          Open Action Queue <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-stone-200 rounded-xl shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Clock className="w-6 h-6" /></div>
          <div>
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Pending Review</h3>
            <p className="text-4xl font-black text-stone-800 mt-1">18</p>
          </div>
        </div>
        
        <div className="bg-white p-6 border border-stone-200 rounded-xl shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckSquare className="w-6 h-6" /></div>
          <div>
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Verified Today</h3>
            <p className="text-4xl font-black text-stone-800 mt-1">42</p>
          </div>
        </div>

        <div className="bg-white p-6 border border-stone-200 rounded-xl shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-stone-100 text-stone-600 rounded-lg"><FileText className="w-6 h-6" /></div>
          <div>
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Total Lifetime Processed</h3>
            <p className="text-4xl font-black text-stone-800 mt-1">1,204</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}