import axios from "axios";
import { API_URL } from "../config";

export const register = async (payload) => {
  try {
    const { data } = await axios.post(`${API_URL}/users/register`, payload);
    return data;
  } catch (error) {
    return error.response.data;
  }
};
export const login = async (payload) => {
  try {
    const { data } = await axios.post(`${API_URL}/users/login`, payload);
    return data;
  } catch (error) {
    return error.response.data;
  }
};
export const createGame = async (payload, token) => {
  try {
    const { data } = await axios.post(`${API_URL}/games`, payload, {
      headers: { authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};
export const updateGame = async (gameId, payload, token) => {
  try {
    const { data } = await axios.patch(`${API_URL}/games/${gameId}`, payload, {
      headers: { authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};
export const myGames = async (token) => {
  try {
    const { data } = await axios.get(`${API_URL}/games`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};
export const getGame = async (gameId, token) => {
  try {
    const { data } = await axios.get(`${API_URL}/games/${gameId}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};
