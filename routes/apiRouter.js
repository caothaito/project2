var express = require("express")
var api = express.Router()
var path = require('path')
var db = require('../config/mongDB')
var bcrypt = require('bcrypt')
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken')
var sendMail = require('./sendMail')
var meddlew = require('../model/middwer')
const saltRounds = 10;



// dang ki
api.post("/sign-up", function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;

    db.findOne({
            email
        })
        .then(function (checkEmail) {
            if (checkEmail) {
              return  res.json('da ton tai')

            }
            bcrypt.hash(password, saltRounds, function (err, hash) {
                db.create({
                    email: email,
                    password: hash
                }).then(function (data) {
                    let token = jwt.sign({
                        id: data._id
                    }, 'caothaito', {
                        expiresIn: "1h"
                    })
                    console.log(token);
                    sendMail('vukind@gmail.com', 'THU XAC NHAN', `link xac nhan <a href="${req.protocol}://${req.get('host')}/authEmail/${token}">here</a>`)
                   res.json(`${req.protocol}://${req.get('host')}/api/authEmail/${token}`);
                })
            })

        }).catch(function (err) {
            console.log(err);
        })
})

api.get('/authEmail/:token', function (req, res, next) {
    try {
     let token = req.params.token;
     let decoded = jwt.verify(token, 'caothaito')
     console.log(decoded);
     db.findByIdAndUpdate({_id:decoded.id},{$set:{status:'active'}})
     .then(function(data){
         if(data){
             res.json('active thành công')
         }else{
         res.json('lỗi')
         }
     })
 
    }catch (error) {
        res.json(error)
    }
 })

api.post('/sign', function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;

    db.find({
        email: req.body.email,
    }).then(function (data) {
    
        if (data.length==0) {
            res.json('khong thanh cong')
        }if(data[0].status == 'active'){
            bcrypt.compare(password, data[0].password, function (err, value) {
              
                if (err) {
                    res.json(err)
                }
                if (value) {
                
                    let token = jwt.sign({
                        data: data[0].email
                    }, "caothaito", {
                        expiresIn: "2d"
                    })
                    res.json(token)
                }
            })
        }
     
    })
})

// phan quyen

api.get("/check",meddlew.traVe,function(req,res,next){
    db.find({
        email: req.body.email,
        password: req.body.password
    })
    .then(function(data){
        if(data[0].type == 1){
            // res.sendFile(path.json(__dirname,''))
            res.json('la admin')
        }else{
            res.json('nhan vien')
        }
    })
})

api.get('/tonken',meddlew.traVe,function(req,res,next){
    let user = res.local;
    res.json(user)
 })
 
 
 api.get('/checkAdmin',meddlew.checkAdmin,function(req,res,next){
  res.json('ban la admin')
  })
 




module.exports = api;