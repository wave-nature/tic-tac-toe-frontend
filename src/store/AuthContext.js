import { createContext } from "react";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: "",
  errorMessage: "",
  loginUser: () => {},
  registerUser: () => {},
  logout: () => {},
};

export const AuthContext = createContext(initialState);
