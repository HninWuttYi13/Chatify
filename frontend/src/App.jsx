import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import ChatPages from "./Pages/ChatPages";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import { useAuthStore } from "./store/useAuthStore.js";
import PageLoader from "./components/PageLoader.jsx";
import { Toaster } from "react-hot-toast";
import { useChatStore } from "./store/useChatStore.js";
import AudioCallController from "./components/AudioCallController.jsx";
import IncomingAudioCallModal from "./components/IncomingAudioCallModal.jsx";
import OutgoingAudioCallModal from "./components/OutgoingAudioCallModal.jsx";
import ActiveCallModal from "./components/ActiveCallModal.jsx";
const App = () => {
  const {
    authUser,
    isChecking,
    checkAuth,
    getLastOnlineUsers,
    unsubscribeLastOnlineUsers,
  } = useAuthStore();
  const { subscribeNewMessages, unsubscribeNewMessages, selectedUser } =
    useChatStore();
  useEffect(() => {
    checkAuth();
    if(!authUser) return;
    subscribeNewMessages();
    return ()=> unsubscribeNewMessages()
  }, [authUser]);
 
 useEffect(()=> {
    getLastOnlineUsers();
    return ()=> unsubscribeLastOnlineUsers();
 }, [selectedUser])
  if (isChecking) return <PageLoader />;
  return (
    <div className="min-h-screen bg-fuchsia-200 relative flex items-center justify-center overflow-hidden ">
      <Routes>
        <Route
          path="/"
          element={authUser ? <ChatPages /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
      </Routes>
      <AudioCallController/>
      <OutgoingAudioCallModal/>
      <IncomingAudioCallModal/>
      <ActiveCallModal/>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default App;
