import Listing from "../Model/listingModel.js";
import { errorHandler } from "../utils/error.js";


export const createListing = async (req, res, next) => {
    try {
      if(!req.body.userRef) {
        req.body.userRef = req.user.id
      }
      const listing = await Listing.create(req.body);
      listing.save()
      .then((savedListing) => {
        console.log('Listing saved:', savedListing);
      })
      .catch((error) => {
        console.error('Error saving listing:', error.message);
      });
      return res.status(201).json(listing);
      
    } catch (error) {
      next(error);
      console.log(error, "error ")
    }
  };

  export const getUserListings = async (req, res, next) => {
      try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings);
        console.log(listings)
      } catch (error) {
        next(error);
      }

  };

  export const getListing = async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      res.status(200).json(listing);
      console.log(listing)
    } catch (error) {
      next(error);
    }

};

  export const deleteListing = async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {   
        return res.status(404).json({ success: false, message: 'Listing not found' });
      }
      await Listing.findByIdAndDelete(req.params.id);
      res.status(200).json('Listing has been deleted!');
    } catch (error) {
      console.log(error)
      next(error);

    }
  };

  export const getListings = async (req, res, next) => {
    try {
      console.log("here 1"+ req.query)
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;
      let offer = req.query.offer;
  
      if (offer === undefined || offer === 'false') {
        offer = { $in: [false, true] };
      }
  
      let furnished = req.query.furnished;
  
      if (furnished === undefined || furnished === 'false') {
        furnished = { $in: [false, true] };
      }
  
      let parking = req.query.parking;
  
      if (parking === undefined || parking === 'false') {
        parking = { $in: [false, true] };
      }
  
      let type = req.query.type;
  
      if (type === undefined || type === 'all') {
        type = { $in: ['sale', 'rent'] };
      }
  
      const searchTerm = req.query.searchTerm || '';
  
      const sort = req.query.sort || 'createdAt';
  
      const order = req.query.order || 'desc';
  
      const listings = await Listing.find({
        name: { $regex: searchTerm, $options: 'i' },
        offer,
        furnished,
        parking,
        type,
      })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
  
      return res.status(200).json(listings);
    } catch (error) {
      console.log("here"+ error.message)
      next(error);
    }
  };

  export const updateListing = async (req, res, next) => {
    console.log("update listing")
    const listing = await Listing.findById(req.params.id);
    console.log("update listing"+req.body.name)
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }
  
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
  };
