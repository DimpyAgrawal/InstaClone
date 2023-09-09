import React, { useEffect, useState } from 'react'
import PostDetails from './PostDetails';
import { useParams } from "react-router-dom";

export default function Profile() {

  const { userid } = useParams();
  const [pic, setPic] = useState([]);
  const [user, setUser] = useState("");
  const [show, setShow] = useState(false)
  const [posts, setPosts] = useState([])

  const [item, setItem] = useState('');
  const [isFollow, setIsFollow] = useState(false);

  // to follow user
  const followUser = (userId) => {
    fetch("http://localhost:5000/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsFollow(true);
      });
  };

  // to unfollow user
  const unfollowUser = (userId) => {
    fetch("http://localhost:5000/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsFollow(true);
      });
  };

  const toggleDetails = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(posts);
    }
  }


  // useEffect(() => {
  //   fetch("http://localhost:5000/myposts", {
  //     headers: {
  //       Authorization: "Baearer " + localStorage.getItem('jwt')
  //     }
  //   })
  //     .then(res => res.json())
  //     .then((result) => {
  //       setPic(result)
  //       console.log(result);
  //     })
  // }, [])

  useEffect(() => {
    fetch(`http://localhost:5000/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUser(result.user);
        setPosts(result.post);
        if (
          result.user.followers.includes(
            JSON.parse(localStorage.getItem("user"))._id
          )
        ) {
          setIsFollow(true);
        }
      });
  }, [isFollow]);
  
  const { name, email, userName } = JSON.parse(localStorage.getItem('user'));
  // console.log(name);
  return (
    <>

      <div className='flex flex-col w-[100vw] h-[100vh]'>
        <div className='m-auto w-[40%] mt-2'>
          <div className='flex'>
            <div className=' flex h-[100px] w-[100px]'><img className='rounded-full' src="https://images.unsplash.com/photo-1589697547048-962940abc062?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80" alt="" /></div>
            <div className=' m-auto '>
              <div className='flex mt-4'>
                <h1 className='bold text-3xl'>{name}</h1>
                <button className='ml-5 text-xl bg-blue-700 w-28 rounded-2xl text-white' onClick={() => {
                  if (isFollow) {
                    unfollowUser(user._id)
                  } else {
                    followUser(user._id)
                  }
                }} >{isFollow ? "Unfollow" : "Follow"}</button>
              </div>

              <div className='flex mt-10 text-xl mb-10'>
                {console.log(posts)}
                {posts ? (
                  <p>{posts.length} posts</p>
                ) : (
                  <p>0 posts</p>
                )}
               { console.log(user)}
                <p className='pl-5'>{user.followers ? user.followers.length : "0"} followers</p>
                <p className='pl-5'>{user.following ? user.following.length : "0"} following</p>
              </div>
            </div>
          </div>





          <hr className='bg-black bold w-full' />
          <div className='mt-32'>


            Username: {userName}<br />email: {email}<br />
            {pic && pic.map((pics) => (
              <div key={pics._id}>
                <img
                  className='h-[180px]'
                  src={pics.photo}
                  //  onClick={()=>{
                  //     toggleDetails(pics)
                  //  }}
                  alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* {show &&
        <PostDetails item={posts} toggleDetails={toggleDetails} />} */}
    </>
  );

}
