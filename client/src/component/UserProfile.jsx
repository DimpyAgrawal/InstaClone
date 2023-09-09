import React, { useEffect, useState } from 'react'
import PostDetails from './PostDetails';
import { useParams } from 'react-router-dom';

export default function UserProfile() {
  const {userid} = useParams()
  //console.log(userid);
  const[pic,setPic] =  useState([]);
  const [show , setShow]  = useState(false)
  const [posts, setPosts] = useState([])
  const [item, setItem] = useState('');
  const [user, setUser] = useState('');  


  useEffect(() =>{
    fetch(`http://localhost:5000/user/${userid}`,{
      headers:{
        Authorization: "Baearer " + localStorage.getItem('jwt')
      }
    })
    .then(res=>res.json())
    .then((result) => {
      //console.log(result);
      setUser(result.user)
      setPosts(result.posts)
    })
  }, [])

  const {name, email, userName} = JSON.parse(localStorage.getItem('user'));
  // console.log(name);
  return (
    <>
      {/* <div className='flex flex-col m-auto w-[45%] mt-1'> */}
        name: {name}
        <br />
        Username: {userName}
        <br />
        email: {email}
        <br />
        {pic &&
          posts.map((pics) => (
            <div key={pics._id}>
               <img 
               className='h-[140px] '
               src={pics.photo}
              //  onClick={()=>{
              //     toggleDetails(pics)
              //  }}
                alt="" />
            </div>
          ))}
          
          <h1>{user.name}</h1>
          <p>{posts.length}posts</p> 
      {/* </div>
      {/*------------------------- */}
 
           
    </>
  );
  
  
}
