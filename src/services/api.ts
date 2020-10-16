import axios from 'axios'

const api = axios.create({
    baseURL: 'http://IP_SERVER_ADDRESS:3003/'
})

export default api