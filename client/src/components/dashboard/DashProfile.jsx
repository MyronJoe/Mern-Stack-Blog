import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, } from 'firebase/storage';
import { app } from '../../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateFailure, updateSuccess } from '../../redux/user/userSlice';

export default function DashProfile() {

    const { currentUser } = useSelector(state => state.user)

    const filePickerRef = useRef();
    const dispatch = useDispatch()

    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [formData, setFormData] = useState({})
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);

    const handleImageChange = (e) => {

        const file = e.target.files[0]

        if (file) {

            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }

    }

    useEffect(() => {
        if (imageFile) {
            uploadImage()
        }
    }, [imageFile])

    const uploadImage = async () => {

        // service firebase.storage {
        //     match / b / { bucket } / o {
        //         match / { allPaths=**} {
        //         allow read;
        //         allow write: if
        //         request.resource.size < 2 * 1024 * 1024 &&
        //                 request.resource.contentType.matches('image/.*')
        //       }
        //     }
        // }

        setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)

        uploadTask.on('state_changed',

            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                setImageFileUploadProgress(progress.toFixed(0))
            },

            (error) => {
                setImageFileUploadError(
                    'Could not upload image (File must be less than 2MB)'
                );
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },

            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL)
                    setFormData({ ...formData, profilePicture: downloadURL });
                    setImageFileUploading(false);
                })
            }

        )


    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null)
        if (Object.keys(formData).length === 0) {
            setUpdateUserError('No changes made')
            return;
        }

        if (imageFileUploading) {
            setUpdateUserError('Please wait for image to upload')
            setUpdateUserSuccess(null)
            return;
        }

        try {
            dispatch(updateStart())

            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User's profile updated successfully");
            }

        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    }

    // console.log(formData)

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='text-center my-7 font-semibold text-3xl'>Profile</h1>

            <form className='flex flex-col gap-5' onSubmit={handleSubmit}>

                <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />

                <div className='relative w-32 h-32 self-center cursor-pointer shadow-md rounded-full mx-auto' onClick={() => filePickerRef.current.click()} >

                    {
                        imageFileUploadProgress && (
                            <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`}
                                strokeWidth={5}
                                styles={{
                                    root: {
                                        width: '100%',
                                        height: '100%',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                    },
                                    path: {
                                        stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100
                                            })`,
                                    },
                                }}
                            />
                        )
                    }

                    <img src={imageFileUrl || currentUser.profilePicture} alt={currentUser.username} className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} />

                </div>

                {
                    updateUserError &&

                    <Alert color='failure'>
                        {updateUserError}
                    </Alert>
                }
                {
                    imageFileUploadError &&

                    <Alert color='failure'>
                        {imageFileUploadError}
                    </Alert>
                }

                {
                    updateUserSuccess &&

                    <Alert color='success'>
                        {updateUserSuccess}
                    </Alert>
                }



                <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={handleChange} />

                <TextInput type='text' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange} />

                <TextInput type='password' id='password' placeholder='Password' onChange={handleChange} />

                <Button type='submit' gradientDuoTone="purpleToBlue" outline>
                    Update
                </Button>

            </form>

            <div className='flex justify-between my-5 text-red-500'>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>

        </div>
    )
}
