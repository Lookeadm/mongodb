var express = require('express');
var router = express.Router();

const userModel = require("../models/categoryModel");
const JWT = require('jsonwebtoken');
const config = require("../until/tokenConfig");
const categoryModel = require('../models/categoryModel');

router.get("/all", async function (req, res) {
    var list = await userModel.find();//Lay tat ca
    res.json(list);
});
router.post("/add", async function (req, res) {
    try {
        const { tenDanhMuc } = req.body;
        const newItem = { tenDanhMuc };
        await categoryModel.create(newItem);
        res.status(200).json({ status: true, message: "Successfully" });
    } catch (e) {
        res.status(400).json({ status: false, message: "Error" });
    }
});
router.put("/edit", async function (req, res) {
    try {
        const { id, tenDanhMuc } = req.body;
        var itemUpdate = await categoryModel.findById(id);

        if (itemUpdate) {
            itemUpdate.tenDanhMuc = tenDanhMuc ? tenDanhMuc : itemUpdate.tenDanhMuc;
            await itemUpdate.save();
            res.status(200).json({ status: true, message: "Successfully" });
        }
        else {
            res.status(300).json({ status: true, message: "Not found" });
        }
    } catch (e) {
        res.status(400).json({ status: false, message: "Error" });
    }
});
//Delete
router.delete("/delete/:id", async function (req, res) {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).json({ status: true, message: "Successfully delete" });
    } catch (e) {
        res.status(400).json({ status: false, message: "Error" });
    }
});