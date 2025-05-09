import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router';

export default function OAuth() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick = async () => {

        const provider = new GoogleAuthProvider()

        const auth = getAuth(app)

        // helps to always prompt the user to pick an account
        provider.setCustomParameters({ prompt: 'select_account' })

        try {
            const resultFromGoogle = await signInWithPopup(auth, provider)

            // console.log(resultFromGoogle)

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultFromGoogle.user.displayName,
                    email: resultFromGoogle.user.email,
                    googlePhotoUrl: resultFromGoogle.user.photoURL,
                }),
            })

            const data = await res.json()

            // console.log(data)

            if (res.ok) {
                dispatch(signInSuccess(data))
                navigate('/')
            }

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <Button type='button' gradientDuoTone='pinkToOrange' onClick={handleGoogleClick}>
            <AiFillGoogleCircle className='w-6 h-6 mr-2' />
            <span>Continue with Google</span>
        </Button>
    )
}
