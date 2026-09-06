import { AxiosError } from "axios";

type T_BackendRespose = {
  message: string;
  code: string;
  success: boolean;
};

export type T_MutationError = AxiosError<T_BackendRespose>;
export enum Role {
  "admin",
  "manager",
  "employee",
  "unauthorized"
}
