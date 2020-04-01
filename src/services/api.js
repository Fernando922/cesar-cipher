import axios from 'axios'

export const token = '6e00b785a118063178ee6e72e234f1eb44040c63'

const api = axios.create({
  baseURL: 'https://api.codenation.dev/v1/challenge/dev-ps'
})

export default api