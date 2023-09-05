import React, { useState, useContext } from 'react';
import logo from '../image/logo.png';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoginContext } from "../context/LoginContext";

export default function SignIn() { 
  const { setUserLogin } = useContext(LoginContext)
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const postData = () => {
    // Checking email
    if (!emailRegex.test(email)) {
      notifyA('Invalid email');
      return;
    }
    // Sending data to server
    fetch('http://localhost:5000/signin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB('Signed In Successfully');
          console.log(data);
          localStorage.setItem('jwt', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          setUserLogin(true);
          navigate('/');
        }
        console.log(data);
      });
  };

  return (
    <>
      <div className='flex flex-col bg-gradient-to-t from-rose-600 to-fuchsia-700 w-[100vw] h-[100vh]'>
        <div className='flex mt-24 mx-auto py-8 px-3 bg-white bg-opacity-30 w-[70%] sm:w-[50%] md:w-[21%]'>
          <div className='flex flex-col p-2'>
            <img src={logo} className='h-[70px] m-5' alt='' />

            <input
              type='email'
              name='email'
              className='border-2  border-gray-400'
              id='email'
              placeholder='Email'
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type='password'
              name='password'
              id='password'
              placeholder='Password'
              className='border-2 my-2 border-gray-400'
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button
              type='button'
              id='login-btn'
              onClick={() => {
                postData();
              }}
              className='border-2 border-gray-400 bg-blue-600 text-white rounded'
            >
              Sign In
            </button>
          </div>
        </div>
        <div className='flex mx-auto bg-white bg-opacity-30 mt-2 h-[7%] w-[70%] sm:w-[50%] md:w-[21%]'>
          <p className='m-auto'>
            Don't have an account ?<span className='text-purple-900' onClick={() => navigate('/signup')}>
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

