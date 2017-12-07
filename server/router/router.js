/**
 * Created by Danny on 2015/9/26 15:39.
 */
var formidable = require("formidable");
var db = require("../models/db.js");
var md5 = require("../models/md5.js");
var path=require("path");
var fs = require("fs");
var gm = require("gm");
var sd = require("silly-datetime");
var  ObjectId = require('mongodb').ObjectID;


var resultMoney=0.0;
var preDate=null;
//记一笔
exports.new = function (req, res, next) {
    var todayDate = sd.format(new Date(), 'YYYY-MM-DD');
    //得到用户填写的东西
    var form = new formidable.IncomingForm();
    if(preDate==null){
        preDate=todayDate;
    }
    form.parse(req, function (err, fields, files) {
        // console.log(fields);
        res.send("1");
        //得到表单之后做的事情
        var username = fields.wechatname;
        var detailId=fields.detailId;
        var date = fields.date==null?todayDate:fields.date;
        var style=fields.style==null?"":fields.style;
        var type=fields.type==null?"投资理财":fields.type;
        var title=fields.title==null?"投资理财":fields.title;
        var changed=fields.changed==undefined?parseFloat(fields.putMoney):parseFloat(fields.changed);
        var detail=fields.detail==null?'未填写消费细节':fields.detail;
        // var putMoney=fields.putMoney==null?0:fields.putMoney;

        //计算当日消费
        if(type=="支出"||type=="投资理财"){
            changed=0-changed;
        }
        if(type=="收入"){
            changed=0+changed;
        }

        //计算
        if(preDate!=date){
            resultMoney=0.0;
            preDate=todayDate;
        }
        if(preDate==date){
            resultMoney=resultMoney+changed;
        }
        // console.log(resultMoney);
        //_id是否存在
        db.find("money", { "_id" : ObjectId(detailId)}, function (err, result) {

            if (result.length != 0) {
                //有，就更改
                db.updateMany("money", { "_id" : ObjectId(detailId)}, {$set: { "date": date,
                    "style": style,
                    "type": type,
                    "title": title,
                    "changed": changed,
                    "detail": detail}}, function (err, result) {
                    // res.send("1");
                })
                return;
            }

            db.insertOne("money", {
                "username": username,
                "date": date,
                "style": style,
                "type": type,
                "title": title,
                "changed": changed,
                "detail": detail
            }, function (err, result) {
                if (err) {
                    res.send("-3"); //服务器错误
                    return;
                }
                //检查该数据库中是否存了那天的
                db.find("allToday", {"date": date}, function (err, result) {
                    if (err) {
                        // res.send("-3"); //服务器错误
                        return;
                    }
                    if (result.length != 0) {
                        //有，就更改
                        db.updateMany("allToday", {"date": date}, {$set: {"changed": resultMoney}}, function (err, result) {
                            // res.send("1");
                        })
                        return;
                    }
                    //没有就插入
                    db.insertOne("allToday", {
                        "username": username,
                        "date": date,
                        "changed": resultMoney
                    }, function (err, result) {
                        if (err) {
                            // res.send("-3");
                            return;
                        }
                    })
                })
            })
        })
    });
};

//获取当日清单
exports.today=function (req,res,next) {
    //得到用户填写的东西
    var form = new formidable.IncomingForm();
    var todayDate = sd.format(new Date(), 'YYYY-MM-DD');
    form.parse(req, function (err, fields, files) {
        // console.log(fields);
        var username=fields.wechatname;
        db.find("money",{"username":username,"date":todayDate},{"sort":{"_id":-1}},function (err, result) {
            res.json(result);
        })
    });
};

//计算消费 获取最近一周的清单
exports.week=function (req,res,next) {
    //得到用户填写的东西
    var form = new formidable.IncomingForm();
    var todayDate = sd.format(new Date(), 'YYYY-MM-DD');
    form.parse(req, function (err, fields, files) {
        // console.log(fields);
        var username=fields.wechatname;
        db.find("allToday",{},{"pageamount":3,"sort":{"_id":-1}},function(err,result){
            res.json(result);
        });
    });
};

//获取全部消费
exports.all=function (req,res,next) {
    //得到用户填写的东西
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        // console.log(fields);
        var username=fields.wechatname;
        db.find("allToday",{"username":username},function (err, result) {
            res.json(result);
        })
    });
}

//计算用户的余额
exports.balance=function (req,res,next) {
    //得到用户填写的东西
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        var balance=0;
        var username=fields.wechatname;
        var putMoney=fields.putMoney==null?0:fields.putMoney;
        // console.log("putMoney"+putMoney);
        db.find("allToday",{"username":username},function (err, result) {
            for(var i =0;i<result.length;i++){
                balance=balance+result[i].changed;
            }
            //记录余额
            db.find("userBalance", {"username": username}, function (err, result) {
                if (err) {
                    // res.send("-3"); //服务器错误
                    return;
                }
                if (result.length != 0) {
                    //有，就更改
                    db.updateMany("userBalance", {"username": username},{$set:{"balance":balance}},function (err,result) {
                        // res.send("1");
                    })
                }else{
                    //没有就插入
                    db.insertOne("userBalance",{
                        "username":username,
                        "balance":balance
                    },function (err, result) { if(err){

                    } })
                }

            var resultBalance={
                "balance":balance
            }
            res.json(resultBalance);
            })
        })
    });
}

//获取理财产品
exports.products=function (req,res,next) {
    //得到用户填写的东西
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var username=fields.wechatname;
        //得到用户余额
        var calculateRate="0.096";
        db.find("userBalance",{"username":username},function (err,result) {
            calculateRate=result.balance>10000?"0.096":"0.12"
        })
        // console.log(calculateRate);
        db.find("products",{"rate":calculateRate},function (err, result) {
            // console.log(result);
            res.json(result);
        })
    });
}

//单笔消费详情
exports.detail=function (req,res,next) {
    //得到用户填写的东西
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var username=fields.wechatname;
        var detailId=fields.detailId;

        db.find("money",{ "_id" : ObjectId(detailId)},function (err, result) {
            console.log(result);
            res.json(result);
        })
    });
};

//删除单笔消费
exports.delete=function (req,res,next) {
    //得到用户填写的东西
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var detailId=fields.detailId;
        db.deleteMany("money",{ "_id" : ObjectId(detailId)},function (err, result) {
            // console.log(result);
            res.send("1");
        })
    });
};