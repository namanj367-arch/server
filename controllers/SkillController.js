const skill=require("../models/skill")

class Skills{
    static Createskill=async(req,res)=>{
        try{
            const {name ,percentage, icon}=req.body
           // console.log(req.body)
           if(!name||!percentage||!icon){
            return res.status(404).json({message:"all field are required"})
           }
           const skills=await skill.create(req.body)
           return res.status(201).json({message:"skills are created successfully",skills})
        }catch(error){
            res.status(500).json({message:"internal server error"})
        }
    }

    static getallskills=async(req,res)=>{
        try{
            const skills=await skill.find()
            if(!skills){
                return res.status(401).json({message:"skills not found"})
            }
            return res.status(200).json({message:"skills found",skills})
        }catch(error){
            res.status(500).json({message:"internal error occured"})
        }
    }

    static Updateskills=async(req,res)=>{
        try{
            const{id}=req.params
            const {name,percentage,icon}=req.body
            await skill.findByIdAndUpdate(id,{name,percentage,icon})
            res.status(200).json({message:"updated successfully"})
        }catch(error){
            res.status(500).json({message:"internal error ocurred"})
        }
    }

    static Deleteskills=async(req,res)=>{
        try{
           const { id } = req.params
            const skills = await skill.findByIdAndDelete(id)
            if (!skills) {
                return res.status(404).json({ message: "not found" })
            } {
                return res.status(200).json({ message: "id found and delete successfully", skills })
            }
  
        }catch(error){
            res.status(500).json({message:"internal error occured"})
        }
    }
}

module.exports=Skills