/*
이번주 목표 : 
-session을 이용한 사용자 인증
-multer middle 웨어를 이용한 파일 업로드 구현
-fetch를 이용한 비동기 데이터 통신


22/07/18 회원가입, 로그인 인증, 마이페이지 만들기


***회원가입 받기
(id, password, mail, contact, name, birth{year, month, day})

<accountRouter에서 처리>
get /signup -> 입력받기
post /signup -> 데이터 저장


***로그인 인증
get/signin post/signin

<accountRouter에서 처리>
{id, password}


***마이페이지
<userRouter에서 처리>

//userRouter는 인증받은 사용자만 올 수 있게 미들웨어 설정
//인증은 로그인인증 포스트일 때 유효한 사용자일때만 인증처리. ==>signin
//DB작업을 위한 모듈을 작성
*/


const express = require("express");
const session = require("express-session");
//세션관리 시 클라이언트에 쿠키를 보낸다.
//express-session은 req객체안에 req.session 객체를 만든다.

const app = express();
const path = require("path");

const uri = "mongodb+srv://mernyuyu:wkdrnahr777@cluster0.qeg74yn.mongodb.net/test"
//몽고디비에서 가져온 url



//포스트에서 바디 쓸 수 있게 설정
//ejs 세팅
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));


app.use(express.static(path.join(__dirname, "static"))); //스태틱 설정
app.use(session({secret:"P@sww0rd", //필수설정 -> 비밀키
resave : true, //요청이 왔을 때 세션에 수정사항이 생기지 않더라도 세션을 다시 저장할지 설정
saveUninitialized : true})); //세션에 저장할 내역이 없더라도 세션을 저장할지 설정(쿠키)


app.get("/",(req,res)=>{
  
  res.render("home",{})
})
//라우터파일들 불러와주는 미들웨어
//url경로, 리콰이어(파일경로) -> exports해준 라우터 파일을 불러와야함.
app.use("/account", require("./router/accountRoute"));
app.use("/user", require("./router/userRoute"));
app.use("/article", require("./router/articleRoute"));
app.use("/api", require("./router/apiRoute"));

app.listen(8080,()=>{console.log("server start")})