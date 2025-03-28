import axios from 'axios';

const API_URL = '/api/auth';

const getToken = () => localStorage.getItem('token');

const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

authAxios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const checkAuth = async () => {
  try {
    const { data } = await authAxios.get('/is-authenticated');
    return data;
  } catch {
    return { isAuthenticated: false };
  }
};


export const login = async (form) => {
  const { username, password } = form;
  const { data } = await authAxios.post('/login', { username, password });
  
  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
};


export const signup = async (form) => {
  const { data } = await authAxios.post('/signup', form);
  return data;
};


export const logout = async () => {
  localStorage.removeItem('token');
  const { data } = await authAxios.post('/logout');
  return data;
};