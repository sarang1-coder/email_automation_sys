const express=require("express");
const router=express.Router();
const user=require("../controller/user_controller");


router.post('/register',user.sendInfo);



module.exports=router;