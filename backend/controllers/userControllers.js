
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler(async (req,res)=>{
    const { name,email, password , pic } = req.body;

   if(!name || !email || !password) {
    res.status(400);
    throw new Error("please Enter All Fields");
}
    // findone() is query in mongo
    const userExists= await User.findOne({ email });

    if(userExists){
        res.status(400);
        throw new Error("User Already Exists");
    }

    //it will create a new user
    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

        if ( user ){
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token:generateToken(user._id),
            });
        }else {
            res.status(400);
            throw new Error("Failed to create user");
        }
});


const authUser = asyncHandler(async (req,res) =>{
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error("Invalid Email or Password");
        }
});

// /api/user?search=archit   we will use queries
// $or is inbuilt in mongo search this on net

const allUsers = asyncHandler(async(req,res) =>{
    const keyword = req.query.search ? {
        $or: [
            { name: {$regex: req.query.search , $options: "i"}},
            { email: {$regex: req.query.search , $options: "i"}},
        ]
    }: {};

    const users = await User.find({ ...keyword, _id: { $ne: req.user._id } });           // except the current user logged in return every other user for that we need jwt
    res.send(users);


});

module.exports= { registerUser, authUser , allUsers};