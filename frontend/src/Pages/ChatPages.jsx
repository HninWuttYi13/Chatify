import { useAuthStore } from "../store/useAuthStore.js";

const ChatPages = () => {
  const { authUser, isLoggedIn, login } = useAuthStore();
  console.log(authUser);
  console.log(isLoggedIn);
  
  return (
    <>
      <div>ChatPages</div>
      <button className="btn btn-primary" onClick={login}>Login</button>
    </>
  );
};

export default ChatPages;
