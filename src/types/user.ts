export interface User {
  id: number;
  email: string;
  name: string;
}

export interface CreateUser {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
