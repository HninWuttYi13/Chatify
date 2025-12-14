import  { useEffect } from 'react'
import { Navigate, Route, Routes} from 'react-router';
import ChatPages from './Pages/ChatPages';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import { useAuthStore } from './store/useAuthStore.js';
import PageLoader from './components/PageLoader.jsx';
import {Toaster} from "react-hot-toast"
const App = () => {

  
  const {authUser, isChecking, checkAuth} = useAuthStore();
  useEffect(()=> {
    checkAuth();
  }
  , [checkAuth]);
  if(isChecking) return <PageLoader />
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
      <Toaster position="bottom-center" />
    </div>
  );
}

export default App