//const admin = require("../models/admin")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const adminModel = require("../models/admin")
const Cloudinary = require("cloudinary").v2
const fs = require("fs")


//CLOUDINARY CONFIG

Cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

class AdminController {

    static register = async (req, res) => {
        try {
            const { name, email, password } = req.body
            // console.log(req.body)
            if (!name || !email || !password) {
                return res.status(400).json({ message: "all fields are required" })
            }
            if (!req.files || !req.files.image) {
                return res.satus(400).json({ messgae: "user image is nessesary" })
            }
            const Userimage = req.files.image
            // console.log(Userimage)

            const admin = await adminModel.findOne({ email })
            //console.log(admin)
            if (admin) {
                return res.status(400).json({ message: "email already exist" })
            }
            const UploadResult = await Cloudinary.uploader.upload(Userimage.tempFilePath, {
                folder: "User",
            })
            fs.unlinkSync(Userimage.tempFilePath)

            const hashPassword = await bcrypt.hash(password, 10)
            const Result = await adminModel.create({
                name,
                email,
                password: hashPassword,
                image: UploadResult.secure_url,
                public_id: UploadResult.public_id
            })

            await Result.save()
            res.status(201).json({
                message: "user insert success", Result
            })

        } catch (error) {
            console.log(error)
        }
    }


    static login = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const admin = await adminModel.findOne({ email });
            if (!admin) {
                return res.status(400).json({ message: "Admin not found" });
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 1000,
            });
            res.status(200).json({
                message: "Admin logged in successfully",
                token,
                id: admin._id,
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }


    static getprofile = async (req, res) => {
        try {

            const user = await adminModel.findById(req.admin.id).select('-password')
            res.status(200).json({ user })
            //console.log(req.user.userID)

        } catch (error) {
            console.log(error)
        }
    }


    static logout = async (req, res) => {
        try {
            res.clearCookie('token')
            res.status(200).json({ message: "logout success" })
        } catch (error) {
            console.log(error)
        }
    }

    static Updateprofile = async (req, res) => {
        try {
            const { id } = req.params
            const { name, email } = req.body
            const profile = await adminModel.findByIdAndUpdate(id, { name, email })
            res.status(200).json({ message: "update successfully" })
            if (req.files && req.files.image) {
                await Cloudinary.uploader.destroy(profile.public_id)
                const userimage = req.files.image
                const UploadResult = await Cloudinary.uploader.upload(userimage.tempFilePath, {
                    folder: "profile",
                })
                fs.unlinkSync(userimage.tempFilePath)
                profile.image = UploadResult.secure_url
                profile.public_id = UploadResult.public_id
            }
            profile.name = name
            await profile.save()
            res.status(200).json({ message: "user update successfully" })
        } catch (error) {
            res.status(500).json({ message: "internal error occured" })
        }
    }

    static changePassword = async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;

            // Get admin ID from JWT token (set by auth middleware)
            const adminId = req.admin.id;

            // Find admin by ID
            const adminExists = await adminModel.findById(adminId);
            if (!adminExists) {
                return res.status(400).json({ message: "Admin not found" });
            }

            // Verify old password
            const isPasswordValid = await bcrypt.compare(oldPassword, adminExists.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid old password" });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password in DB
            await admin.findByIdAndUpdate(adminId, { password: hashedPassword });

            res.status(200).json({ message: "Password changed successfully" });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = AdminController