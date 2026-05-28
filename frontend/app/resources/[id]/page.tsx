import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";

type propType = {
  params: Promise<{
    id: string;
  }>;
};
const ResourceDetails = async ({ params }: propType) => {
  console.log(params);
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const fetchApi = async () => {
    const response = await axios.post(`${backendUrl}/resource/${id}`);
    return response.data;
  };
  const query = useQuery({
    queryKey: ["resourceDetail"],
    queryFn: fetchApi,
  });
  useEffect(()=>{
    if(query.error){
      if(isAxiosError(query.error))
    {  toast.error(query.error.response?.data.message)}
      else{
        toast.error(query.error.message)
      }
    }
  },[query.error])

  return <div>this is resource details page</div>;
};

export default ResourceDetails;
