import { AxiosError } from "axios";

type T_BackendRespose = {
  message: string;
  code: string;
  success: boolean;
  error: {};
};

export type T_MutaionError = AxiosError<T_BackendRespose>;
