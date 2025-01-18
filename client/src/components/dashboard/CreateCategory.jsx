import { Alert, Button, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function CreateCategory() {

    const [publishError, setPublishError] = useState(null)

    const [formData, setFormData] = useState({})

    const navigate = useNavigate()

    // console.log(formData)


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch('/api/category/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            })

            const data = await res.json();

            if (!res.ok) {
                setPublishError(data.message)
            }

            if (data.success === false) {
                setPublishError(data.message)
            }

            if (res.ok) {
                setPublishError(null)
                navigate(`/dashboard?tab=categories`)
            }

        } catch (error) {
            setPublishError('Something went wrong')
        }

    }

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>

            <h1 className='text-center text-3xl my-7 font-semibold'>Create a Category</h1>

            {
                publishError &&
                <Alert color='failure' className='mb-6'>
                    {publishError}
                </Alert>
            }

            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

                <div className="flex flex-col gap-4 sm:flex-row justify-between">

                    <TextInput type='text' placeholder='Category Name' id='categoryName' required className='flex-1'
                        onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    />

                </div>

             
                <Button type='submit' gradientDuoTone='purpleToPink' className='my-10' >
                    Create
                </Button>

            </form>

        </div>
    )
}
