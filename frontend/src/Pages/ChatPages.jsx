import { useAuthStore } from "../store/useAuthStore";

const ChatPages = () => {
  const {logout } = useAuthStore();
  return (
    <>
      <div>
        <button onClick={logout} className="btn-primary">Logout</button>
      </div>
    </>
  );
};

export default ChatPages;
