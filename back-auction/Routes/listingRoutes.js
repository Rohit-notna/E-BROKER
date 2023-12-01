import  express  from "express";
import { createListing, getUserListings, deleteListing,  getListing, getListings, updateListing} from "../Controllers/listingController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router()

router.post("/create",verifyToken, createListing)
//for creating a new listing

router.get('/:id', getListing)
//to get a user listing by listing id

router.get('/list/:id', verifyToken, getUserListings)
// to get user all listing 

router.delete('/:id',verifyToken, deleteListing)
//to delete listing

router.get('/searchListing', getListings)
//to get all the listings which is in MongoDB

router.post('/updateListing/:id',verifyToken, updateListing)
//update the user listing by id

export default router ;


