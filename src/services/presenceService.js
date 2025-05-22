import axios from 'axios';

// const API_URL = 'http://localhost:8080/api/presences';
// const API_URL = 'http://192.168.0.109:8080/api/presences';
const API_URL = 'http://192.168.1.70:8080/api/presences';

export const getAllPresences = () => axios.get(`${API_URL}/presences`);

export const getPresenceById = (id) => axios.get(`${API_URL}/presence/${id}`);

export const addPresence = (presence) => axios.post(`${API_URL}/presences`, presence);

export const deletePresence = (id) => axios.delete(`${API_URL}/presence/${id}`);
