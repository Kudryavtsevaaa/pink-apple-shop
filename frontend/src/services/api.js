import axios from 'axios';

// Вставь свою ссылку из терминала сюда:
const API_URL = "https://slick-bobcats-drop.loca.lt"; 

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});