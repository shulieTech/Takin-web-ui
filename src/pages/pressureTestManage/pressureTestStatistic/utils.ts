export const transformDatekey = (date: string[]) => {
  return {
    startTime: date[0],
    endTime: date[1]
  };
};
