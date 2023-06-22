import express, {Request, Response} from 'express';

const app = express()
const PORT = process.env.PORT || 4500;

app.get('/', (req:Request, res: Response)=>{
    res.send('hey your app is working')
})

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

// IMPORT ROUTES
const authRoute = require("./routes/auth")


dotenv.config();

// MONGODB CONNECT
const MONGO_URI = process.env.CONNECTDB as string
mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URI).then(()=>{
    console.log('connected to database')
}).catch((error)=>{
    console.log(error)
})

// MIDDLEWARE -> DISABLING CORS AND USED FOR JSON OUTPUT
app.use(express.json(), cors());

// ROUTE MIDDLEWARE
app.use("/api/users", authRoute)



app.listen(PORT, ()=>{
    console.log(`app listening on http://localhost:${PORT}`)
})