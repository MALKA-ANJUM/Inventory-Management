import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api', // ✅ Relative path - works everywhere
});

axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
