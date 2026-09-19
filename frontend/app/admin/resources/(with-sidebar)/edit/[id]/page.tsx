"use client";
import { ResourceForm } from "@/app/admin/components/ResourceForm";
import { useResource } from "@/app/admin/hooks/resourceHooks";

import ResourceDetails from "@/components/others/ResourceDetails";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const resourceId = params.id;
  const { data, isSuccess, isLoading } = useResource(resourceId);
  let initialData;
  if (isSuccess) {
    initialData = {
      resourceName: data?.resourceDetail?.name,
      quantity: data?.resourceDetail?.totalQuantity,
      type: data?.resourceDetail?.type,
      departmentId: data?.resourceDetail?.departmentId,
      description: data?.resourceDetail?.description,
    };
  }

  return <ResourceForm formType="edit" resourceId={resourceId} />;
};
export default Page;
