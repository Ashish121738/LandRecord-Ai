import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Maximize, AlertTriangle, CheckCircle2, Save, XCircle, FileText } from 'lucide-react';

export default function RecordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🚨 MOCK DATA: Isolated for a flawless frontend demo
  const [record, setRecord] = useState({
    id: id || 'LR-001',
    ownerName: 'Ramesh Kumar',
    ownerNameHindi: 'रमेश कुमार',
    khasraNumber: '420/1A',
    khataNumber: '00112',
    area: '1.250',
    village: 'Palampur',
    district: 'Meerut',
    landType: 'Krishi (Agricultural)',
    confidence: 68,
    issue: 'Area Mismatch detected between AI and historical data.'
  });

  const handleFieldChange = (field, value) => {
    setRecord({ ...record, [field]: value });
  };

  const handleAction = (actionType) => {
    // In a real app, this hits your FastAPI backend
    alert(`${actionType} action recorded for ${record.id}! Returning to queue.`);
    navigate('/verifier/queue');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -m-8">
      {/* TOP HEADER */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/verifier/queue')} className="p-2 text-stone-400 hover:text-stone-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-stone-800">Verification Review: <span className="font-mono text-amber-600">{record.id}</span></h2>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Human-in-the-Loop Override Pipeline</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => handleAction('Rejected')} className="flex items-center px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-md transition-colors border border-red-200 text-sm">
            <XCircle className="w-4 h-4 mr-2" /> Reject Record
          </button>
          <button onClick={() => handleAction('Corrections Saved')} className="flex items-center px-4 py-2 bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold rounded-md transition-colors border border-amber-300 text-sm">
            <Save className="w-4 h-4 mr-2" /> Save Corrections
          </button>
          <button onClick={() => handleAction('Approved & Verified')} className="flex items-center px-5 py-2 bg-green-600 text-white hover:bg-green-700 font-bold rounded-md transition-colors shadow-sm text-sm">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Approve & Save
          </button>
        </div>
      </div>

      {/* SPLIT PANE WORKSPACE */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT PANE: DOCUMENT VIEWER */}
        <div className="w-1/2 bg-stone-100 border-r border-stone-200 flex flex-col">
          <div className="bg-stone-200 px-4 py-2 flex justify-between items-center text-xs font-bold text-stone-600 uppercase border-b border-stone-300">
            <div className="flex items-center"><FileText className="w-4 h-4 mr-2" /> Original Uploaded Document</div>
            <div className="flex space-x-2">
              <button className="p-1 hover:bg-stone-300 rounded"><ZoomOut className="w-4 h-4" /></button>
              <button className="p-1 hover:bg-stone-300 rounded"><ZoomIn className="w-4 h-4" /></button>
              <button className="p-1 hover:bg-stone-300 rounded"><Maximize className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-auto flex justify-center items-start">
            {/* Fake Document Mockup */}
            <div className="bg-white w-full max-w-lg min-h-[800px] shadow-lg border border-stone-300 p-8 flex flex-col font-serif relative">
              <div className="absolute inset-0 bg-yellow-500/5 mix-blend-multiply pointer-events-none"></div> {/* Old paper effect */}
              <div className="border-b-2 border-stone-800 pb-4 mb-6 text-center">
                <h3 className="text-2xl font-bold">खसरा (Khasra) / अधिकार अभिलेख</h3>
                <p className="text-sm">उत्तर प्रदेश सरकार (Govt. Prototype)</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm leading-relaxed text-stone-700">
                <p><strong>ग्राम:</strong> {record.village}</p>
                <p><strong>परगना/तहसील:</strong> {record.district}</p>
                <p><strong>खाता संख्या:</strong> {record.khataNumber}</p>
                <p><strong>खसरा संख्या:</strong> {record.khasraNumber}</p>
              </div>
              <div className="mt-8 border border-stone-400 p-4 min-h-[200px]">
                <p className="font-bold mb-2">खातेदार का नाम:</p>
                <p className="text-xl">{record.ownerNameHindi}</p>
                <p className="mt-4 font-bold">क्षेत्रफल (हेक्टेयर):</p>
                <p className="text-lg bg-yellow-200 inline-block px-1">{record.area}</p> {/* Highlighted to simulate the mismatch */}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: AI EXTRACTION & FORM */}
        <div className="w-1/2 bg-white flex flex-col overflow-y-auto">
          
          {/* AI Confidence Banner */}
          <div className="bg-amber-50 border-b border-amber-200 p-4 flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-800 text-sm">Human Verification Required</h3>
              <p className="text-xs text-amber-700 mt-1">{record.issue}</p>
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-xs font-bold text-stone-500">AI Confidence:</span>
                <div className="w-32 h-2 bg-amber-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${record.confidence}%` }}></div>
                </div>
                <span className="text-xs font-bold text-amber-700">{record.confidence}%</span>
              </div>
            </div>
          </div>

          {/* EDIT FORM */}
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-800 border-b border-stone-200 pb-2 mb-4">Extracted Data Properties</h3>
              
              <div className="grid grid-cols-2 gap-6">
                
                {/* Field */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Owner Name (English)</label>
                  <input type="text" value={record.ownerName} onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 outline-none text-stone-800 font-medium" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Owner Name (Hindi)</label>
                  <input type="text" value={record.ownerNameHindi} onChange={(e) => handleFieldChange('ownerNameHindi', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 outline-none text-stone-800 font-medium" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Khasra Number</label>
                  <input type="text" value={record.khasraNumber} onChange={(e) => handleFieldChange('khasraNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 outline-none text-stone-800 font-medium font-mono" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Khata Number</label>
                  <input type="text" value={record.khataNumber} onChange={(e) => handleFieldChange('khataNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 outline-none text-stone-800 font-medium font-mono" />
                </div>

                {/* Highlighted Error Field */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-red-600 uppercase tracking-wide mb-2 flex items-center">
                    Total Area (Hectares) <AlertTriangle className="w-3 h-3 ml-1" />
                  </label>
                  <input type="text" value={record.area} onChange={(e) => handleFieldChange('area', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-red-300 bg-red-50 rounded-md focus:ring-2 focus:ring-red-500 outline-none text-red-900 font-bold font-mono" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Land Type</label>
                  <select value={record.landType} onChange={(e) => handleFieldChange('landType', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 outline-none text-stone-800 font-medium">
                    <option>Krishi (Agricultural)</option>
                    <option>Abadi (Residential)</option>
                    <option>Banjar (Barren)</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Village</label>
                  <input type="text" value={record.village} onChange={(e) => handleFieldChange('village', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 outline-none text-stone-800 font-medium" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">District</label>
                  <input type="text" value={record.district} onChange={(e) => handleFieldChange('district', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 outline-none text-stone-800 font-medium" />
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}