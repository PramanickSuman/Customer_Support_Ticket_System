import axios from 'axios';

const axiosInstance = axios.create({
<<<<<<< HEAD
  baseURL: 'http://localhost:5000/api',
=======
 baseURL: 'https://customer-support-ticket-system-vdf7.vercel.app/api',
>>>>>>> 1a0b91ca178443eafe558390c67cff90619adb66
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;