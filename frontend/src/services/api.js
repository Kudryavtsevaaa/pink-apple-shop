import axios from 'axios';

const API_BASE_URL = "https://slick-bobcats-drop.loca.lt";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;