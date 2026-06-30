const Contact = require("../models/contact")

class Contactt {

    static CreateContact = async (req, res) => {
        try {
            const { name, email, subject, message } = req.body
           // console.log(req.body);
            
            if (!name || !email || !subject || !message) {
                return res.status(400).json({ message: "all fields are required" })
            }
            const contact = await Contact.create(req.body)
            return res.status(201).json({ message: "contact is created", contact })
        }
         catch (error) {
            res.status(500).json({ message: "internal server error" })
         }
    }

    static getALLcontact=async(req,res)=>{
        try{
            const contact=await Contact.find()
            if(!contact){
                return res.status(404).json({message:"contact list not found"})
            }
                return res.status(200).json({message:"contact found",contact})
        }catch(error){
            res.status(500).json({
                message:"internal error occured"
            })
        }
    }


}

module.exports = Contactt