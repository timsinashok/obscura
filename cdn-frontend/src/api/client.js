// src/api/client.js
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Update with your backend URL
  timeout: 30000,
})