// import {create} from "zustand"
// export type tokenType = {
//   accessToken: string;
//   decodedToken: {
//     username: string;
//     role: string;
//   };
// };

// export  type globalStateType = {
//   accessToken: string;
//   decodedToken: {
//     username: string;
//     role: string;
//   };
//   setAccessToken: ({ accessToken, decodedToken }: tokenType) => void;
// };

// export const globalState = create<globalStateType>((set) => ({
//   accessToken: "",
//   decodedToken: {
//     username: "",
//     role: "",
//   },
//   setAccessToken: ({ accessToken, decodedToken }: tokenType) =>
//     set((state) => ({ accessToken: accessToken, decodedToken: decodedToken })),
// }));