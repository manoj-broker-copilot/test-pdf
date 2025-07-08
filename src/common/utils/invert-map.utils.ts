export const invertMap = (data: object) => {
  return Object.entries(data).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
};
