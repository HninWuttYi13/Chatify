import { PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react";

const  getCallIcon = (status, isOutgoing) => {
  const baseClass = "w-5 h-5";

  if (status === "missed") {
    return <PhoneMissed className={`${baseClass} text-red-500`} />;
  }

  if (status === "rejected") {
    return <PhoneMissed className={`${baseClass} text-red-400`} />;
  }

  if (isOutgoing) {
    return <PhoneOutgoing className={`${baseClass} text-green-500`} />;
  }

  return <PhoneIncoming className={`${baseClass} text-green-500`} />;
};
export default getCallIcon