export const normalizeDate = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
export const getDateLabel = (dateString) => {
  const messageDate = new Date(dateString);

  const today = new Date();
  const msgDay = normalizeDate(messageDate);
  const todayDay = normalizeDate(today);
  const pastDays = (todayDay - msgDay)/ (1000*60*60*24 );


  if (pastDays === 0) return "Today";
  if (pastDays === 1) return "Yesterday";
  const options =
    messageDate.getFullYear() === today.getFullYear()
      ? { month: "long", day: "numeric" }
      : { month: "long", day: "numeric", year: "numeric" };
  return messageDate.toLocaleTimeString(undefined, options);
};
