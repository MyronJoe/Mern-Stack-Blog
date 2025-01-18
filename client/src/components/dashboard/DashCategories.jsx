import { Button, Table, Modal } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashCategories() {

    const { currentUser } = useSelector(state => state.user)

    const [categories, setCategories] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

    // console.log(categoryIdToDelete)

    if (currentUser.isAdmin) {
        useEffect(() => {
            fetchCategories()
        }, [currentUser._id])
    }

    const fetchCategories = async () => {
        try {
            const res = await fetch(`/api/category/getcategory`)

            const data = await res.json()

            if (res.ok) {
                setCategories(data.categories)
                if (data.categories.length < 9) {
                    setShowMore(false)
                }
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    

    const handleDeleteCategory = async () => {
        setShowModal(false);
        try {
            const res = await fetch(
                `/api/category/deleteCategory/${categoryIdToDelete}`,
                {
                    method: 'DELETE',
                }
            );

            const data = await res.json();
            
            if (res.ok) {
                setCategories((prev) =>
                    prev.filter((category) => category._id !== categoryIdToDelete)
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
                currentUser.isAdmin && categories.length > 0 ? (

                    <>
                        <Table className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Date Create</Table.HeadCell>
                                <Table.HeadCell>Category Name</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>

                            </Table.Head>

                            {categories.map((category) => (

                                <Table.Body className='divide-y' key={category._id}>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'>

                                        <Table.Cell>{new Date(category.createdAt).toLocaleDateString()}</Table.Cell>


                                        <Table.Cell>

                                            {category.categoryName}

                                        </Table.Cell>

                                        


                                        <Table.Cell className='text-red-500 font-medium hover:underline cursor-pointer'>
                                            <span onClick={() => {
                                                setShowModal(true); setCategoryIdToDelete(category._id)
                                            }}>Delete</span>
                                        </Table.Cell>

                                    </Table.Row>
                                </Table.Body>

                            ))}

                        </Table>




                        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                            <Modal.Header />
                            <Modal.Body>
                                <div className='text-center'>
                                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                                        Are you sure you want to delete this category?
                                    </h3>
                                    <div className='flex justify-center gap-4'>
                                        <Button color='failure' onClick={handleDeleteCategory} >
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

                    <p>You have no category yet</p>
            }


        </div>
    )
}
