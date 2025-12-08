const UserLoadingState = () => {
  return (
    <div className="space-y-5 px-3">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="bg-fuchsia-100/10 rounded-lg p-2 animate-pulse">
          <div className="flex gap-2 items-center">
            <div className="w-12 h-12 rounded-full bg-fuchsia-300"></div>
            <div className="flex-1">
              <div className="h-4 bg-fuchsia-300 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-fuchsia-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserLoadingState;
