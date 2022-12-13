
const mongodb = require("mongodb");
const uri = "mongodb+srv://mernyuyu:wkdrnahr777@cluster0.qeg74yn.mongodb.net/test";



function connect() {
    return new mongodb.MongoClient(uri).db("test").collection("articles");
}


async function insertArticle(item) {
    const articles = connect();
    let result = await articles.insertOne(item) //객체가 나옴
    return result; //액놀리지값만 리턴을 시킨다.
}


async function updateUserImg(userId, url) {
    return await connect().updateOne({ id: userId }, {
        $set: {
            "image": url
        }
    });
}



async function addComment(targetId, data) {
    const articles = connect();
    return await articles.updateOne({ "_id": new mongodb.ObjectId(targetId)}, {
        $push: {
            "comments": data
        }
    });
}



async function findAll() {
    const articles = connect();
    return await articles.find({}).sort("createAt", -1).toArray();
}


async function findById(id) {
    const articles = connect();
    return await articles.findOne({"_id": new mongodb.ObjectId(id)}); 
}



async function deleteById(id) {
    const articles = connect();
    return await articles.deleteOne({ "_id": new mongodb.ObjectId(id) });

}










module.exports = { insertArticle, updateUserImg, findAll, deleteById,findById,addComment }