"use client"
import EmailInviteForm from "@/components/admin/EmailInviteForm";
import InviteCodeGenerator from "@/components/admin/InviteCodeGenerator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import React, { useState } from "react";

const page = () => {
  const [emailForm, setEmailForm] = useState(true);

  return (
    <div>
      <div className="flex justify-center mt-5">
      <div className="flex gap-10 w-[30%] border border-slate-200 justify-evenly px-5 bg-slate-100 shadow-sm shadow-slate-600 rounded-2xl p-2 ">
  <button
    onClick={() => { setEmailForm(true) }}
    className={`flex items-center gap-3 p-2 rounded-xl font-semibold transition-colors duration-200 cursor-pointer ${emailForm ? "bg-sky-900 text-white" : " hover:text-slate-700"}`}>
    <Icon icon="ic:outline-email" className="text-2xl" />
    <span>Email Invite</span>
  </button>
  <button
    onClick={() => { setEmailForm(false) }}
    className={`flex items-center gap-3 p-2 rounded-xl font-semibold transition-colors duration-200 cursor-pointer ${!emailForm ? "bg-sky-900 text-white" : " hover:text-slate-700"}`}>
    <Icon icon="pajamas:code" className="text-2xl" />
    <span>Invite Code</span>
  </button>
</div>
      </div>
      {emailForm ? <EmailInviteForm /> : <InviteCodeGenerator/>}
    </div>
  );
};

export default page;
