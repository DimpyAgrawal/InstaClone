import { BrowserRouter, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './component/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './component/Home';
import SignIn from './component/SignIn';
import SignUp from './component/SignUp';
import Profile from './component/Profile';
import CreatePost from './component/CreatePost';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { createContext, useState } from 'react';
import { LoginContext } from './context/LoginContext';
import UserProfile from './component/UserProfile';

function LogoutModal({ setModalOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setModalOpen(false);
    localStorage.clear();
    navigate('/signin');
  };

  

  return (
    <div className='flex flex-col m-auto justify-center my-60'>
          <div className='flex flex-col m-auto border-2 black bg-slate-50 h-64 w-96 rounded-2xl shadow-2xl'
            onClick={() => setModalOpen(false)}>
            <span className='flex ml-[93%] justify-center bg-blue-950 w-10 text-white rounded-lg shadow-2xl' >
              <span className="material-symbols-outlined">
                close
              </span></span>
            <div className='flex justify-center font-semibold text-2xl'
              onClick={() => setModalOpen(false)}
            >Confirm</div>
            <div className='flex justify-center mt-10'><p>Are you really want to log Out ?</p></div>
            <div className='flex  mt-20 justify-around'>
              <button className='flex justify-center pt-1  border-2 black bg-red-600 text-white w-[30%] h-10 rounded-xl '
                // onClick={()=>{setModalOpen(false);
                // localStorage.clear();
                // navigate(/signin);
                // }} 
                onClick={() => {
                  setModalOpen(false);
                  localStorage.clear();
                  navigate("/signin");
                }}
              >Log Out</button>
              <button className='flex justify-center pt-1  border-2 black bg-gray-900 text-white w-[30%] h-10 rounded-xl '
                onClick={() => setModalOpen(false)}
              >Cancel</button>
            </div>
          </div>
        </div>
  );
}

function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <BrowserRouter>
        <LoginContext.Provider value={{ setUserLogin, setModalOpen }}>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/signin' element={<SignIn />} />
            <Route exact path='/signup' element={<SignUp />} />
            <Route exact path='/profile' element={<Profile />} />
            <Route exact path='/createpost' element={<CreatePost />} />
            <Route exact path='/profile/:userid' element={<UserProfile />} />
          </Routes>
          <ToastContainer theme='dark' />

          {modalOpen && <LogoutModal setModalOpen={setModalOpen} />}

        </LoginContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
