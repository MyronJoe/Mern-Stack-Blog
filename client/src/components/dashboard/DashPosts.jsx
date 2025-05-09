import { Button, Table, Modal } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function DashPosts() {

    const { currentUser } = useSelector(state => state.user)

    const [userPosts, setUserPosts] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);

    // console.log(loading)

    if (currentUser.isAdmin) {
        useEffect(() => {
            fetchPosts()
        }, [currentUser._id])
    }

    const fetchPosts = async () => {
        try {
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)

            const data = await res.json()

            if (res.ok) {
                setUserPosts(data.posts)
                if (data.posts.length < 9) {
                    setShowMore(false)
                }
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const handleShowMore = async () => {

        const startIndex = userPosts.length

        try {
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
            const data = await res.json();

            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts])
                if (data.posts.length < 9) {
                    setShowMore(false)
                }
            }

        } catch (error) {
            console.log
        }

    }

    const handleDeletePost = async () => {
        setShowModal(false)

        try {

            const res = await fetch (`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
                method: 'DELETE'
            }
            );

            const data = await res.json();

            if (!res.ok) {
                console.log(data.message)
            }else{
                setUserPosts((prev) =>
                    prev.filter((post) => post._id !== postIdToDelete)
                  );
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='p-3 table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>


            {
                currentUser.isAdmin && userPosts.length > 0 ? (

                    <>
                        <Table className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Date Updated</Table.HeadCell>
                                <Table.HeadCell>Post Image</Table.HeadCell>
                                <Table.HeadCell>Post Title</Table.HeadCell>
                                <Table.HeadCell>Category</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                                <Table.HeadCell>
                                    <span>Edit</span>
                                </Table.HeadCell>
                            </Table.Head>

                            {userPosts.map((post) => (

                                <Table.Body className='divide-y' key={post._id}>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'>

                                        <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>

                                        <Table.Cell>
                                            <Link to={`/post/${post.slug}`}>
                                                <img src={post.image} alt={post.title} className='w-20 h-10 object-cover' />
                                            </Link>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>
                                                {post.title}
                                            </Link>
                                        </Table.Cell>

                                        <Table.Cell>
                                            {post.category}
                                        </Table.Cell>

                                        <Table.Cell className='text-red-500 font-medium hover:underline cursor-pointer'>
                                            <span onClick={() => {
                                                setShowModal(true); setPostIdToDelete(post._id)
                                            }}>Delete</span>
                                        </Table.Cell>

                                        <Table.Cell className='text-teal-500 hover:underline '>
                                            <Link to={`/update-post/${post._id}`}>
                                                Edit
                                            </Link>
                                        </Table.Cell>

                                    </Table.Row>
                                </Table.Body>

                            ))}

                        </Table>


                        {
                            showMore &&
                            (
                                <button className='w-full text-teal-500 self-center text-sm py-7' onClick={handleShowMore}>
                                    Show more
                                </button>
                            )
                        }


                        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                            <Modal.Header />
                            <Modal.Body>
                                <div className='text-center'>
                                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                                        Are you sure you want to delete this post?
                                    </h3>
                                    <div className='flex justify-center gap-4'>
                                        <Button color='failure' onClick={handleDeletePost}>
                                            Yes, I'm sure
                                        </Button>
                                        <Button color='gray' onClick={() => setShowModal(false)}>
                                            No, cancel
                                        </Button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>

                    </>
                )

                    :

                    <p>You have no post yet</p>
            }


        </div>
    )
}
