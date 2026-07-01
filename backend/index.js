const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectMongoDB = require('./config/db')
const authRoutes = require('./routes/auth')
const receptionistRoutes = require('./routes/receptionist')
const trainerRoutes = require('./routes/trainer')
const memberRoutes = require('./routes/member')

const app = express()

// Connect to MongoDB
connectMongoDB()


const PORT = 8080 
app.use(express.json())
app.use(cookieParser())

// CORS setup to allow credentials for cookies
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))


app.get("/",(req,res) => {
    return res.status(200).json({message:"Server running "})
})

// Mount Auth Routes
app.use('/api/auth', authRoutes)

// Mount Receptionist Routes
app.use('/api/receptionist', receptionistRoutes)

// Mount Trainer Routes
app.use('/api/trainer', trainerRoutes)

// Mount Member Routes
app.use('/api/member', memberRoutes)


app.listen(PORT , () => console.log("Server running on PORT --> "+ PORT))
