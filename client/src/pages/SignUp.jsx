import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='min-h-screen mt-20'>

      <div className="flex flex-col md:flex-row p-3 max-w-3xl mx-auto md:items-center gap-5">

        {/* left side */}
        <div className="flex-1">
          <Link to="/" className='text-4xl  font-bold dark:text-white'>
            <span className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-1 px-2 text-white rounded-md'>Kamtech</span>Blog
          </Link>

          <p className='text-sm mt-5'>
            This is a Blog Project, Designed by Kamtech. You can sign up with your email and password or with Google.
          </p>
        </div>

        {/* right side */}
        <div className="flex-1">

          <form className='flex flex-col gap-4'>


            <div className="">
              <Label value='Your username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
              />
            </div>

            <div className="">
              <Label value='Your email' />
              <TextInput
                type='text'
                placeholder='name@company.com'
                id='email'
              />
            </div>

            <div className="">
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
              />
            </div>

            <Button gradientDuoTone='purpleToPink' type='submit'>
              Sign Up
            </Button>


          </form>

          <div className='flex gap-2 mt-5 text-sm'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
              Sign In
            </Link>
          </div>

        </div>

      </div>

    </div>
  )
}
