import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './FrontPage/Navbar';
import Signin from './FrontPage/Signin';
import Signup from './FrontPage/Signup';
import Home from './FrontPage/Home';
import Profile from './FrontPage/Profile';
import PrivateRoute from './FrontPage/PrivateRoute';
import CreateListing from './Page/CreateListing';
import Listing from './Page/Listing';
import Search from './Page/Search';
import About from '../src/FrontPage/About'
import UpdateListing from '../src/Page/UpdateListing'


function App() {
  return (
   <div>
    <BrowserRouter>
    <Navbar/>
    <Routes>
<Route path="/" element={<Home/>}/>
<Route path="/About" element={<About/>}/>
<Route path="/Signin" element={<Signin/>}/>
<Route path="/Signup" element={<Signup/>}/>
<Route path="/search" element={<Search/>}/>
<Route path="/listing/:listingId" element={<Listing/>}/>
<Route  element={<PrivateRoute/>} >
<Route path="/profile" element={<Profile/>}/>
<Route path="/createListing" element={<CreateListing/>}/>
<Route path="/update-listing/:id" element={<UpdateListing/>}/>
</Route>


    </Routes>
    
    
    </BrowserRouter>
   </div>
  );
}

export default App;
