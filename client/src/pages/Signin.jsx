import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Signin() {

  const [formData, setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.')
    }

    try {

      setLoading(true)
      setErrorMessage(null)

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })


      const data = await res.json()

      if (data.success === false) {
        return setErrorMessage(data.message)
      }

      setLoading(false)

      if (res.ok) {
        navigate('/')
      }

    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen mt-20'>

      <div className="flex flex-col md:flex-row p-3 max-w-3xl mx-auto md:items-center gap-5">

        {/* left side */}
        <div className="flex-1">
          <Link to="/" className='text-4xl  font-bold dark:text-white'>
            <span className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-1 px-2 text-white rounded-md'>Kamtech</span>Blog
          </Link>

          <p className='text-sm mt-5'>
            This is a Blog Project, Designed by Kamtech. You can sign in with your email and password or with Google.
          </p>
        </div>

        {/* right side */}
        <div className="flex-1">

          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

            <div className="">
              <Label value='Your email' />
              <TextInput
                type='text'
                placeholder='name@company.com'
                onChange={handleChange}
                id='email'
              />
            </div>

            <div className="">
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='Password'
                onChange={handleChange}
                id='password'
              />
            </div>

            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : 'Sign In'}
            </Button>


          </form>

          <div className='flex gap-2 mt-5 text-sm'>
            <span>Do not have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>
              Sign Up
            </Link>
          </div>

          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }

        </div>

      </div>

    </div>
  )
}
