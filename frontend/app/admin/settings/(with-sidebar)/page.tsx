"use client";
import PageHeader from "@/app/admin/components/ui/PageHeader";
import CompanyProfileForm from "@/app/admin/components/settings/CompanyProfileForm";
import DepartmentsSettings from "@/app/admin/components/settings/DepartmentsSettings";
import AccountSettings from "@/app/admin/components/settings/AccountSettings";
import DangerZone from "@/app/admin/components/settings/DangerZone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = () => {
  return (
    <div className="w-full space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your company profile, departments, account, and workspace."
      />

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="w-full max-w-2xl justify-start overflow-x-auto">
          <TabsTrigger className="flex-none px-4 font-medium" value="company">
            Company
          </TabsTrigger>
          <TabsTrigger
            className="flex-none px-4 font-medium"
            value="departments"
          >
            Departments
          </TabsTrigger>
          <TabsTrigger className="flex-none px-4 font-medium" value="account">
            Account
          </TabsTrigger>
          <TabsTrigger className="flex-none px-4 font-medium" value="danger">
            Danger zone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <CompanyProfileForm />
        </TabsContent>
        <TabsContent value="departments">
          <DepartmentsSettings />
        </TabsContent>
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
        <TabsContent value="danger">
          <DangerZone />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
