import express from "express";
import { signup, signin, google, signout, deleteUser, updateUser, fetchUserUsingJWTToken, fetchUserUsingId } from "../Controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";
import {getListings} from "../Controllers/listingController.js";


const router = express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/google",google);
router.get("/signout",signout);
router.delete('/delete/:id',verifyToken, deleteUser)
router.post('/update/:id',verifyToken, updateUser)




router.get('/searchListing', getListings)
//for search page 

router.get('/fetchUser', verifyToken, fetchUserUsingJWTToken)
// for fetching user details via access_token

router.get('/fetchUserById/:id', fetchUserUsingId)
//get user by id for contact information


export default router;
