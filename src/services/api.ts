import axios from 'axios';

export const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

axios.defaults.withCredentials = true;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
