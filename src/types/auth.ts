export interface User {
    id: string;
    email: string;
    name?: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface LoginCredentials {
    email: string;
    password?: string; // Adjust based on your strategy
  }
  
  export interface RegisterCredentials {
    name: string;
    email: string;
    password?: string;
  }