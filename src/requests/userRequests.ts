import { api } from "@/api";
import { User, CreateUser, LoginData, LoginResponse } from "@/types/user";

export const createUser = async (newUser: CreateUser): Promise<User> => {
  const response = await api.post("/users", newUser);
  return response.data;
};

export const loginUser = async (
  loginData: LoginData
): Promise<LoginResponse> => {
  const response = await api.post("/login", loginData);
  return {
    token: response.data.token,
    user: response.data.user,
  };
};
