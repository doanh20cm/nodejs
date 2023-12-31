const db = require("../models");
const config = require("../config/auth.config");
//const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
const md5 = require("md5");
const {
  QueryTypes
} = require('sequelize');
const {
  user
} = require("../models");
exports.signin = (req, res) => {
  const msv = req.body.username;
  const pwd = req.body.password;
  db.sequelize.query("CALL SP_DangNhap(:username,:password)", {
      replacements: {
        username: msv,
        password: md5(pwd)
        //password: pwd
      },
      type: QueryTypes.SELECT
    })
    .then(data => {
      if (!data[0]) {
        console.log(data);
        // var password = "0868609385"  
        // console.log("Normal password : ", password)
        console.log("Hashed password : ", md5(pwd))
        res.send(data[0]);
        return res.status(403).send({
          message: "Tài khoản hoặc mật khẩu không đúng."
        });

      } else {
        console.log(data);
        console.log("Hashed password : ", md5(pwd))
        //data[0]      
        var token = jwt.sign({
          User: data[0]
        }, config.secret, {
          expiresIn: 86400 // 24 hours

        });
        // // save user token
        user.token = token;

        // user
        // res.status(200).json(user);


        res.status(200).send({
          User: data[0],

          // email: user.email,
          // roles: authorities,
          accessToken: token
        });
      }
      // res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};