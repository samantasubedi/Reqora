export const pageHelper = ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}) => {
  let pageNumber = 1,
    pageLimit = 10;
  if (page) {
    pageNumber = page;
  }
  if (limit) {
    pageLimit = limit;
  }
  const skip = (pageNumber - 1) * pageLimit;
  const take = pageLimit;
  return { skip, take };
};
