import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import {AuthContext} from '../../context/AuthContext'

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);


  // const {login} = useContext(AuthContext)

  const {login} = useContext(AuthContext)

  const onSubmitHandler = (event) => {
    event.preventDefault()
    
    if (currState === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    }


    

    login(currState === "Sign up" ? 'signup'  : 'login' , {fullName, email, password, bio} )
    
    // Here you would typically handle form submission to your backend
    console.log({
      fullName,
      email,
      password,
      bio
    })
    
    // Reset form after submission if needed
    // setFullName("")
    // setEmail("")
    // setPassword("")
    // setBio("")
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />
      
      {/* right */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-[min(90vw,400px)]'>

        <h2 className='font-medium text-2xl flex justify-between items-center'> 
          {currState} 
          {isDataSubmitted && currState === "Sign up" && (
            <img 
              onClick={() => setIsDataSubmitted(false)} 
              src={assets.arrow_icon} 
              alt="back" 
              className='w-5 cursor-pointer' 
            />
          )}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input 
            onChange={(e) => setFullName(e.target.value)} 
            value={fullName} 
            type="text" 
            className='p-2 border border-gray-500 rounded-md focus:outline-none bg-transparent' 
            placeholder='Full Name' 
            required 
          />
        )}

        {!isDataSubmitted && (
          <>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              type="email" 
              placeholder='Email Address' 
              required 
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent' 
            />
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              type="password" 
              placeholder='Password' 
              required 
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent' 
            />
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea 
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4} 
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent'
            placeholder='Tell us about yourself...'
          ></textarea>
        )}

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:from-purple-500 hover:to-violet-700 transition-all'> 
          {currState === "Sign up" 
            ? (isDataSubmitted ? "Complete Sign Up" : "Continue") 
            : "Login Now"} 
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-300'>
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === "Sign up" ? (
            <p className='text-sm text-gray-300'>
              Already have an account?{' '}
              <span 
                onClick={() => {
                  setCurrState("Login")
                  setIsDataSubmitted(false)
                }} 
                className='font-medium text-violet-400 cursor-pointer hover:underline'
              >
                Login here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-300'>
              Create an account{' '}
              <span 
                onClick={() => setCurrState("Sign up")} 
                className='font-medium text-violet-400 cursor-pointer hover:underline'
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage