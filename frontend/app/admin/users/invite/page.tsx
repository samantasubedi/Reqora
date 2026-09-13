"use client";
import EmailInviteForm from "@/app/admin/components/EmailInviteForm";
import InviteCodeGenerator from "@/app/admin/components/InviteCodeGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Page = () => {
  return (
    <div className="p-4">
      <Tabs defaultValue="emailInvite">
        <div className="w-full flex justify-center">
          <TabsList className="w-[30%] h-12!">
            <TabsTrigger className="font-bold" value="emailInvite">
              Email Invite
            </TabsTrigger>
            <TabsTrigger className="font-bold" value="codeInvite">
              Code Invite
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="emailInvite">
          <EmailInviteForm />
        </TabsContent>
        <TabsContent value="codeInvite">
          <InviteCodeGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
