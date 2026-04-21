"use client"
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { handleLogout } from "./AdminDashboard";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

const LogoutDialog = () => {
  const router = useRouter();
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger className="flex gap-2 hover:text-red-500">
          <Icon icon="line-md:logout"className="size-5" /> <span className="font-semibold">Logout</span>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out from your current account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="text-white bg-red-600 hover:bg-red-500 cursor-pointer"
              onClick={() => handleLogout(router)}
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LogoutDialog;
