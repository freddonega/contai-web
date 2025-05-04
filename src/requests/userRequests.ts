import { api } from "@/api";
import { User, CreateUser, LoginData, LoginResponse } from "@/types/user";

export const createUser = async (newUser: CreateUser): Promise<User> => {
  try {
    const response = await api.post("/users", newUser);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const loginUser = async (
  loginData: LoginData
): Promise<LoginResponse> => {
  try {
    const response = await api.post("/login", loginData);
    return {
      token: response.data.token,
      user: response.data.user,
    };
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};
