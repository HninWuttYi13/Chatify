

export const formatCallDuration = (seconds) => {
  if (!seconds || seconds === 0) return "0sec";

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) return `${secs}s`;
  return `${mins}min ${secs}sec`;
};


export const getCallStatusText = (status, isOutgoing) => {
  switch (status) {
    case "completed":
      return isOutgoing ? "The audio call ended" : "The audio call ended";

    case "rejected":
      return isOutgoing ? "Call rejected" : "Call declined";

    case "missed":
      return "Missed call";

    case "ringing":
      return isOutgoing ? "Outgoing call" : "Incoming Call";

    case "ongoing":
      return "Call in progress";

    default:
      return "Call";
  }
};
  