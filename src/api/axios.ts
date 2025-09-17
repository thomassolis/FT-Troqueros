import axios from "axios";

const instance = axios.create({
    baseURL: 'https://localhost:5001/api',
    // baseURL: 'https://netserpro.com:3880/api',
    withCredentials: true
})

export default instance;