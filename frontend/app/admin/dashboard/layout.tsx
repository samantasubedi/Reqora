import React, { ReactNode } from "react";
import SidebarLayout from "../components/layouts/SidebarLayout";

const layout = ({ children }: { children: ReactNode }) => {
  return <SidebarLayout>{children}</SidebarLayout>;
};
export default layout;
