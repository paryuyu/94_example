
const { Router } = require("express");

//express설정을 해준다.
const express = require("express");

//라우터 객체생성해준다.
const router = express.Router();

//디비모듈 받아와준다.
const accounts = require("../collection/dbaccount");

//메소드 포스트에서 바디를 불어와줘야함.
router.use(express.urlencoded({ extended: false }));






router.route("/signup") //패스경로설정 --> /account/signup으로 설정해준건데, account는 app파일에서 설정해줌.

    .get((req, res) => {
        res.render("signup", { err: "" }) //signup이라는 ejs파일 렌더링해주기.
    })


    //액션을 걸어야함
    .post(async (req, res) => {

        let got = await accounts.findById(req.body.id);
        if (got) {
            res.render("signup", { err: "이미 사용중인 아이디입니다." })

        } else {
            
            const item = {
                id: req.body.id,
                password: req.body.password,
                mail: req.body.mail,
                contact: req.body.contact,
                name: req.body.name,
                birth: {
                    year: req.body.year,
                    mon: req.body.mon,
                    day: req.body.day
                }
            }

            let rst = await accounts.insertOne(item);
            console.log(rst);

            res.redirect("/account/signin")
        }

    })




router.route("/signin")
    .get((req, res) => {
        res.render("signin");
    })

    .post(async (req, res) => {
        let target = await accounts.findById(req.body.id);
        console.log(target)



        if (target && target.password == req.body.password) {
            req.session.auth = true;
            req.session.user = target;
            res.redirect("/user/myinfo");
        } else {
            res.status(401).render("signinErr");
        }
    })


//내보내기


module.exports = router;