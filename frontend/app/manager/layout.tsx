import Navbar from "@/components/others/Navbar";
import { ReactNode } from "react";

const ManagerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Navbar />
      <main className=" w-full  flex justify-center  px-2 py-6 ">
        {children}
      </main>
    </div>
  );
};

export default ManagerLayout;
