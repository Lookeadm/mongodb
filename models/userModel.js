const mongoose = require("mongoose");
// schema = collection
const schema = mongoose.Schema;
const oid = schema.ObjectId;
const user = new schema({
    id:{type: oid},
    username:{
        type: String,
    },
    password:{type:String},
    fullname:{type:String},
    age:{type:Number},
});
// Neu khong ton tai cac thuoc tinh tren thi tu tao user
// Neu co ton tai cac thuoc tinh tren thi se tu dong lien ket voi collection do
module.exports = mongoose.model.user || mongoose.model("user", user);