"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../animate-ui/primitives/buttons/button";
import { Icon } from "@iconify/react";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="w-full bg-transparent flex  items-center justify-between px-[3%] ">
      <button
        onClick={() => {
          router.push("/");
        }}
      >
        <Image
          src="/reqoraLogo.png"
          width={500}
          height={500}
          alt="logo"
          className="w-50 h-25"
        ></Image>
      </button>
      <div className="flex w-[12%] justify-between font-semibold text-teal-700 text-md">
        <button className="cursor-pointer">Features</button>
        <button className="cursor-pointer">How it works</button>
      </div>
      <Button
        className="font-bold cursor-pointer bg-teal-800 text-white rounded-xl py-2 px-4"
        onClick={() => {
          router.push("/login");
        }}
      >
        Sign In
      </Button>
    </div>
  );
};

export default Navbar;
