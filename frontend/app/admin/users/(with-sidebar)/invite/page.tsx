"use client";
import EmailInviteForm from "@/app/admin/components/EmailInviteForm";
import InviteCodeGenerator from "@/app/admin/components/InviteCodeGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Page = () => {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
          Invite Users
        </h1>
        <p className="text-sm text-muted-foreground">
          Invite teammates to your workspace by email or with a one-time code.
        </p>
      </div>

      <Tabs defaultValue="emailInvite">
        <div className="w-full flex justify-center">
          <TabsList className="w-full max-w-md h-11!">
            <TabsTrigger className="font-semibold" value="emailInvite">
              Email Invite
            </TabsTrigger>
            <TabsTrigger className="font-semibold" value="codeInvite">
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
