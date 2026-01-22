import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

//LOGIN CONTROLLER
export const login = async (req , res)=>{
    try {
        const {email , password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message : "User not found"})
        }
        const isPasswordValid = await bcrypt.compare(password , user.password);
        if(!isPasswordValid){
            return res.status(401).json({message : "Invalid credentials"})
        }
        const token = jwt.sign({id : user._id} , process.env.JWT_SECRET , {expiresIn : '3d'});
        res.status(200).json({
            message : "Login successful" ,
            token ,
             user : {
                id : user._id , 
                name : user.name , 
                email : user.email}
            });
    } catch (error) {
        res.status(500).json({message : "Internal server error"})
    }
}