import { Role } from "@/types/global";
import { create } from "zustand";


export type userDataType = {
  role: Role;
  username: string;
};
export type storeType = {
  user: { role: Role; username: string };
  setUserData: ({ username, role }: userDataType) => void;
};
export const useGlobalStore = create<storeType>((set) => ({
  user: { role: Role.unauthorized, username: "" },
  setUserData: ({ username, role }: userDataType) =>
    set(() => ({ user: { username: username, role: role } })),
}));
