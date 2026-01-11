export const formatTime = (date) => {
  // If no date exists, show "Offline"
  if (!date) return "Offline";

  const now = new Date();
  const inputDate = new Date(date);
  const diffInMs = now - inputDate;

  const diffInMinute = Math.floor(diffInMs / 60000);
  const diffInHour = Math.floor(diffInMs / 3600000);

  if (diffInMinute < 1) return "just now";

  if (diffInMinute < 60) return `${diffInMinute} min ago`;
  if (now.toDateString() === inputDate.toDateString()) {
    return `${diffInHour} hr ago`;
  }

  // 3. Handling Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === inputDate.toDateString();

  const timeStr = inputDate.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isYesterday) return `Yesterday at ${timeStr}`;

  const options = {
    month: "short",
    day: "numeric",
    ...(inputDate.getFullYear() !== now.getFullYear() && { year: "numeric" }),
  };

  return `${inputDate.toLocaleDateString(undefined, options)} at ${timeStr}`;
};
