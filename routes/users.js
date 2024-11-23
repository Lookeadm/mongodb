var express = require('express');
var router = express.Router();

const userModel = require("../models/userModel");
const JWT = require('jsonwebtoken');
const config = require("../until/tokenConfig");
//localhost:3000/users/all
/* GET users listing. */
router.get("/all", async function(req, res) {
  var list = await userModel.find({},"username age");//Lay tat ca
  res.json(list);
})
//localhost:3000/users/detail/?id=xxx&value2=xxxx
//localhost:3000/users/detail/xxx
// router.get("/detail", async function(req, res) {
//:id la du lieu truyen vao
router.get("/detail/:id", async function(req, res) {
  try{
    // const {id} = req.query;
    const {id} = req.params;
    var detail = await userModel.findById(id);
    
    if(detail){
      res.status(200).json(detail);
    }
    else{
      res.status(400).json({status: true, message:"Error"})
    }
  }catch(e){
    res.status(400).json({status: false, meassage:"Error"});
  }
});

//Lay danh sach co dieu kien
//localhost:3000/users/get-ds-trong-khoang?tuoi=xx
router.get("/get-ds", async function(req, res) {
  try{
    const {tuoi} = req.query;
    var list = await userModel.find({age: {$gt: tuoi}});
    res.status(200).json(list);
  }catch(e){
    res.status(400).json({status: false, message:"Error"});
  }
});
//localhost:3000/users/get-ds-trong-khoang?min=xx&max=xx
router.get("/get-ds-trong-khoang", async function(req, res) {
  try{
    const {min, max} = req.query;
    var list = await userModel.find({age: {$gte: min, $lte: max}});
    res.status(200).json(list);
  }catch(e){
    res.status(400).json({status: false, message:"Error"});
  }
})
router.get("/get-ds-trong-khoang", async function(req, res) {
  try{
    const {min, max} = req.query;
    var list = await userModel.find({age: {$gte: min, $lte: max}});
    res.status(200).json(list);
  }catch(e){
    res.status(400).json({status: false, message:"Error"});
  }
});

router.post("/login", async function (req, res) {
  try{
    const {username, password} = req.body;
    const checkUser = await userModel.findOne({username: username, password: password});
    if(checkUser==null){
      res.status(400).json({status: false, message:"Tên đăng nhập hoặc mật khẩu không đúng"});
    }
    else{
      var token = JWT.sign({username: username}, config.SECRETKEY, {expiresIn: "1m"});
      const refreshToken = JWT.sign({id: username._id},config.SECRETKEY,{expiresIn: '1h'})
      res.status(200).json({status: true, message:"Đăng nhập thành công" + " " + token});
    }
  }catch(e){
    res.status(400).json({status: false, message:"Error" + e});
  }
})

module.exports = router;
