
const { Router } = require("express");

//express설정을 해준다.
const express = require("express");

//라우터 객체생성해준다.
const router = express.Router();

//디비모듈 받아와준다.
const accounts = require("../collection/dbaccount");
const articles = require("../collection/dbarticles");

//메소드 포스트에서 바디를 불어와줘야함.
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

const uuid = require("uuid")


router.get("/account/idcheck", async (req, res) => {
    let found = await accounts.findById(req.query.id);
    console.log(found)


    if (found) {
        //겹치는게 있는 조건
        res.json({ "success": true })

    } else {
        //겹치는게 없는 조건
        res.json({ "success": false })
    }

})



//댓글등록해주기 구현
//배열에 푸시해주기.

router.post("/details/comment", async (req, res) => {
    //코멘트를 등록했을 때 받아오는 원글의 아이디값
    let targetId = req.body.targetid;
    
    //임의로 유니크한 아이디생성해주기. ->시리얼번호를 만들어둔것.
    let id = uuid.v4().split("-")[0];
    
    //고유키값을 작성하는 것
    //얘는 출력을 해야하는 값들
    let comment = {
        _id: id,
        commentId: req.session.user.id,
        commentName: req.session.user.name,
        commentImg: req.session.user.image,
        comment: req.body.comment,
        creatAt: new Date()
    }
    
    //매개변수는 db에서 써준 순서대로 써줘야함. 안그러면 순서가 바껴서 다른걸 찾아준다.
    articles.addComment(targetId,comment)

    
    
    let found = await articles.findById(targetId);

    let obj = {
        "success": true,
        "comments": comment
    }


    res.json(comment);


})








module.exports = router;