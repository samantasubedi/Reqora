type propType = {
  params: {
    id: string;
  };
};
const ResourceDetails = async ({ params }: propType) => {
  return <div>{`this is id ${params.id}`}</div>;
};

export default ResourceDetails;
