const mongoose = require("mongoose");
const schema = mongoose.Schema;
const oid = schema.ObjectId;
const category = new schema({
    id:{type: oid},
    tenDanhMuc:{
        type: String,
    },
});
// Neu khong ton tai cac thuoc tinh tren thi tu tao user
// Neu co ton tai cac thuoc tinh tren thi se tu dong lien ket voi collection do
module.exports = mongoose.model.category || mongoose.model("category", category);