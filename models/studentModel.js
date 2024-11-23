const mongoose = require("mongoose");
const schema = mongoose.Schema;
const oid = schema.ObjectId;
const student = new schema({
    id:{type: oid},
    mssv:{type:String},
    hoTen:{type: String},
    diemTrungBinh:{type: Number},
    boMon:{type:String},
    tuoi:{type:Number},
});
module.exports = mongoose.model.student || mongoose.model("student", student);