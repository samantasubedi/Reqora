"use client";
import Image from "next/image";
import Test from "@/components/Test";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const isLoggedIn = async () => {
    try {
      const response = await axios.post(`${backendUrl}/isloggedin`, null, {
        withCredentials: true,
      });

      if (response.data.code == "LOGGEDIN") {
        const { role, username } = response.data;
        router.push(`/${role}/dashboard`);
        return;
      } else if (response.data.code == "NOT_LOGGEDIN") {
        console.log(response.data.message);
        return;
      } else if (response.data.code == "TOKEN_REFRESHED") {
        router.push("/");
        console.log(response.data.message);
        return;
      }
    } catch (err) {
      console.log("request failed", err);
    }
  };
  isLoggedIn();
  return <div>this is landing page</div>;
}
