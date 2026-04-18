import express from 'express'
import mongoConnection from './db.js'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import postRoutes from './routes/postRoutes.js'

dotenv.config()

const app = express()
app.use(express.json()) 

// MongoDB connection removed in favor of Supabase
// mongoConnection();

app.use(cookieParser())
app.use(cors({
    origin:['http://localhost:5173', 'http://localhost:5174', 'https://social-media-rwmj.vercel.app'],
    credentials:true
}))

const PORT = process.env.PORT || 5000

//test Api(optional)
app.get("/test",(req,res)=>{
    res.send("hello world")
})

app.use('/auth',userRoutes)
app.use('/post', postRoutes)
app.use('/uploads', express.static('uploads'))
 
app.listen(PORT,()=>{
    console.log("My new server running on "+PORT)
})

export default app;

