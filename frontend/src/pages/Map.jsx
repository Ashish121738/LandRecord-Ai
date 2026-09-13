import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon, Layers, Search, AlertTriangle, CheckCircle2, Crosshair, FileText, Info } from 'lucide-react';

export default function Map() {
  // Default Center of our mock map (Meerut region)
  const mapCenter = [28.9845, 77.7060];

  // 🚨 MOCK DATA: Dual Georeferenced parcels to demonstrate AI Flagging vs Verified
  const mockParcels = [
    {
      id: 'LR-001',
      khasra: '125/2',
      owner: 'Ramesh Kumar',
      village: 'Palampur',
      district: 'Meerut',
      area: '2.50 Acres',
      status: 'Conflict Detected', // Shows judges that AI caught an error
      coordinates: [
        [28.9850, 77.7060],
        [28.9855, 77.7062],
        [28.9852, 77.7070],
        [28.9848, 77.7068],
      ],
      color: '#ef4444' // Tailwind Red-500
    },
    {
      id: 'LR-089',
      khasra: '112 Min',
      owner: 'Smt. Sunita',
      village: 'Palampur',
      district: 'Meerut',
      area: '1.85 Acres',
      status: 'Verified', // Safe record
      coordinates: [
        [28.9840, 77.7050],
        [28.9845, 77.7052],
        [28.9842, 77.7060],
        [28.9838, 77.7058],
      ],
      color: '#22c55e' // Tailwind Green-500
    }
  ];

  const [activeKhasra, setActiveKhasra] = useState(null);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -m-8 font-sans bg-stone-100">
      
      {/* HEADER */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center shrink-0 z-10 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center">
            <MapIcon className="w-6 h-6 mr-2 text-amber-600" /> Cadastral GIS Visualization
          </h1>
          <p className="text-sm text-stone-500 mt-1">Spatial validation and boundary mapping for digitized records.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search Khasra or Village..." 
              className="pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 w-72 bg-stone-50 transition-all" 
            />
          </div>
          <button className="px-4 py-2 border border-stone-300 rounded-md bg-white text-sm font-bold text-stone-700 hover:bg-stone-50 flex items-center shadow-sm transition-colors">
            <Layers className="w-4 h-4 mr-2" /> Map Layers
          </button>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 overflow-hidden relative flex">
        
        {/* LEFT SIDE: MAP */}
        <div className="flex-1 relative z-0 bg-stone-200">
          <MapContainer center={mapCenter} zoom={17} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            {/* Standard OpenStreetMap Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render Multiple Parcels Dynamically */}
            {mockParcels.map((parcel) => (
              <Polygon 
                key={parcel.id}
                positions={parcel.coordinates} 
                pathOptions={{ 
                  color: parcel.color, 
                  fillColor: parcel.color, 
                  fillOpacity: activeKhasra?.id === parcel.id ? 0.7 : 0.4, 
                  weight: activeKhasra?.id === parcel.id ? 4 : 2 
                }}
                eventHandlers={{ click: () => setActiveKhasra(parcel) }}
              >
                <Tooltip sticky className="font-bold text-stone-800">
                  Khasra No: {parcel.khasra}
                </Tooltip>
              </Polygon>
            ))}
          </MapContainer>

          {/* Map Legend */}
          <div className="absolute bottom-6 right-6 z-[400] bg-white p-3 rounded-md shadow-lg border border-stone-200 text-xs font-bold text-stone-600 flex flex-col space-y-3">
            <div className="flex items-center"><span className="w-3 h-3 bg-green-500 mr-2 rounded-full border border-green-700"></span> Verified Boundary</div>
            <div className="flex items-center"><span className="w-3 h-3 bg-red-500 mr-2 rounded-full border border-red-700"></span> AI Conflict Detected</div>
          </div>
        </div>

        {/* RIGHT SIDE: DATA PANEL */}
        {activeKhasra ? (
          <div className="w-96 bg-white border-l border-stone-300 shadow-2xl z-10 flex flex-col transform transition-transform duration-300">
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center text-stone-700 font-bold uppercase tracking-wider text-xs">
              <div className="flex items-center"><Crosshair className="w-4 h-4 mr-2" /> Plot Data</div>
              <button onClick={() => setActiveKhasra(null)} className="text-stone-400 hover:text-stone-800 text-lg leading-none">&times;</button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              
              {/* Header Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black text-stone-800">{activeKhasra.khasra}</h2>
                  <p className="text-stone-500 font-medium">{activeKhasra.village}, {activeKhasra.district}</p>
                </div>
                <div className={`p-2 rounded-full ${activeKhasra.status === 'Verified' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {activeKhasra.status === 'Verified' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                </div>
              </div>

              {/* Grid Data */}
              <div className="space-y-4">
                <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Registered Owner</p>
                  <p className="text-lg font-bold text-stone-800">{activeKhasra.owner}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Total Area</p>
                    <p className="font-mono font-bold text-stone-800">{activeKhasra.area}</p>
                  </div>
                  <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Record ID</p>
                    <p className="font-mono font-bold text-stone-800">{activeKhasra.id}</p>
                  </div>
                </div>
                
                {/* Status Indicator */}
                <div>
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Verification Status</p>
                  <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-md border ${
                    activeKhasra.status === 'Verified' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {activeKhasra.status}
                  </span>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-start space-x-3 mt-4">
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-amber-800 leading-relaxed">
                    Geospatial boundaries are for visual reference. In case of legal disputes, the physically verified document supersedes this map.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-stone-200">
                <button className="w-full py-3 bg-stone-900 text-white text-sm font-bold rounded-lg hover:bg-stone-800 transition-colors flex justify-center items-center shadow-md">
                  <FileText className="w-4 h-4 mr-2" /> View OCR Extraction Data
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-96 bg-white border-l border-stone-300 shadow-xl z-10 flex flex-col items-center justify-center p-8 text-center text-stone-400">
            <MapIcon className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-stone-700">No Parcel Selected</h3>
            <p className="text-sm mt-2 text-stone-500">Click on any highlighted polygon on the map to inspect cadastral details.</p>
          </div>
        )}
      </div>
    </div>
  );
}