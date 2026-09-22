"use client";

import { ResourceForm } from "@/app/admin/components/ResourceForm";
import { useResource } from "@/app/admin/hooks/resourceHooks";
import { groupItems } from "@/lib/HelperFunctions";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const resourceId = params.id;
  const { data, isSuccess } = useResource(resourceId);

  if (!isSuccess || !data) {
    return null;
  }

  const { resourceDetail } = data;
  const initialData = {
    resourceName: resourceDetail.name,
    quantity: resourceDetail.totalQuantity,
    type: resourceDetail.type,
    departmentId: resourceDetail.departmentId,
    description: resourceDetail.description ?? "",
  };

  const locationData = groupItems({
    resourceItems: resourceDetail.resourceItems,
    key: "location",
  });
  console.log("this is the location data", locationData);
  const statusData = groupItems({
    resourceItems: resourceDetail.resourceItems,
    key: "status",
  });
  console.log("this is the status data", statusData);

  return (
    <ResourceForm
      formType="edit"
      resourceId={resourceId}
      defaultValues={initialData}
      locationData={locationData}
      statusData={statusData}
    />
  );
};

export default Page;
