function MessagesLoadingSkeleton() {
  return (
    <div className="px-3 space-y-5">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className={`chat ${
            index % 2 === 0 ? "chat-start" : "chat-end"
          } animate-pulse`}
        >
          <div className={`chat-bubble bg-fuchsia-950/10 text-fuchsia-50 w-56`}></div>
        </div>
      ))}
    </div>
  );
}
export default MessagesLoadingSkeleton;
