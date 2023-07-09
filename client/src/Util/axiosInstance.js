import axios from 'axios';

const refreshToken= async(config)=>{
    axios.post(`${process.env.REACT_APP_SERVER_API}/auth/refresh`,{},{
        headers:{
            "Content-Type":"application/json"
        },
        withCredentials:true,
    })
    .then(response=>{
        console.log(config)
        axios(config)
    })
    .catch(error=>{
        console.log(error)
    })
}

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_API
});


axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log(error)
    if(error.response.status === 401){
      refreshToken(error.config)
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;