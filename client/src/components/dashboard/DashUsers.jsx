import { Button, Table, Modal } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashUsers() {

    const { currentUser } = useSelector(state => state.user)

    const [users, setUsers] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    // console.log(loading)

    if (currentUser.isAdmin) {
        useEffect(() => {
            fetchUsers()
        }, [currentUser._id])
    }

    const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/user/getusers`)

            const data = await res.json()

            if (res.ok) {
                setUsers(data.users)
                if (data.users.length < 9) {
                    setShowMore(false)
                }
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const handleShowMore = async () => {

        const startIndex = users.length

        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`)
            const data = await res.json();

            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users])
                if (data.users.length < 9) {
                    setShowMore(false)
                }
            }

        } catch (error) {
            console.log(error.message)
        }

    }

    const handleDeleteUser = async () => {

    }



    return (
        <div className='p-3 table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>


            {
                currentUser.isAdmin && users.length > 0 ? (

                    <>
                        <Table className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Date Create</Table.HeadCell>
                                <Table.HeadCell>User Image</Table.HeadCell>
                                <Table.HeadCell>Username</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Admin</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>

                            </Table.Head>

                            {users.map((user) => (

                                <Table.Body className='divide-y' key={user._id}>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'>

                                        <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>

                                        <Table.Cell>

                                            <img src={user.profilePicture} alt={user.username} className='w-10 rounded-full h-10 object-cover' />

                                        </Table.Cell>

                                        <Table.Cell>

                                            {user.username}

                                        </Table.Cell>

                                        <Table.Cell>

                                            {user.email}

                                        </Table.Cell>

                                        <Table.Cell>
                                            {user.isAdmin ? (
                                                <FaCheck className='text-green-500' />
                                            ) : (
                                                <FaTimes className='text-red-500' />
                                            )}
                                        </Table.Cell>

                                        <Table.Cell className='text-red-500 font-medium hover:underline cursor-pointer'>
                                            <span onClick={() => {
                                                setShowModal(true); setUserIdToDelete(user._id)
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
                                        Are you sure you want to delete this user?
                                    </h3>
                                    <div className='flex justify-center gap-4'>
                                        <Button color='failure' onClick={handleDeleteUser} >
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

                    <p>You have no user yet</p>
            }


        </div>
    )
}
