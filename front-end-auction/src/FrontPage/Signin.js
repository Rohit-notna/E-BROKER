import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate} from 'react-router-dom'
import { signInFail, signInStart, signInSuccess } from '../Redux/createSlice';
import axios from 'axios'
import Oauth from './Oauth';
axios.defaults.withCredentials = true

export default function Signin() {
  const dispatch= useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const [value, setValue] = useState([]);

  const handleChange=(e)=>{
      setValue({...value, [e.target.id]:e.target.value})
      console.log(value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      dispatch(signInStart());
      const response = await axios.post("e-broker-rohit-notnas-projects.vercel.app/api/auth/signin", value)
      if (response.success === false) {
        dispatch(signInFail(response.message));
        return;
      }
      dispatch(signInSuccess(response.data));
      navigate('/');
    } catch (error) {
      dispatch(signInFail(error.message)); 
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <Oauth/>
      </form>
     
      <div className='flex gap-2 mt-5'>
     
        <p>Dont have an account?</p>
        <Link to="/Signup">
          <span className='text-blue-700'>Sign up</span>
        </Link>
       
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
     
    </div>
  )
}
