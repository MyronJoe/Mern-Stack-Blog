import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, } from 'firebase/storage';
import { app } from '../../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost() {

    const [file, setFile] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const [publishError, setPublishError] = useState(null)
    const [formData, setFormData] = useState({})

    const { currentUser } = useSelector((state) => state.user)

    const { postId } = useParams();

    const navigate = useNavigate()


    // console.log(formData)

    useEffect(() => {
        try {

            const fetchPost = async () => {
                const res = await fetch(`/api/post/getposts?postId=${postId}`)

                const data = await res.json();

                if (!res.ok) {
                    console.log(data.message)
                    setPublishError(data.message)
                } else {
                    setPublishError(null)
                    setFormData(data.posts[0])
                }

            }


            fetchPost()

        } catch (error) {
            console.log(error)
        }
    }, [postId])

    const handleUploadImage = async () => {

        try {

            if (!file) {
                setImageUploadError('Please select an image')
                return
            }

            setImageUploadError(null)
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on('state_changed',

                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    setImageUploadProgress(progress.toFixed(0))
                },

                (error) => {
                    setImageUploadError('Image upload failed');
                    setImageUploadProgress(null);
                },

                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadError(null)
                        setImageUploadProgress(null)

                        setFormData({ ...formData, image: downloadURL });
                    })
                }

            )

        } catch (error) {
            setImageUploadError('Image upload failed')
            setImageUploadProgress(null);
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: 'PUT',
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
                navigate(`/post/${data.slug}`)
            }

        } catch (error) {
            setPublishError('Something went wrong')
        }

    }

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>

            <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>

            {
                publishError &&
                <Alert color='failure' className='mb-6'>
                    {publishError}
                </Alert>
            }

            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

                <div className="flex flex-col gap-4 sm:flex-row justify-between">

                    <TextInput type='text' placeholder='Title' id='title' required className='flex-1'
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}

                        value={formData.title}
                    />

                    <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })} value={formData.category}>
                        <option value='uncategorized'>Select a category</option>
                        <option value='reactjs'>React.js</option>
                        <option value='nextjs'>Next.js</option>
                        <option value='javascript'>JavaScript</option>
                        <option value='python'>Python</option>
                    </Select>

                </div>

                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">

                    <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />

                    <Button type='button' gradientDuoTone='purpleToBlue' size='sm' onClick={handleUploadImage} disabled={imageUploadProgress} outline>
                        {
                            imageUploadProgress ?

                                <div className='h-16 w-16'>
                                    <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                                </div>

                                :

                                "Upload image"
                        }
                    </Button>
                </div>

                {
                    formData.image &&

                    <img src={formData.image} alt='Upload image' className='w-full h-64 object-cover' />
                }

                {
                    imageUploadError &&
                    <Alert color='failure'>
                        {imageUploadError}
                    </Alert>
                }

                <ReactQuill
                    theme='snow'
                    value={formData.content}
                    placeholder='Write something...'
                    className='h-72 mb-12'
                    required
                    onChange={(value) => {
                        setFormData({ ...formData, content: value });
                    }}
                />

                <Button type='submit' gradientDuoTone='purpleToPink' className='mb-10' >
                    Update
                </Button>

            </form>

        </div>
    )
}
