import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import React from 'react'
import { app } from '../firebase'
import { signInSuccess } from '../Redux/createSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
axios.defaults.withCredentials = true

export default function Oauth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const handleGoogleClick= async ()=>{
        try {
    const provider =   new   GoogleAuthProvider()
    const auth = getAuth(app)
    const result = await signInWithPopup(auth, provider) ;
    console.log(result)
    
     const userData ={
  name: result.user.displayName,
  email: result.user.email,
  photo: result.user.photoURL,
   }
   const response = await axios.post("e-broker-rohit-notnas-projects.vercel.app/api/auth/google", userData, {
    withCredentials: true, 
    credentials: 'include'
  });
  const responseData = response.data;
        dispatch(signInSuccess(responseData))
        console.log(responseData)
        navigate('/');
        } catch (error) {
          console.log('could not sign in with google', error);
        }
    }


  return (

    <div className='mx-auto'>
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 px-36"
    >
      Continue with Google
    </button>
  </div>
  )
}
