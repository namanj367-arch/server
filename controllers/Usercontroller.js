const user = require("../models/user")
const Cloudinary = require("cloudinary").v2
const fs = require("fs")


//CLOUDINARY CONFIG

Cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})


class Usercontroller {
    static createuser = async (req, res) => {
        try {
            const { name } = req.body
            // console.log(req.body)
            //console.log(req.files);
            if (!user) {
                return res.status(400).json({ message: "all firleds are required" })
            }
            if (!req.files || !req.files.image) {
                return res.satus(400).json({ messgae: "user image is nessesary" })
            }
            const Userimage = req.files.image
            // console.log(Userimage)


            const UploadResult = await Cloudinary.uploader.upload(Userimage.tempFilePath, {
                folder: "User",
            })
            fs.unlinkSync(Userimage.tempFilePath)

            const result = await user.create({
                name,
                image: UploadResult.secure_url,
                public_id: UploadResult.public_id
            })
            res.status(201).json({ messgae: "User created successfully", result })
        } catch (error) {
            console.log(error);
        }
    }

    static getuser = async (req, res) => {
        try {
            const User = await user.find()
            res.status(200).json({ message: "user data fetched successfully", User })
        } catch (error) {
            console.log(error);
        }
    }


    static updateuser = async (req, res) => {
        try {
            const { id } = req.params
            const { name } = req.body
            const User = await user.findById(id)
            if (!User) {
                return res.status(404).json({ message: "user not found" })
            }
            if (req.files && req.files.image) {
                await Cloudinary.uploader.destroy(User.public_id)
                const userimage = req.files.image
                const UploadResult = await Cloudinary.uploader.upload(Userimage.tempFilePath, {
                    folder: "User",
                })
                fs.unlinkSync(Userimage.tempFilePath)
                user.image = UploadResult.secure_url
                user.public_id = UploadResult.public_id
            }
            User.name = name
            await User.save()
            res.status(200).json({ message: "user update successfully" })
        } catch (error) {
            console.log(error);

        }
    }


    static deleteuser = async (req, res) => {
        try {
            const { id } = req.params
            const User = await user.findById(id)
            if (!User) {
                return res.status(404).json({ message: "user not found" })
            }
            await Cloudinary.uploader.destroy(User.public_id)
            await User.deleteOne()
            res.status(200).json({ message: "user deleted successfully" })

        } catch (error) {
            console.log(error);

        }
    }
}


module.exports = Usercontroller
