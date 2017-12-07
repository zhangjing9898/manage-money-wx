var express = require("express");
var app = express();
var router = require("./router/router.js");

var session = require('express-session');

//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

//模板引擎
app.set("view engine","ejs");
//静态页面
app.use(express.static("./public"));
app.use("/avatar",express.static("./avatar"));
//路由表
app.post("/new",router.new);                //记一笔
app.post("/today",router.today);            //当日明细
app.post("/week",router.week);              //最近一周的消费
app.post("/all",router.all);                //全部消费明细
app.post("/products",router.products);      //理财产品推荐
app.post("/balance",router.balance);        //余额计算
app.post("/detail",router.detail);          //单笔消费详情
app.post("/delete",router.delete);          //删除单笔消费
app.listen(3000);
