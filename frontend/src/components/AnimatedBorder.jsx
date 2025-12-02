const AnimatedBorder = ({ children }) => {
  return (
    <div className="w-full min-w-[350px] rounded-2xl  p-px bg-conic/[from_var(--border-angle)] from-fuchsia-300 via-fuchsia-400 to-fuchsia-600 animate-rotate-border">
      {children}
    </div>
  );
};

export default AnimatedBorder;
