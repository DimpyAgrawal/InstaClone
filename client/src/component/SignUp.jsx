import React, { useEffect,useState } from 'react'
import logo from '../image/logo.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function SignUp() {
 
//   // const  fetchData = async()=>{
//   //   const response = await axios.get("http://localhost:5000/");
  
//   //   console.log(response.data);
//   // }
//   // useEffect(() =>{
//   //   fetchData()
//   // },[])


  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")

  //Toast functions

  const notifyA = (msg) =>toast.error(msg);
  const notifyB = (msg) =>toast.success(msg);

  const emailRegex=/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  const passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  const postData=() =>{

      //checking validation of email
      if(!emailRegex.test(email)){
        notifyA('Invalid email');
        return 
      }else if(!passRegex.test(password)){
          notifyA('Password must contain at leat eight characters,including at least on number and one includes both uppercase letters and special characters for example #,?,!')
          return
      }

        //sending  data to server
        fetch("http://localhost:5000/signup",{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            name:name,
            userName:userName,
            email:email,
            password:password
          })
        }).then(res=>res.json())
        .then(data =>{
          if(data.error){
            notifyA(data.error)
          }
          else{
            notifyB(data.message)
            navigate("/signin")
          }
          
          console.log(data)
        })
   }

  return (

     <>
 <div className='flex flex-col w-[100vw] h-[100vh] bg-gradient-to-t from-rose-600 to-fuchsia-700'>
         <div className='bg-white w-[90%] sm:w-[70%] md:w-[25%] mt-6 mx-auto'>
           <div className='p-7'>
             <div className='flex flex-col'>
               <img src={logo} className='h-[70px] m-4' alt=''></img>
             <p className='text-xl text-slate-600 p-3 text-center my-2'>Sign up to see the photos and video from your friends</p>
               <div className='flex flex-col '>
                 <input type="email" className='border-2 p-1 border-gray-400 ' name='email' value={email} onChange={(e)=>{setEmail
                   (e.target.value)}} placeholder='Email' />
                 <input type="text" className='border-2 p-1 border-gray-400 mt-2' name='name' value={name} onChange={(e)=>{setName
                   (e.target.value)}} placeholder='Fullname' />
                 <input type="username" className='border-2 p-1 border-gray-400 mt-2' name='username' value={userName} onChange={(e)=>{setUserName
                   (e.target.value)}} placeholder='Username'/>
                 <input type="password" className='border-2 p-1 border-gray-400 mt-2' name='password' value={password} onChange={(e)=>{setPassword
                   (e.target.value)}}    placeholder='Passwaord'/>
               </div>
               <p className='text-lg p-4 text-center text-slate-500'>By signin up, you to out Terms privacy and cookies policy</p>
               <button className='bg-blue-700 rounded-lg p-1 text-white m-auto border-2 border-gray-400 w-full text-xl' onClick={() => {
                postData();
               }}>Sign Up</button>

            </div>
          </div>
        </div>
          <div className='mx-auto bg-white w-[90%] sm:w-[70%] md:w-[25%] mt-2 p-7'>
            <p className='text-center'>Already have an account ?Sign In</p> 
          </div> 
      </div> 
    </>
   )
 }
