var express = require('express');
var router = express.Router();

const studentModel = require("../models/studentModel");

// - Lấy toàn bộ danh sách sinh viên
//localhost:3000/students/all
router.get('/all', async function (req, res) {
    try {
        var list = await studentModel.find();
        res.status(200).json(list);
    } catch (e) {
        res.status(400).json({ status: false, message: "Error" });
    }
});
//localhost:3000/students/get-bo-mon?khoa=CNTT
// - Lấy toàn bộ danh sách sinh viên thuộc khoa CNTT
router.get('/get-bo-mon', async function (req, res) {
    try {
        const { khoa } = req.query;
        var list = await studentModel.find({ boMon: { $eq: khoa } });
        res.status(200).json(list);
    } catch (e) {
        res.status(400).json({ status: false, message: "Error" + e });
    }
});
//localhost:3000/students/get-diem?min=6.5&max=8.5
// - Lấy danh sách sản phẩm có điểm trung bình từ 6.5 đến 8.5
router.get('/get-diem', async function (req, res) {
    try {
        const { min, max } = req.query;
        var list = await studentModel.find({ diemTrungBinh: { $gte: min, $lte: max } });
        res.status(200).json(list);
    } catch (e) {
        res.status(400).json({ status: false, message: "Error" });
    }
});
//localhost:3000/students/get-thong-tin/
// - Tìm kiếm thông tin của sinh viên theo MSSV
router.get('/get-thong-tin', async function (req, res) {
    try {
        const { code } = req.query;
        var detail = await studentModel.find({mssv : {$eq: code}});

        if (detail) {
            res.status(200).json(detail);
        }
        else {
            res.status(400).json({ status: true, message: "Not Found" });
        }
    } catch (e) {
        res.status(400).json({ status: false, message: "Error" + e});
    }
});
//localhost:3000/students/them
// - Thêm mới một sinh viên mới
router.post('/them', async function (req, res) {
    try {
        const {mssv, hoTen, diemTrungBinh, boMon, tuoi} = req.body;
        const newStudent = {hoTen, diemTrungBinh, boMon, tuoi, mssv};
        await studentModel.create(newStudent);
        res.status(200).json({status: true, message:"Successfully"});
    } catch (e) {
        res.status(400).json({ status: false, message: "Error" });
    }
});
// - Thay đổi thông tin sinh viên theo MSSV
//localhost:3000/students/thay-doi
router.put('/thay-doi', async function (req, res) {
    try {
        const {id, mssv, hoTen, diemTrungBinh, boMon, tuoi} = req.body;
        var studentUpdate = await studentModel.findById(id);
        if(studentUpdate){
            studentUpdate.hoTen = hoTen ? hoTen:studentUpdate.hoTen;
            studentUpdate.diemTrungBinh = diemTrungBinh ? diemTrungBinh:studentUpdate.diemTrungBinh;
            studentUpdate.boMon = boMon ? boMon:studentUpdate.boMon;
            studentUpdate.tuoi = tuoi ? tuoi:studentUpdate.tuoi;
            studentUpdate.mssv = mssv ? mssv:studentUpdate.tuoi;
            await studentUpdate.save();
            res.status(200).json({status: true, message:"Successfully"});
        }
        else{
            res.status(300).json({status: true, message:"Not found"});
            }
    } catch (e) {
        res.status(400).json({ status: false, message: "Error" + e});
    }
});
// - Xóa một sinh viên ra khỏi danh sách
//localhost:3000/students/xoa/
router.delete('/xoa/:id', async function (req, res) {
    try {
        const {id} = req.params;
        await studentModel.findByIdAndDelete(id);
        res.status(200).json({ status:true, message:"Successfully delete"});
    } catch (e) {
        res.status(400).json({ status: false, message: "Error" });
    }
});
// - Lấy danh sách các sinh viên thuộc BM CNTT và có DTB từ 9.0
//localhost:3000/students/get-ds-hai-dieu-kien?BM=CNTT&DTB=9.0
router.get('/get-ds-hai-dieu-kien', async function (req, res) {
    try {
        const {BM, DTB} = req.query;
        var list = await studentModel.find({$and: [{diemTrungBinh: {$gte: DTB}}, {boMon: {$eq: BM}}]});
        res.status(200).json(list);
    } catch (e) {
        res.status(400).json({ status: false, message: "Error" });
    }
});
// - Lấy ra danh sách các sinh viên có độ tuổi từ 18 đến 20 thuộc CNTT có điểm trung bình từ 6.5
//localhost:3000/students/get-ds-ba-dieu-kien?DTB=6.5&BM=CNTT&ageMin=18&ageMax=20
router.get('/get-ds-ba-dieu-kien', async function (req, res) {
    try {
        const {BM, DTB, ageMin, ageMax} = req.query;
        var list = await studentModel.find({$and: [{diemTrungBinh: {$gte: DTB}}, {boMon: {$eq: BM}}, {tuoi: {$gte: ageMin, $lte: ageMax}}]});
        res.status(200).json(list);
    } catch (e) {
        res.status(400).json({ status: false, message: "Error" });
    }
});
// - Sắp xếp danh sách sinh viên tăng dần theo dtb
//localhost:3000/students/sort
router.get('/sort', async function (req, res) {
    try {
        var list = await studentModel.find().sort({diemTrungBinh: 1 }); 
        res.status(200).json(list);
    } catch (e) {
        res.status(400).json({ status: false, message: "Error" + e});
    }
});
// - Tìm sinh viên có điểm trung bình cao nhất thuộc BM CNTT
//localhost:3000/students/sort-class?BM=CNTT
router.get('/sort-class', async function (req, res) {
    try {
        const {BM} = req.query;
        var list = await studentModel.findOne({boMon: {$eq: BM}}).sort({diemTrungBinh: -1 });
        const listMax = await studentModel.find({diemTrungBinh: list.diemTrungBinh})
        res.status(200).json(listMax);
    } catch (e) {
        res.status(400).json({ status: false, message: "Error" });
    }
});
module.exports = router;