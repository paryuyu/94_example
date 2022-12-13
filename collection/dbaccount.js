//디비모듈만들어줘야함.

const mongodb = require("mongodb");

const uri = "mongodb+srv://mernyuyu:wkdrnahr777@cluster0.qeg74yn.mongodb.net/test";


function connect() {
    return new mongodb.MongoClient(uri).db("test").collection("accounts");
}

async function insertOne(obj) {
    const accounts = connect();
    let result = await accounts.insertOne(obj) //객체가 나옴
    return result; //액놀리지값만 리턴을 시킨다.
}

async function findById(value) {
    const accounts = connect();
    return await accounts.findOne({id:value}); 
}

async function deleteById(id) { //도큐먼트 아이디로 지우는 방법

    const accounts = connect();
    let result = await accounts.deleteOne({ "_id": new mongodb.ObjectId(id) });
    return result;

}

async function updateUserImg(userId, url){
  return await connect().updateOne({id: userId},{
        $set:{
            "image":url
        }});
}



module.exports = { //모듈화 시킨 객체들을 익스포츠 시켜놓기.
    insertOne,findById,deleteById,updateUserImg
}