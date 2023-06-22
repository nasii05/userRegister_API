import mongoose, {Schema, model} from "mongoose";

export interface user{
    fname: string,
    lname: string,
    email: string,
    password: string,
    date: Date,
}

const userSchema = new mongoose.Schema<user>({

   fname: {
    type: String,
    required: true,
    min: 6,
    max: 20
   },

   lname: {
    type: String,
    required: true,
    min: 6,
    max: 20
   },

   email: {
    type: String,
    required: true,
    min: 6,
    max: 20
   },

   password: {
    type: String,
    required: true,
    max: 14,
    min: 6
   },
   date: {
    type: Date,
    default: Date.now()
   }

})

export const User = model('User', userSchema)