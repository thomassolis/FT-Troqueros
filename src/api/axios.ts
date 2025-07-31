import axios from "axios";

const instance = axios.create({
    baseURL: 'https://localhost:5001/api',
    // baseURL: 'https://netserpro.com:4583/api',
    withCredentials: true
})

export default instance;