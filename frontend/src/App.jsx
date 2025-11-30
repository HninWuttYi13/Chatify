import React from 'react'
import { Route, Routes} from 'react-router';
import ChatPages from './Pages/ChatPages';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';

const App = () => {

  
  
  return (
    <div className='min-h-screen flex justify-center items-center overflow-hidden'>
      <Routes>
        <Route path="/" element={<ChatPages />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App