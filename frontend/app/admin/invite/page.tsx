"use client";
import EmailInviteForm from "@/app/admin/components/EmailInviteForm";
import InviteCodeGenerator from "@/app/admin/components/InviteCodeGenerator";

import { Icon } from "@iconify/react";
import React, { useState } from "react";

const Page = () => {
  const [emailForm, setEmailForm] = useState(true);

  return (
    <div>
      <div className="flex justify-center mt-5">
        <div className="flex gap-10 w-[30%] border border-border justify-evenly px-5 bg-card shadow-sm shadow-border rounded-2xl p-2 ">
          <button
            onClick={() => {
              setEmailForm(true);
            }}
            className={`flex items-center gap-3 p-2 rounded-xl font-semibold transition-colors duration-200 cursor-pointer ${emailForm ? "bg-primary text-primary-foreground" : " hover:text-card-foreground"}`}
          >
            <Icon icon="ic:outline-email" className="text-2xl" />
            <span>Email Invite</span>
          </button>
          <button
            onClick={() => {
              setEmailForm(false);
            }}
            className={`flex items-center gap-3 p-2 rounded-xl font-semibold transition-colors duration-200 cursor-pointer ${!emailForm ? "bg-primary text-primary-foreground" : " hover:text-card-foreground"}`}
          >
            <Icon icon="pajamas:code" className="text-2xl" />
            <span>Invite Code</span>
          </button>
        </div>
      </div>
      {emailForm ? <EmailInviteForm /> : <InviteCodeGenerator />}
    </div>
  );
};

export default Page;
