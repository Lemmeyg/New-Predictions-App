export interface GoogleAuthState {
    isAuthenticated: boolean;
    token: string | null;
    error: string | null;
  }