import axios from 'axios'
export function request(config) {
  const instance = axios.create({
  baseURL: 'http://123.207.32.32:8000/api/h8',
  timeout: 5000
  })
  //拦截器的使用 请求拦截成功、失败，回复成功、失败四个
  instance.interceptors.request.use(config => {
    // console.log(config);
    return config
    },err => {
      console.log(err);
    })
    instance.interceptors.response.use(res => {
      // console.log(res);
      return res
      
    },err => {
      console.log(err);
      
    })
  return instance(config)
}