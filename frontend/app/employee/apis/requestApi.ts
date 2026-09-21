import axios, { AxiosResponse } from "axios";

export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const createRequestApi = async ({
  resourceId,
  requestedQuantity,
}: {
  resourceId: string;
  requestedQuantity: number;
}) => {
  const response: AxiosResponse<{
    success: boolean;
    message: string;
  }> = await axios.post(
    `${backendUrl}/requests`,
    { resourceId, requestedQuantity },
    { withCredentials: true },
  );
  return response.data;
};