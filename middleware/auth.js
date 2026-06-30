const jwt = require("jsonwebtoken")
const Admin = require("../models/admin")


const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        console.log(token)
        if (!token) {
            return res.status(401).json({ message: "unauthorised" })
        }
        const DecodedToken = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(DecodedToken)
        
        req.admin = DecodedToken
        console.log(req.admin)
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error occured" })
    }
}


module.exports = auth