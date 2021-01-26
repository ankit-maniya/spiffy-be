export const errorRes = (error) => {
  const iRes = {
    statuscode: 0,
    data: { error },
  };
  return iRes;
};

export const successRes = (data) => {
  const iRes = {
    statuscode: 1,
    data,
  };
  return iRes;
};
