import { Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function DashPosts() {

    const { currentUser } = useSelector(state => state.user)

    const [userPosts, setUserPosts] = useState([])

    // console.log(userPosts)

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
            }

        } catch (error) {
            console.log(error.message)
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

                                <Table.Body className='divide-y'>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-700'>

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
                                            <span>Delete</span>
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
                    </>
                )

                    :

                    <p>You have no post yet</p>
            }


        </div>
    )
}
