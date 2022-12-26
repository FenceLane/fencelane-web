export const timeToDate = (time: number) => {
  const date = new Date(time);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};
