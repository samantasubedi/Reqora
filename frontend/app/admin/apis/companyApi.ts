import axios from "axios"
import { backendUrl } from "./resourceApi"

export const getAnalyticsApi=async()=>{
    const response= await axios.get(`${backendUrl}/analytics`,{withCredentials:true})
    return response.data
}