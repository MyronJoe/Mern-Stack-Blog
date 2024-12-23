import { Button, Table, Modal } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashComments() {

    const { currentUser } = useSelector(state => state.user)

    const [comments, setComments] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);

    // console.log(loading)

    if (currentUser.isAdmin) {
        useEffect(() => {
            fetchComments()
        }, [currentUser._id])
    }

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/comment/getcomments`)

            const data = await res.json()

            if (res.ok) {
                setComments(data.comments)
                if (data.comments.length < 9) {
                    setShowMore(false)
                }
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const handleShowMore = async () => {

        const startIndex = comments.length

        try {
            const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`)
            const data = await res.json();

            if (res.ok) {
                setComments((prev) => [...prev, ...data.comments])
                if (data.comments.length < 9) {
                    setShowMore(false)
                }
            }

        } catch (error) {
            console.log(error.message)
        }

    }

    const handleDeleteComment = async () => {
        setShowModal(false);
        try {
            const res = await fetch(
                `/api/comment/deleteComment/${commentIdToDelete}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();
            if (res.ok) {
                setComments((prev) =>
                    prev.filter((comment) => comment._id !== commentIdToDelete)
                );
                setShowModal(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };



    return (
        <div className='p-3 table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>


            {
                currentUser.isAdmin && comments.length > 0 ? (

                    <>
                        <Table className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Date Create</Table.HeadCell>
                                <Table.HeadCell>Date Updated</Table.HeadCell>
                                <Table.HeadCell>Comment Content</Table.HeadCell>
                                <Table.HeadCell>Number Of Likes</Table.HeadCell>
                                <Table.HeadCell>User ID</Table.HeadCell>
                                <Table.HeadCell>Post ID</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>

                            </Table.Head>

                            {comments.map((comment) => (

                                <Table.Body className='divide-y' key={comment._id}>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'>

                                        <Table.Cell>{new Date(comment.createdAt).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>


                                        <Table.Cell>

                                            {comment.content}

                                        </Table.Cell>

                                        <Table.Cell>

                                            {comment.numberOfLikes}

                                        </Table.Cell>

                                        <Table.Cell>

                                            {comment.postId}

                                        </Table.Cell>

                                        <Table.Cell>

                                            {comment.userId}

                                        </Table.Cell>


                                        <Table.Cell className='text-red-500 font-medium hover:underline cursor-pointer'>
                                            <span onClick={() => {
                                                setShowModal(true); setCommentIdToDelete(comment._id)
                                            }}>Delete</span>
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
                                        Are you sure you want to delete this comment?
                                    </h3>
                                    <div className='flex justify-center gap-4'>
                                        <Button color='failure' onClick={handleDeleteComment} >
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

                    <p>You have no comment yet</p>
            }


        </div>
    )
}
