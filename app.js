const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const connectDB = require("./config/connectdb")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const web = require("./routes/web")
const fileUpload = require("express-fileupload")

app.use(cookieParser())

//image and file handling
app.use(fileUpload({
    useTempFiles: true,
}))
//database connection
connectDB()


//middleware
app.use(cors({
    origin:"http://localhost:5173",   //client url
    credentials: true,  //to allow cookies
}))
app.use(express.json())   // to accept json data from client convert into objects



//router load
app.use("/api",web)   //localhost:5000/api
app.listen(process.env.PORT,()=>{
    console.log(`server is running on port${process.env.PORT}`)
})