"use client"
import { useUser } from "../../hooks/userHooks";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();

  const { data } = useUser({ id: params.id });
  console.log(data);

  return <div>this is user details page</div>;
};
export default Page;
