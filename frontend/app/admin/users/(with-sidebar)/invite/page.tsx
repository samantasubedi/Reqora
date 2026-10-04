"use client";
import EmailInviteForm from "@/app/admin/components/EmailInviteForm";
import InviteCodeGenerator from "@/app/admin/components/InviteCodeGenerator";
import PageHeader from "@/app/admin/components/ui/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Page = () => {
  return (
    <div className="w-full space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Invite Users"
        subtitle="Invite teammates to your workspace by email or with a one-time code."
      />

      <div className="mx-auto w-full max-w-4xl">
        <Tabs defaultValue="emailInvite">
        <div className="flex w-full justify-center">
          <TabsList className="h-11 w-full max-w-md">
            <TabsTrigger className="font-medium" value="emailInvite">
              Email Invite
            </TabsTrigger>
            <TabsTrigger className="font-medium" value="codeInvite">
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
    </div>
  );
};

export default Page;
