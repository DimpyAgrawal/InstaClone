import React ,{useContext} from 'react'
import logo from '../image/logo.png'
import { NavLink } from 'react-router-dom'
import { LoginContext } from '../context/LoginContext';

export default function Navbar(){

  const token = localStorage.getItem('jwt');
  const { setModalOpen } = useContext(LoginContext);

  return (
    <>
      <div className='flex m-auto w-[100%]  border-b-4 '>
        <div className=' ml-[10%] w-[20%] sm:w-[15%]'><img src={logo} alt='' /></div>
        <div className='flex m-auto  md:mr-[10%] sm:gap-x-8 gap-x-4'>
        
         
          {token ? (
            <>
            <NavLink to='/profile'><div>Profile</div></NavLink>
            <NavLink to='/createpost'><div>Create Post</div></NavLink>
            <NavLink to='/modal'  onClick={() => setModalOpen(true)}>
              <div>Logout</div></NavLink>
            
              
            </> ) : (
              <>
               <NavLink to='/signup'><div>SignUp</div></NavLink>
               <NavLink to='/signin'><div>Signin</div></NavLink>
              </>
              
            )}

        </div>
      </div>
    </>
  )
}


