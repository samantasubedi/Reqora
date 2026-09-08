"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../animate-ui/primitives/buttons/button";
import { Icon } from "@iconify/react";
import Image from "next/image";
import ThemeToggler from "../global/ThemeToggler";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="w-full bg-background flex  items-center justify-between px-[3%] h-fit">
      <Image
        onClick={() => router.push("/")}
        src="/reqoraLogo.png"
        width={500}
        height={500}
        alt="logo"
        className="w-50 h-20"
      ></Image>

      <div className="flex w-[12%] justify-between font-bold text-primary text-md">
        <button className="cursor-pointer">Features</button>
        <button className="cursor-pointer">How it works</button>
      </div>
      <div className="flex justify-evenly items-center">
        <ThemeToggler />
        <Button
          className="font-bold cursor-pointer bg-primary text-primary-foreground rounded-xl py-2 px-4 size-fit"
          onClick={() => {
            router.push("/login");
          }}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
