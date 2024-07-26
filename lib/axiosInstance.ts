import axios from "axios";

const SEVER_DOMAIN = process.env.NEXT_SERVER_DOMAIN;

const BASE_API_URL = `${SEVER_DOMAIN}/api`;

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
});

export default api;
