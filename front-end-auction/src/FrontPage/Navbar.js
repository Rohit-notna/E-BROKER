import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { signInSuccess } from '../Redux/createSlice'
import { useDispatch } from 'react-redux'
import axios from 'axios'
axios.defaults.withCredentials = true

export default function Navbar() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); 
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(async () => {
    if (!currentUser) {
      try {
        const response = await axios.get(`http://localhost:7000/api/auth/fetchUser`); 
        if(response.success) {
          dispatch(signInSuccess(response.data))
        }
      } catch (error){
        console.log(error);
      }
      
      
    }
  }, []);


  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <div>
          <Link to="/">
            <h1 className="font-bold text-sm sm:text-xl ">Notna Estate</h1>
          </Link>
        </div>

        <div>
          <form
            onSubmit={handleSubmit}
            className="bg-slate-100 p-3 rounded-lg flex items-center"
          >
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none w-24 sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
              <FaSearch className="text-slate-600" />
            </button>
          </form>
        </div>

        <div>
          <ul className="flex gap-4">
            <Link to="/">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Home
              </li>
            </Link>
            <Link to="/About">
              <li className="hidden sm:inline text-slate-700 hover:underline">
             About
              </li>
            </Link>
            <Link to="/Profile">
              {currentUser ? (
                <img
                  src={currentUser.avatar}
                  className="rounded-full h-7 w-7 object-cover"
                  alt="User Avatar"
                />
              ) : (
                <li className="hidden sm:inline text-slate-700 hover:underline">
                  signin
                </li>
              )}
            </Link>
          </ul>
        </div>
      </div>
    </header>
  );
}
