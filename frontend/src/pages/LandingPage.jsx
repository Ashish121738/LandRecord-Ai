import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, FileText, Map, Activity } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50 font-sans flex flex-col overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="bg-white border-b border-stone-200 px-8 py-4 flex justify-between items-center z-10 relative">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-8 h-8 text-amber-600" />
          <div>
            <h1 className="text-xl font-bold text-stone-900 tracking-wide">Bhumi-AI</h1>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Smart India Hackathon 2026</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-stone-900 text-white font-bold text-sm rounded-md hover:bg-stone-800 transition-colors shadow-sm"
        >
          Enter Portal
        </button>
      </nav>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6 z-10">
        
        {/* Background Visuals */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[600px] pointer-events-none opacity-40">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="absolute top-0 left-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-[80px]"></motion.div>
          <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }} className="absolute bottom-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-[80px]"></motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl w-full text-center relative z-10 space-y-8"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold border border-amber-200 mb-4">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            <span>Live Prototype Phase</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-stone-900 tracking-tight leading-tight">
            Intelligent Land Record <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-green-600">Digitization System</span>
          </h2>
          
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto font-medium">
            Bridging the gap between legacy paper records and modern digital infrastructure using AI OCR, Spatial GIS mapping, and Human-in-the-loop verification.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="group px-8 py-4 bg-amber-600 text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 transition-all flex items-center text-lg w-full sm:w-auto justify-center"
            >
              Access System <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-stone-700 font-bold border-2 border-stone-200 rounded-lg shadow-sm hover:border-stone-400 hover:bg-stone-50 transition-all text-lg w-full sm:w-auto justify-center"
            >
              Citizen Portal
            </button>
          </div>
        </motion.div>

        {/* FEATURE CARDS */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-24 relative z-10 pb-12"
        >
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-start text-left">
            <div className="p-3 bg-stone-100 rounded-lg mb-4 text-stone-700"><FileText className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">High-Fidelity OCR</h3>
            <p className="text-sm text-stone-500">Extracts complex multilingual Khasra and Khatauni data accurately.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-start text-left">
            <div className="p-3 bg-amber-100 rounded-lg mb-4 text-amber-700"><Activity className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">HITL Workflow</h3>
            <p className="text-sm text-stone-500">Robust queue system for Revenue Officers to resolve AI discrepancies.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-start text-left">
            <div className="p-3 bg-green-100 rounded-lg mb-4 text-green-700"><Map className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">Cadastral GIS</h3>
            <p className="text-sm text-stone-500">Visual validation of plot boundaries mapping text to spatial data.</p>
          </div>
        </motion.div>
        
      </main>
    </div>
  );
}