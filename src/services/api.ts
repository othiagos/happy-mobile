import axios from 'axios'

const api = axios.create({
    baseURL: 'http://192.168.2.10:3003/'
})

export default api