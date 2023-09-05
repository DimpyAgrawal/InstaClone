import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append('upload_preset', 'insta_clone');
    data.append('cloud_name', 'dtjc6fasp');
    fetch("https://api.cloudinary.com/v1_1/dtjc6fasp/image/upload", {
      method: "post",
      body: data,
    })
    .then(res => res.json())
    .then(data => {
      setUrl(data.url); // Update the URL after uploading to Cloudinary
    })
    .catch(err => console.log(err));
  };

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);


  useEffect(() => {
    if (url) {
      fetch("http://localhost:5000/CreatePost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Baearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          body,
          pic: url,
        }),
      })
      .then(res => res.json())
      .then(data => {if(data.error){
        notifyA(data.error)
      }else{
        notifyB("Successfully posted");
        navigate('/')
      }
    })
      .catch(err => console.log(err));
    }
  }, [url, body]);

  const loadFile = (event) => {
    var output = document.getElementById('output'); 
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src); // free memory
    };
    setImage(event.target.files[0]);
  };

  return (
    <>
      <div className='flex flex-col m-auto w-[20%] mt-1 border-2 dark:bg-gray-700'>
        <div className='flex justify-around'>
          <div className='font-bold'>Create New Post</div>
          <button className='flex ml-0 text-end text-blue-500 font-semibold' onClick={postDetails}>Share</button>
        </div>
        <hr className="my-8 mt-2 mb-2 bg-gray-200 border-2 dark:bg-gray-700" />
        <div>
          <img id='output' className='m-auto h-56' src='https://static.thenounproject.com/png/12634-200.png' alt="Preview" />
          <input type="file" onChange={loadFile} />
        </div>
        <hr className="my-8 mt-2 mb-2 bg-gray-200 border-2 dark:bg-gray-700" />
        <div className='flex'>
          <div className='flex h-7 mb-3 mr-4 ml-1'><img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1888&q=80" className='rounded-full' alt="" /></div>
          <div><p>Anupam</p></div>
        </div>
        <div><textarea value={body} onChange={(e) => setBody(e.target.value)} type="text" placeholder='write a caption...' /></div>
      </div>
    </>
  );
}
