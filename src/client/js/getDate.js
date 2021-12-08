// get date function
const getDate = (date) => {
  // too hard to understand right? :D
  const then = new Date(date);
  const now = new Date();
  const diff = then.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days;
};

export default getDate;
export {getDate};