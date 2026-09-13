import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, X, CheckCircle2, Loader2, FileText, Scan, Activity, ArrowRight } from 'lucide-react';

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Pipeline states: 'idle', 'uploading', 'ocr', 'extraction', 'validation', 'done'
  const [step, setStep] = useState('idle');

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startPipeline = () => {
    setIsProcessing(true);
    setStep('uploading');
    
    // Simulating the AI processing delay for the Hackathon Demo
    setTimeout(() => setStep('ocr'), 1500);
    setTimeout(() => setStep('extraction'), 3500);
    setTimeout(() => setStep('validation'), 5500);
    setTimeout(() => {
      setStep('done');
      setIsProcessing(false);
    }, 7000);
  };

  const PipelineStep = ({ currentStep, activeStep, title, icon }) => {
    const isCompleted = ['uploading', 'ocr', 'extraction', 'validation', 'done'].indexOf(currentStep) > ['uploading', 'ocr', 'extraction', 'validation', 'done'].indexOf(activeStep);
    const isActive = currentStep === activeStep;

    return (
      <div className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${isActive ? 'border-green-500 bg-green-50 scale-105' : isCompleted ? 'border-green-200 bg-white opacity-60' : 'border-stone-100 bg-stone-50 opacity-40'}`}>
        <div className={`mb-2 ${isActive ? 'text-green-600' : isCompleted ? 'text-green-500' : 'text-stone-400'}`}>
          {isActive ? <Loader2 className="w-8 h-8 animate-spin" /> : isCompleted ? <CheckCircle2 className="w-8 h-8" /> : icon}
        </div>
        <span className={`text-xs font-bold text-center ${isActive ? 'text-green-800' : 'text-stone-500'}`}>{title}</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
        <h1 className="text-2xl font-bold text-stone-800">Digitize New Land Record</h1>
        <p className="text-stone-500 mt-1">Upload your Khasra or Khatauni (PDF, JPG, PNG) for AI verification.</p>
      </div>

      {/* DRAG & DROP ZONE */}
      {!isProcessing && step === 'idle' && (
        <div 
          className="border-2 border-dashed border-stone-300 rounded-xl bg-white p-12 flex flex-col items-center justify-center text-center hover:bg-stone-50 hover:border-green-500 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <input id="file-upload" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
          
          {file ? (
            <div className="flex flex-col items-center">
              <File className="w-16 h-16 text-green-500 mb-4" />
              <p className="text-lg font-bold text-stone-800">{file.name}</p>
              <p className="text-sm text-stone-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-4 flex items-center text-red-500 hover:text-red-700 font-bold text-sm">
                <X className="w-4 h-4 mr-1" /> Remove File
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center pointer-events-none">
              <UploadCloud className="w-16 h-16 text-stone-400 mb-4" />
              <p className="text-lg font-bold text-stone-700">Click to upload or drag and drop</p>
              <p className="text-sm text-stone-500 mt-2">Supports PDF, JPG, PNG (Max 5MB)</p>
            </div>
          )}
        </div>
      )}

      {/* SUBMIT BUTTON */}
      {file && step === 'idle' && (
        <div className="flex justify-end">
          <button onClick={startPipeline} className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-colors text-lg flex items-center">
            Start AI Digitization <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}

      {/* THE AI PIPELINE UI */}
      {step !== 'idle' && (
        <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-lg">
          <h2 className="text-xl font-bold text-stone-800 mb-8 text-center">
            {step === 'done' ? 'Processing Complete!' : 'AI Engine is digitizing your document...'}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <PipelineStep currentStep="uploading" activeStep={step} title="1. Secure Upload" icon={<UploadCloud className="w-8 h-8" />} />
            <PipelineStep currentStep="ocr" activeStep={step} title="2. PaddleOCR Scan" icon={<Scan className="w-8 h-8" />} />
            <PipelineStep currentStep="extraction" activeStep={step} title="3. NLP Extraction" icon={<FileText className="w-8 h-8" />} />
            <PipelineStep currentStep="validation" activeStep={step} title="4. GIS & Rule Validation" icon={<Activity className="w-8 h-8" />} />
          </div>

          {step === 'done' && (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg text-center">
              <CheckCircle2 className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-amber-900">Forwarded to Verification Queue</h3>
              <p className="text-amber-700 mt-2">Your document has been digitized but requires a Revenue Officer's final approval due to a minor area mismatch.</p>
              <button onClick={() => navigate('/citizen/dashboard')} className="mt-6 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md shadow-sm transition-colors">
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}