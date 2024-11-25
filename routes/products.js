var express = require('express');
var router = express.Router();
const productModel = require("../models/productModel");
var upload = require('../until/uploadConfig');
var sendMail = require('../until/mailConfig');
const fs = require('fs');
const path = require('path');
const JWT = require('jsonwebtoken');
const config = require("../until/tokenConfig");
//- Lấy danh sách tất cả các sản phẩm
router.get("/all", async function (req, res) {
  try {
    //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzMyMTYwNjU1LCJleHAiOjE3MzIxNjA2ODV9.IAy9hVwgr5BjVjAza9yNXCLVwHgw94CscB3Ncvhe17g
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ "status": 403, "err": err });
        } else {
          //xử lý chức năng tương ứng với API
          var list = await productModel.find().populate("userID");//Lay tat ca
          res.status(200).json(list);
        }
      });
    } else {
      res.status(401).json({ "status": 401 });
    }
  } catch (e) {
    res.status(400).json({ status: false, message: "Error" });
  }
});
//- Lấy thông tin chi tiết của sản phẩm
router.get("/detail/:id", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ "status": 403, "err": err });
        } else {
          //xử lý chức năng tương ứng với API
          const { id } = req.params;
          var detail = await productModel.findById(id);

          if (detail) {
            res.status(200).json(detail);
          }
          else {
            res.status(400).json({ status: true, message: "Error" })
          }
        }
      });
    } else {
      res.status(401).json({ "status": 401 });
    }

  } catch (e) {
    res.status(400).json({ status: false, meassage: "Error" + e });
  }
});
//- Lấy danh sách tất cả các sản phẩm có số lượng lớn hơn 20
router.get("/get-ds-lon-hon", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ "status": 403, "err": err });
        } else {
          //xử lý chức năng tương ứng với API
          const { number } = req.query;
          var list = await productModel.find({ soLuong: { $gt: number } });
          res.status(200).json(list);
        }
      });
    } else {
      res.status(401).json({ "status": 401 });
    }

  } catch (e) {
    res.status(400).json({ status: false, message: "Error" });
  }
});
//- Lấy danh sách sản phẩm có giá từ 20000 đến 50000
router.get("/get-ds-trong-khoang", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ "status": 403, "err": err });
        } else {
          //xử lý chức năng tương ứng với API
          const { min, max } = req.query;
          var list = await productModel.find({ gia: { $gte: min, $lte: max } });
          res.status(200).json(list);
        }
      });
    } else {
      res.status(401).json({ "status": 401 });
    }  
  } catch (e) {
    res.status(400).json({ status: false, message: "Error" });
  }
});
//- Lấy danh sách sản phẩm có số lượng nhỏ hơn 10 hoặc giá lớn hơn 15000
router.get("/get-ds-trong-khoang2", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ "status": 403, "err": err });
        } else {
          //xử lý chức năng tương ứng với API
          const { nhohon, lonhon } = req.query;
          var list = await productModel.find({ $or: [{ soLuong: { $lte: nhohon } }, { gia: { $gte: lonhon } }] });
          res.status(200).json(list);
        }
      });
    } else {
      res.status(401).json({ "status": 401 });
    }
  } catch (e) {
    res.status(400).json({ status: false, message: "Error" });
  }
})
//Thêm
router.post("/add", async function (req, res) {
  try {
    const { tensp, gia, soLuong } = req.body;
    const newItem = { tensp, gia, soLuong };
    await productModel.create(newItem);
    res.status(200).json({ status: true, message: "Successfully" });
  } catch (e) {
    res.status(400).json({ status: false, message: "Error" });
  }
});
router.put("/edit", async function (req, res) {
  try {
    const { id, tensp, gia, soLuong } = req.body;
    var itemUpdate = await productModel.findById(id);

    if (itemUpdate) {
      itemUpdate.tensp = tensp ? tensp : itemUpdate.tensp;
      itemUpdate.gia = gia ? gia : itemUpdate.gia;
      itemUpdate.soLuong = soLuong ? soLuong : itemUpdate.soLuong;
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
    await productModel.findByIdAndDelete(id);
    res.status(200).json({ status: true, message: "Successfully delete" });
  } catch (e) {
    res.status(400).json({ status: false, message: "Error" });
  }
});
//Upload ảnh
router.post('/upload', [upload.single('image')],
  async (req, res, next) => {
    try {
      const { file } = req;
      if (!file) {
        return res.json({ status: 0, link: "" });
      } else {
        const url = `http://localhost:3000/images/${file.filename}`;
        return res.json({ status: 1, url: url });
      }
    } catch (error) {
      console.log('Upload image error: ', error);
      return res.json({ status: 0, link: "" });
    }
  });
//upload nhieu file
router.post("/uploads", [upload.array('image', 9)],
  async (req, res, next) => {
    try {
      const { files } = req;
      if (!files) {
        return res.json({ status: 0, link: [] });
      }
      else {
        const url = [];
        for (const singleFile of files) {
          url.push(`http://localhost:3000/images/${singleFile.filename}`);
        }
        return res.json({ status: 1, url: url });
      }
    } catch (e) {
      console.log('Upload image error: ', error);
      return res.json({ status: 0, link: [] });
    }
  });
//Gửi mail
const pathHTML = path.resolve('./routes/index.html');
var content = fs.readFileSync(pathHTML);
router.post("/send-mail", async function (req, res, next) {
  try {
    const { to, subject } = req.body;

    const mailOptions = {
      from: "namnguyen <nguyennhatnam5122004@gmail.com>",
      to: to,
      subject: subject,
      html: content
    };
    await sendMail.transporter.sendMail(mailOptions);
    res.json({ status: 1, message: "Gửi mail thành công" });
  } catch (err) {
    res.json({ status: 0, message: "Gửi mail thất bại" + err });
  }
});

router.get("/news", function(req, res){
  try{
  res.json({new:"true"});
  }catch(e){
    res.status(400).json({ status: false, message: "Error" + e });
  }
})
module.exports = router;
