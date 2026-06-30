const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()


const PORT = 8080 
app.use(express.json())
app.use(cors({
    origin:true}))

console.log(express.Router())


app.get("/",(req,res) => {
    return res.status(200).json({message:"Server running "})
})




app.listen(PORT , () => console.log("Server running on PORT --> "+ PORT))
