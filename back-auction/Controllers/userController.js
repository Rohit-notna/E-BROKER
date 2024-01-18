import bcryptjs, { hash } from 'bcrypt'
import userModel from '../Model/userModel.js';
import user from '../Model/userModel.js'
import { comparePassword, hashedPassword } from '../helper/password.js';
import JWT from "jsonwebtoken";
import { errorHandler } from '../utils/error.js';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;


 export const signup = async (req, res) => {
    const {username, email, password}= req.body;
    if (!username){
      return req.send({error:"username is required"})
    }
    if (!email){
        return req.send({error:"email is required"})
      }
      if (!password){
        return req.send({error:"password is required"})
      }
      const exitingUser = await userModel.findOne({email});
      if (exitingUser){
        return res.status(200).send({
            success:fasse,
            message:"Email is already registered"
        })
      }
       //register user
    const hashPassword = await hashedPassword(password);
    //save
    const user = await new userModel({
     username, 
      email,
      password: hashPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await user.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = JWT.sign({ id: validUser._id }, JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true,
        secure: true,
      sameSite: 'None',
    path: '/' })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const userFound = await userModel.findOne({ email: req.body.email });

    if (userFound) {
      const token = JWT.sign({ id: userFound._id }, JWT_SECRET);
      const { password: pass, ...rest } = userFound._doc;
      res
        .cookie('access_token', token, { httpOnly: true,
        secure: true,
      sameSite: 'None',
    path: '/' })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new userModel({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
       avatar: req.body.photo,
      });
      await newUser.save();
      const token = JWT.sign({ id: newUser._id }, JWT_SECRET);
      const { password: pass, ...userDetails } = newUser._doc;
      console.log("here1 "+ token);
      res
        .cookie('access_token', token, { httpOnly: true,
          secure: true, // Set to true in production
          sameSite: 'None',
        })
        .status(200)
        .json(userDetails);
    }
  } catch (error) {
    // console.error('Error in google function:', error);
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};

export const fetchUserUsingJWTToken  = async (req, res, next) => {
  try {
    const userDetails = await user.findById(req.user);
  
    if (!userDetails) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = userDetails._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const fetchUserUsingId  = async (req, res, next) => {
  try {
    // console.log("here "+ req.params.id)
    const userDetails = await user.findById(req.params.id);
  
    if (!userDetails) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = userDetails._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    // console.log("here "+ error.message)
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userDetails = await user.findById(req.params.id);
    if (!userDetails) return next(errorHandler(404, 'User not found!'));
    else{
     await user.findByIdAndDelete(req.params.id);
     res.clearCookie('access_token');
     res.status(200).json('User has been deleted!');
    }
  } catch (error) {
    next(error)
  }
  };

  export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, 'You can only update your own account!'));
    try {
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
  
      const updatedUser = await user.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
          },
        },
        { new: true }
      );
  
      const { password, ...rest } = updatedUser._doc;
  
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };