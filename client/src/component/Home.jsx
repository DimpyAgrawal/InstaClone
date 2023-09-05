import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';


export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);



  //if user not login then we have to move in signup page
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate('/signup');
    }
    //fetching all the post

    fetch('http://localhost:5000/allposts', {
      headers: {
        "Authorization": "Baearer " + localStorage.getItem('jwt')
      },
    }).then(res => res.json())
      .then(result => {
        console.log(result);
        setData(result);
      })
      .catch((err) => console.log(err))
  }, []);

  //to show and hide comments


  const likePost = (id) => {
    fetch('http://localhost:5000/like', {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Baearer " + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        postID: id
      })
    }).then(res => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result
          } else {
            return posts
          }
        })
        setData(newData)
        console.log(result);
      });
  };

  const unlikePost = (id) => {
    fetch('http://localhost:5000/unlike', {
      method: 'POST', // Change the method to POST
      headers: {
        "Content-Type": "application/json",
        Authorization: "Baearer " + localStorage.getItem('jwt') // Correct the spelling of "Bearer"
      },
      body: JSON.stringify({
        postID: id
      })
    })
      .then(res => res.json())
      .then((result) => {
        const newData = data.map((post) => {
          if (post._id === result._id) {
            return result;
          } else {
            return post;
          }
        });
        setData(newData);
        console.log(result);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  // function to make comment
  // const makeComment = (text, id) => {
  //   fetch('http://localhost:5000/comments', {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Baearer " + localStorage.getItem('jwt')
  //     },
  //     body: JSON.stringify({
  //       text: text,
  //       postID: id
  //     })
  //   }).then(res => res.json())
  //     .then((result) => {
  //       const newData = data.map((posts) => {
  //         if (posts._id == result._id) {
  //           return result
  //         } else {
  //           return posts
  //         }
  //       });
  //       setData(newData)
  //       setComment('');
  //       console.log(result);
  //     });
  //   console.log(comment);
  // }
  const makeComment = (text, id) => {
    console.log(text + " " + id);

    fetch('http://localhost:5000/comment', {
      method: 'PUT', // Change method to PUT to match your server route
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        text: text,
        postedBy: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((post) => {
          if (post._id === result._id) {
            return result;
          } else {
            return post;
          }
        });
        setData(newData);
        setComment('');
        console.log(newData);
        console.log(result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };


  const toggleComment = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(posts);
    }
  };


  return (
    <div>
      <div className='flex flex-col m-auto w-[30vw] mt-[2%]   border-2 dark:bg-gray-700'>
        {data.map((posts, ind) => {
          return (
            <div key={ind}>
              {console.log(data)}
              <hr className="h-px my-8 mt-0 mb-2 bg-gray-200 border-2  " />
              <div className='flex mt-0'>
                <div className='flex h-7 mb-3 mr-4 ml-1' >
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1888&q=80" className='rounded-full' alt="" />
                </div>
                <div>
                  <p>{posts.postedBy.name}</p>
                </div>
              </div>
              <h5>
                <NavLink to={`/profile/${posts.postedBy._id}`}>
                  {posts.postedBy.name}
                </NavLink>
              </h5>


              {/* Card content */}
              <div>
                <div className='flex h-[50vh]'>
                  <img src={posts.photo} alt="" />
                </div>

              </div>
              <div className='ml-1'>
                {
                  posts.likes.includes(JSON.parse(localStorage.getItem("user"))._id) ?
                    (<span className="material-symbols-outlined" onClick={() => { likePost(posts._id) }}>
                      favorite
                    </span>) : (<span className="material-symbols-outlined material-symbols-outlined-red" onClick={() => { unlikePost(posts._id) }}>favorite</span>
                    )
                }
                {/* <p>This is amazing</p> */}
                <p>{posts && posts.like && posts.like.length} Likes</p>
                <p>{posts.body} </p>
                <p className="font-bold cursor-pointer" onClick={() => { toggleComment(posts) }}  >View all comments</p>

              </div>

              <hr className=" my-8 mt-2 mb-2 bg-gray-200 border-2 dark:bg-gray-700" />
              <div className='flex mt-3 pl-0 '>
                <div className=' flex '>
                  <span className="material-symbols-outlined">
                    sentiment_very_satisfied
                  </span>
                </div>
                <input type="text" placeholder='Add a comment' className='flex ml-2' value={comment} onChange={(e) => { setComment(e.target.value) }} />
                <button className='flex mr-0' onClick={() => { makeComment(comment, posts._id); }}>Post</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ---------------------------------------- */}
      {/* show Comment */}
      {show && (
        <div className='max-w-[100vw] flex fixed h-[100vh] left-0 top-0 bg-gray-700 bg-opacity-80 inset-0'>
          <div className='max-w-[80vw] flex bg-black m-auto'>
            <div>
              <div className='flex h-[80vh]'>
                <img src={item.photo} alt="" />
                {/* <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1888&q=80" className='-full' alt="" /> */}
              </div>
            </div>
            <div className='flex flex-col bg-white ' >
              <span class="material-symbols-outlined cursor-pointer ml-auto items-end" onClick={() => { toggleComment() }}>
                close
              </span>
              <div className='flex mt-0'>
                <div className='flex h-7 mb-3 mr-4 ml-1' >
                  <img className='rounded-full' src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1888&q=80" alt="" />
                  <h5>{item.postedBy.name}</h5>
                </div>
                
              </div>
              <hr className=" my-8 mt-2 mb-2 bg-gray-200 border-2 dark:bg-gray-700" />
              <div className='h-[70vh] w-[35vw] '>
                {item.comments && item.comments.map((comment, ind) => (
                  <div key={ind} className='flex flex-col gap-y-5 pl-2'>
                    {console.log(item)}
                    {console.log(comment)}
                    <div>
                      <span className='font-bold'>{comment.postedBy.name} </span>
                      <span>{comment.comment}</span>
                    </div>
                    <div>
                      
                    </div>
                  </div>
                ))}

              </div>
              <hr className=" my-8 mt-2 mb-2 bg-gray-200 border-2 dark:bg-gray-700" />
              <div className='flex flex-col pl-2'>
                {/* <p>{item.likes.length}</p> */}
                <p>awesome post</p>
              </div>
              <hr className=" my-8 mt-2 mb-2 bg-gray-200 border-2 dark:bg-gray-700" />
              <div className='flex mt-3 pl-0 '>

                <div className=' flex '>
                  <span className="material-symbols-outlined">
                    sentiment_very_satisfied
                  </span>
                </div>
                <input type="text" value={comment} onChange={(e) => { setComment(e.target.value) }} placeholder='Add a comment' className='flex ml-2' />
                <button className='' onClick={() => {
                  makeComment(comment, item._id);
                  toggleComment()

                }} >Post</button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div >
  );
}