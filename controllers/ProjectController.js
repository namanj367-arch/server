const { log } = require("console")
const Project = require("../models/project")
const Cloudinary = require("cloudinary").v2
const fs = require("fs")


//CLOUDINARY CONFIG

Cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})


class ProjectController {
    static CreateProject = async (req, res) => {
        try {
          //  console.log(req.body)
            //console.log(req.files)
            const { title, description, liveLink, githubLink, technologies } = req.body
            if (!title || !description || !liveLink || !githubLink || !technologies) {
                return res.status(400).json({ message: "all fields are required" })
            }
            if (!req.files || !req.files.image) {
                return res.status(400).json({ message: "project image is required" })
            }

            const ProjectImage = req.files.image
            // console.log(ProjectImage);

            const UploadResult = await Cloudinary.uploader.upload(ProjectImage.tempFilePath, {
                folder:"projects",
            })
            //console.log(UploadResult);
            fs.unlinkSync(ProjectImage.tempFilePath)

            const result=await Project.create({
                title,description,liveLink,githubLink,technologies: JSON.parser(technologies),
                image: UploadResult.secure_url,
                public_id: UploadResult.public_id
            })
            res.status(201).json({messgae:"project created successfully",result})
            
        } catch (error) {
            console.log(error);

        }
    }

    //ALL project
    static getAllproject=async(req,res)=>{
        try{
            const project = await Project.find()
            res.status(200).json({message:"project data fetched successfully",project})
        }catch(error){
            console.log(error);
            
        }
    }


    //single project
    static getSingleproject=async(req,res)=>{
        try{
            const {id} = req.params
            const project = await Project.findById(id)
            if(!project){
                return res.status(404).json({message:"project not found"})
            }
            res.status(200).json({message:"project fetched successully",project})
        }catch(error){
            console.log(error);
            
        }
    }


    //update project
    static UpdateProject=async(req,res)=>{
        try{
            const {id}=req.params
            const{title,description,liveLink,githubLink,technologies}=req.body
            const project = await Project.findById(id)
            if (!project){
                return res.status(404).json({
                    message:"project not found"
                })
            }

            if(req.files && req.files.image){
                await Cloudinary.uploader.destroy(project.public_id)
                const projectimage=req.files.projectimage
                const UploadResult=await Cloudinary.uploader.upload(ProjectImage.tempFilePath,{
                    folder:"projects",
                })
                fs.unlinkSync(ProjectImage.tempFilePath)
                project.image=UploadResult.secure_url
                project.public_id=UploadResult.public_id
            }
            project.title=title
            project.description=description
            project.liveLink=liveLink
            project.githubLink=githubLink
            project.technologies=technologies
            await project.save()
            res.status(200).json({message:"project update successfully"})
        }catch(error){
            console.log(error);
            
        }
    }


    //delete project
    static Deleteproject=async(req,res)=>{
        try{
            const {id}=req.params
            const project = await Project.findById(id)
            if(!project){
                return res.status(404).json({message:"project not found"})
            }
            await Cloudinary.uploader.destroy(project.public_id)
            await project.deleteOne()
            res.status(200).json({messgae:"project deleted successfully"})
        }catch(error){
            console.log(error);
            
        }
    }
}

module.exports = ProjectController