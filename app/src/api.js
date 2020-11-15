import axios from 'axios';

export const ajaxInstance  = axios.create({
  baseURL: 'http://localhost:8080/api/',
})
