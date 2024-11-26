const mongoose = require("mongoose");
// schema = collection
const schema = mongoose.Schema;
const oid = schema.ObjectId;
const product = new schema({
    id:{type: oid},
    tensp:{
        type: String,
    },
    gia:{type:Number},
    soLuong:{type:Number},
    categoryID:{type:oid, ref: "category"},
});
// Neu khong ton tai cac thuoc tinh tren thi tu tao user
// Neu co ton tai cac thuoc tinh tren thi se tu dong lien ket voi collection do
module.exports = mongoose.model.product || mongoose.model("product", product);