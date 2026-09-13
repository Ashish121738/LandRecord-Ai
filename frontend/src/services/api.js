// Change this to your actual FastAPI backend URL running on Aayush's machine
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// =========================================================================
// 🔴 REAL BACKEND ENDPOINTS (STRICT MODE)
// If the FastAPI backend is down, these WILL throw an error. No silent fallbacks.
// =========================================================================

export const uploadDocumentApi = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Backend Error: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("🚨 UPLOAD FAILED:", error.message);
    throw error; // Let the React component catch this and show a UI error
  }
};

export const extractDocumentApi = async (documentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/extract/${documentId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`OCR Engine Failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("🚨 OCR EXTRACTION FAILED:", error.message);
    throw error;
  }
};

export const getMyDocumentsApi = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/user/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch documents from database");
    return await response.json();
  } catch (error) {
    console.error("🚨 DB FETCH FAILED:", error.message);
    throw error;
  }
};


// =========================================================================
// 🟡 HACKATHON DEMO / MOCK ENDPOINTS
// Use these ONLY for screens where the backend logic isn't fully written yet.
// These are explicitly mocked so you know exactly what is real and what is fake.
// =========================================================================

export const apiService = {
  
  login: async (credentials) => {
    // Simulating network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ token: 'mock_jwt_token_123', role: credentials.role || 'citizen' });
      }, 500);
    });
  },

  getPendingVerifications: async () => {
    return Promise.resolve([
      { id: 'LR-001', khasra: '420/1A', village: 'Palampur', issue: 'Area Mismatch', confidence: 68 },
      { id: 'LR-002', khasra: '389', village: 'Patera', issue: 'Owner Conflict', confidence: 72 },
    ]);
  },

  getRecordById: async (id) => {
    return Promise.resolve({
      id: id,
      ownerName: 'Ramesh Kumar',
      khasraNumber: '125/2',
      area: '2.50',
      status: 'pending'
    });
  },

  updateRecord: async (id, updatedData) => {
    console.log(`Mocking DB update for ${id} with:`, updatedData);
    return Promise.resolve({ success: true, message: 'Record explicitly updated in SQLite' });
  },

  getDashboardStats: async () => {
    return Promise.resolve({
      total: 12450,
      verified: 8930,
      pending: 2150
    });
  }
};