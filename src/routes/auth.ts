import express, { Request, Response } from "express";
const router =  express.Router()
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from "../models/User";

dotenv.config()

// validation of user inputs prerequisits
import Joi from '@hapi/joi';

const registerSchema = Joi.object({
    fname: Joi.string().min(3).required(),
    lname: Joi.string().min(3).required(),
    email: Joi.string().min(4).required().email(),
    password: Joi.string().min(6).required(),
})

router.post("/register", async (req:Request, res:Response)=>{
    //  CHECKING IF USER EMAIL ALREADY EXISTS
    const emailExist = await User.findOne({email: req.body.email});
    // IF EMAIL EXIST THEN RETURN 
    if(emailExist){
        res.status(400).send("Email already exists");
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // ON PROCESSS OF ADDING NEW USER

    const user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: hashedPassword, 
    })

    try{
        // VALIDATION OF USER INPUTS

       const {error} = await registerSchema.validateAsync(req.body);

        // WE CAN JUST GET THE ERROR (IF EXISTS) WITH OBJECT DECONSTRUCTION

        // IF ERROR EXISTS THEN SEND BACK THE ERROR

        if(error){
            res.status(400).send(error.details[0].message);
            return;
        }else {
            const saveUser = await user.save();
            res.status(200).send("user created");
        }
    }catch(error){
        res.status(500).send(error)
    }
});

// LOGIN USER SCHEMA 
 
const loginschema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
})

// LOGIN USER

router.post("/login", async(req:Request, res: Response)=>{
    // CHECKING IF USER EXISTS

    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send("Incorrect Email - ID");

    // CHECKING IF USER PASSWORD MATCHES

    const validPasssword = await bcrypt.compare(req.body.password, user.password);
    if(!validPasssword) return res.status(400).send("Incorrect Password");

    try{
        // VALIDATION OF USER INPUTS

        const {error} = await loginschema.validateAsync(req.body);
        if(error) return res.status(400).send(error.details[0].message);
        else{
            const tokenSecret = process.env.TOKEN_SECRET as string
            // res.send("success");
            const token = jwt.sign({_id: user._id}, tokenSecret);
            res.header("auth-token", token).send(token);

        }
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router




