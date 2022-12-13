
const express = require("express");
const router = express.Router(); 

router.use(express.urlencoded({ extended: false })); //바디세팅
const fs = require("fs");
const path = require("path")

const accounts = require("../collection/dbaccount");
const multer = require("multer") //멀터세팅

router.use((req,res,next)=>{
    if(!req.session.auth){
        return res.redirect("/account/signin");
    }
    next();
})

router.get("/myinfo", (req, resp)=>{
    resp.render("myinfo", {user : req.session.user});
});

router.get("/exit", (req, res)=>{
    req.session.authUser = null;
    // req.session.destroy();
    res.redirect("/account/signin");
});

const profileUpload=multer({
storage: multer.diskStorage({
    destination:(req,file,callback)=>{//destination->파일을 어디에 저장을 할건지 콜백으로 넘겨줘야함.
        const uploadPath = path.join(__dirname,"..","static","profile",req.session.user.id);
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath)
        }
        callback(null, uploadPath);
    },

    filename:(req,file,callback)=>{//저장할 때 파일이름 설정해주는 값
        let newName = Date.now() +"."+ file.originalname.split(".")[1];

        callback(null, newName);
    }
   
})
});

router.get("/profile",(req,res)=>{
    res.render("profile",{user : req.session.user})
});


router.post("/profile",profileUpload.single("profile"), async (req,res)=>{
    console.log(req.file);
    const url = `/profile/${req.session.user.id}/${req.file.filename}`
    //사진url 경로 직접 작성해주기.(스태틱X)
    let rst = await accounts.updateUserImg(req.session.user.id, url)//아이디랑 url 추가해주기
    req.session.user=await accounts.findById(req.session.user.id)
    res.redirect("/user/profile");
})

module.exports = router;