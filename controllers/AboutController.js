const About = require('../models/about')


class AboutController{
    static createabout=async(req,res)=>{
        try{
            const {title,description,skills,achievements}=req.body
            console.log(req.body);

            if(!title||!description||!skills||!achievements){
                return res.status(400).json({message:"all fields are required"})
            }

            const about=await About.create(req.body)
            res.status(201).json({message:"About created successfully"})
            
        }catch(error){
            console.log(error);
            
        }
    }

    static getabout = async (req, res) => {
        try {
            const about = await About.findOne()

            if (!about) {
                return res.status(404).json({ message: "About data not found" })
            }
            res.status(200).json({ about })

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server error" })
        }
    }

    static updateabout=async(req,res)=>{
        try{
           const response = await About.findByIdAndUpdate(req.params.id,req.body,{returnDocument:'after'})

            res.status(200).json({
                success: true,
                message: 'About updated successfully',
                response
            })
        }catch(error){
            res.status(500).json({
                success:false,
                message:error.message
            })
            
        }
    }


    static deleteabout=async(req,res)=>{
        try{
            const response=await About.findByIdAndDelete(req.params.id)

             res.status(200).json({
                success: true,
                message: 'About deleted successfully'
            })
        }catch(error){
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
 }



module.exports=AboutController