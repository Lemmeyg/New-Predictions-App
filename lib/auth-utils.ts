import { GoogleAuthState } from "@/types/auth";

// Initialize auth state
export const initialAuthState: GoogleAuthState = {
  isAuthenticated: false,
  token: null,
  error: null,
};

// Constants for Google OAuth
export const GOOGLE_CONFIG = {
  CLIENT_ID: "830158656014-ac04mquj2eikjeof65g6940ko6s51ph1.apps.googleusercontent.com",
  API_KEY: 'AIzaSyDrhkwTeR-VmnwfMfnO0LVlB_nwEfddTgI',
  DISCOVERY_DOC: 'https://sheets.googleapis.com/$discovery/rest?version=v4',
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets',
};

// Helper to load Google API scripts
export function loadGoogleScripts(): Promise<void> {
  return new Promise((resolve) => {
    const loadGapi = document.createElement('script');
    loadGapi.src = 'https://apis.google.com/js/api.js';
    
    const loadGis = document.createElement('script');
    loadGis.src = 'https://accounts.google.com/gsi/client';

    loadGapi.onload = () => {
      loadGis.onload = () => {
        resolve();
      };
      document.body.appendChild(loadGis);
    };

    document.body.appendChild(loadGapi);
  });
}