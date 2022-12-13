
const express = require("express");
const fs = require("fs");
const path = require("path")
const router = express.Router();

router.use(express.urlencoded({ extended: false })); //바디세팅

const accounts = require("../collection/dbaccount");
const articles = require("../collection/dbarticles");

const multer = require("multer"); //멀터세팅
const { emitKeypressEvents } = require("readline");




router.use((req, res, next) => {
    if (!req.session.auth) {
        return res.redirect("/account/signin");
    }
    next();
})


router.get("/home", async (req, res) => {
    let array = await articles.findAll();
    array = array ?? [];
    array = array.filter(elm => {
        return (elm.writer == req.session.user.id) ||
            (elm.writer !== req.session.user.id && elm.checked === "public")
    })

    res.render("article", { array })
})



router.get("/details", async (req, res) => {
    let obj = await articles.findById(req.query.id);
    console.log(obj);
    res.render("articleDetail", { obj })
})




/*
router.route("/details")
.get(async(req,res)=>{
    let obj = await articles.findById(req.query.id);
    res.render("articleDetail",{obj})
})
.post(async(req,res)=>{
    let obj={
        "maintext":req.body.maintext,
        "writer":req.session.user.id,
        "name":req.session.user.name,
        "profileImg": req.session.user.image,
        "createAt":Date.now(),
        "url":url,
        "comments":[]
    }

    let result=await 
})
    */




const imgfileUpload = multer({
    storage: multer.diskStorage({ //diskStorage는 하드디스크에 업로드 파일을 저장
        destination: (req, file, callback) => { //저장할 경로
            const uploadPath = path.join(__dirname, "..", "static", "article");
            callback(null, uploadPath);
        },

        filename: (req, file, callback) => {//저장할 파일명 설정

            let newName = Date.now() + "." + file.originalname.split(".")[1];
            callback(null, newName);
        }
    })
});


//single은 file의 네임(바디값) 
router.post("/upload", imgfileUpload.single("Img"), async (req, res) => {
    console.log(req.file, '--------------------reqqpoweiruqoiuewroqiuewro')
    if (req.file && req.file !== undefined) {
        const url = `/article/${req.file.filename}` //이미지 파일경로
        const item = {
            "maintext": req.body.maintext,
            "checked": req.body.check ?? "public", //체크박스 선택하면 쿼리파람으로 전달하고, 체크안하면 전달X 안왔을때는 type이 public

            "writer": req.session.user.id,
            "name": req.session.user.name,
            "profileImg": req.session.user.image,

            "createAt": Date.now(),
            "url": url,
            "comments": []
        }

        //어카운츠에 있는 세션아이디값 불러와서 아티클에서 쓰려고 함.
        req.session.user = await accounts.findById(req.session.user.id);

        let rst = await articles.insertArticle(item);
        let result = await articles.updateUserImg(req.session.user.id, url);


        console.table(rst);
        console.table(result);


        res.redirect("/article/home");
    } else {
        const item = {
            "maintext": req.body.maintext,
            "checked": req.body.check ?? "public", //체크박스 선택하면 쿼리파람으로 전달하고, 체크안하면 전달X 안왔을때는 type이 public

            "writer": req.session.user.id,
            "name": req.session.user.name,
            "profileImg": req.session.user.image,

            "createAt": Date.now(),
            "comments": []
        }

        //어카운츠에 있는 세션아이디값 불러와서 아티클에서 쓰려고 함.
        req.session.user = await accounts.findById(req.session.user.id);

        let rst = await articles.insertArticle(item);

        console.table(rst);


        res.redirect("/article/home");
    } 
})













module.exports = router;