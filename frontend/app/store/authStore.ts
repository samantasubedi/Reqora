import { create } from "zustand";
enum role {
  admin,
  manager,
  employee,
  unauthorized,
}

export type userDataType = {
  role: role;
  username: string;
};
export type storeType = {
  user: { role: role; username: string };
  setUserData: ({ username, role }: userDataType) => void;
};
export const useGlobalStore = create<storeType>((set) => ({
  user: { role: role.unauthorized, username: "" },
  setUserData: ({ username, role }: userDataType) =>
    set(() => ({ user: { username: username, role: role } })),
}));
