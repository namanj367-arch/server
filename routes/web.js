const express=require("express")
const router=express.Router()
const auth=require("../middleware/auth")
const AdminController=require("../controllers/AdminController")
const ContactController=require("../controllers/ContactController")
const ProjectController=require("../controllers/ProjectController")
const SkillController=require("../controllers/SkillController")
const Usercontroller = require("../controllers/Usercontroller")
const HeroController = require("../controllers/HeroController")
const AboutController = require("../controllers/AboutController")
const ServiceController=require("../controllers/ServiceController")


//Adminroutes
router.post("/register",AdminController.register)
router.post("/login", AdminController.login)
router.get("/getprofile", auth, AdminController.getprofile)
router.get("/logout", auth, AdminController.logout)
router.put("/update/:id", auth,AdminController.Updateprofile)
router.put("/changepassword",auth, AdminController.changePassword)


//Conatctroutes
router.post("/createcontact", ContactController.CreateContact)
router.get("/getcontact",ContactController.getALLcontact)


//Skillsroutes
router.post("/createskill", SkillController.Createskill)
router.get("/getskills",SkillController.getallskills)
router.put("/updateskill/:id",SkillController.Updateskills)
router.delete("/delete/:id", SkillController.Deleteskills)



//Projectroutes
router.post("/createproject",ProjectController.CreateProject)
router.get("/getALLproject",ProjectController.getAllproject)
router.get("/getSingleproject/:id",ProjectController.getSingleproject)
router.put("/updateproject/:id", ProjectController.UpdateProject)
router.delete("/deleteproject/:id", ProjectController.Deleteproject)



//Userroutes
router.post("/createuser",Usercontroller.createuser)
router.get("/getuser", Usercontroller.getuser)
router.put("/updateuser/:id", Usercontroller.updateuser)
router.delete("/deleteuser/:id", Usercontroller.deleteuser)


//hero
router.post("/createhero", HeroController.createHero)
router.get("/getALLHero", HeroController.getAllHero)
router.get("/getsinglehero/:id", HeroController.getSingleHero)
router.put("/updateee/:id", HeroController.updateHero)
router.delete("/deletehero/:id", HeroController.deleteHero)



//about
router.post("/about", AboutController.createabout)
router.get("/getabout", AboutController.getabout)
router.put('/updateeabout/:id', AboutController.updateabout)
router.delete('/deleteabout/:id', AboutController.deleteabout)


//service
router.post('/createservice', ServiceController.createService)
router.get('/getAllServices', ServiceController.getServices)
router.put('/updateService/:id', ServiceController.updateService)
router.delete('/deleteService/:id', ServiceController.deleteService)

module.exports=router