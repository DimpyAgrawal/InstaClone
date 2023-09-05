import React, { useEffect, useState } from 'react'
import PostDetails from './PostDetails';
export default function Profile() {

  const[pic,setPic] =  useState([]);

  const [show , setShow]  = useState(false)
  const [posts, setPosts] = useState([])
  const [item, setItem] = useState('');


 

  const toggleDetails = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(posts);
    }
  }


  useEffect(() =>{
    fetch("http://localhost:5000/myposts",{
      headers:{
        Authorization: "Baearer " + localStorage.getItem('jwt')
      }
    })
    .then(res=>res.json())
    .then((result) => {
      setPic(result)
      console.log(result);
    })
  }, [])
  const {name, email, userName} = JSON.parse(localStorage.getItem('user'));
  // console.log(name);
  return (
    <>
      <div className='flex flex-col m-auto w-[45%] mt-1'>
        name: {name}
        <br />
        Username: {userName}
        <br />
        email: {email}
        <br />
        {pic &&
          pic.map((pics) => (
            <div key={pics._id}>
               <img src={pics.photo}
              //  onClick={()=>{
              //     toggleDetails(pics)
              //  }}
                alt="" />
            </div>
          ))}
      </div>
      { show && 
        <PostDetail item ={posts} toggleDetails = {toggleDetails}/>

      }
    </>
  );
  
}
