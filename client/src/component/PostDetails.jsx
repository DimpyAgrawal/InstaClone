import React from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostDetails({ item, toggleDetails }) {
    const navigate = useNavigate();

    // Toast functions
    const notifyA = (msg) => toast.error(msg);
    const notifyB = (msg) => toast.success(msg);


    const removePost = (postId) => {
        if (window.confirm("Do you really want to delete this post ?")) {
            fetch(`http://localhost:5000/deletePost/${postId}`, {
                method: "delete",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
            })
                .then((res) => res.json())
                .then((result) => {
                    console.log(result);
                    toggleDetails();
                    navigate("/");
                    notifyB(result.message);
                });
        }
    };


    return (
        <>
            <div className='max-w-[100vw] flex fixed h-[100vh] left-0 top-0 bg-gray-700 bg-opacity-80 inset-0'>
                <div className='max-w-[80vw] flex bg-black m-auto'>
                    <div>
                        <div className='flex h-[80vh]'>
                            <img src={item.photo} alt="" />
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
                                <div className='' onClick={()=>{
                                    removePost(item._id);
                                }}
                                >
                                    <span class="material-symbols-outlined">delete</span>
                                </div>
                            </div>

                            {/* comment section */}
                            <div>
                                <p>abhishek</p>
                            </div>
                        </div>
                        <hr className=" my-8 mt-2 mb-2 bg-gray-200 border-2 dark:bg-gray-700" />
                        <div className='h-[70vh] w-[35vw] '>
                            {item.comments.map((comment, ind) => {
                                <>
                                    <div key={ind} className='flex flex-col gap-y-5 pl-2'>
                                        <div><span className='font-bold'>Abhishek </span>  <span>Awesome pic</span></div>
                                        <div><span className='font-bold'>Abhishek </span>  <span>Awesome pic</span></div>
                                    </div>
                                </>
                            })}

                            <div><span className='font-bold'>Abhishek </span>  <span>Awesome pic</span></div>
                        </div>
                        <hr className=" my-8 mt-2 mb-2 bg-gray-200 border-2 dark:bg-gray-700" />

                        <div className='flex flex-col pl-2'>
                            <p>{item.likes.length}</p>
                            <p>{item.body}</p>
                            <p>awesome post</p>
                        </div>
                        <hr className=" my-8 mt-2 mb-2 bg-gray-200 border-2 dark:bg-gray-700" />

                        
                        <div className='flex mt-3 pl-0 '>

                            <div className=' flex '>
                                <span className="material-symbols-outlined">
                                    sentiment_very_satisfied
                                </span>
                            </div>
                            {/* add comment */}
                            <input type="text" placeholder='Add a comment' className='flex ml-2' />
                            <button className=''>Post</button>
                        </div>
                    </div>
                </div>
            </div>
            <div onClick={() => {
                toggleDetails();
            }}
            >    
            </div>
        </>
    )
}
