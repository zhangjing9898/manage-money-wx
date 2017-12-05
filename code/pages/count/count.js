// pages/count/count.js
const requestUrl = require('../../config').requestUrl
var requestYear = new Date().getFullYear()
var requestMonth = (("0" + (new Date().getMonth() + 1)).slice(-2))

var getCountList = function (that,Requrl) {
  var userId = that.data.userInfo.nickName;
  console.log(Requrl);
  wx.request({
    url: Requrl,
    method: "POST",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
      // "Content-Type": "application/json"
    },
    data: {
      "wechatname": userId
    },

    success: function (res) {
      console.log(res.data);
      if (res.statusCode == '200') {
        that.setData({
          listAll: res.data
        })
      }
      else {
        wx.showToast({
          title: '保存失败',
          image: "../../images/icon-no.png",
          mask: true,
          duration: 1000
        })
      }
    }
  })
}

Page({
  data: {
    listAll: [],
    listCat: [],
    listInc: [],

    optionColorId: 3
  },

  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    var app = getApp()
    app.getUserInfo(function (userInfo) {
      //更新数据
      console.log(userInfo);
      that.setData({
        userInfo: userInfo
      })
    })

    getCountList(that, "http://127.0.0.1:3000/today")
  },

  bindDetail: function (e) {
    var id = e.target.dataset.id;
    var app = getApp();
    app.detailId = id;
    wx.navigateTo({
      url: '../detail/detail'
    })
  },

  //分类查看
  bindOptionTap: function (e) {
    var that = this
    that.setData({
      optionColorId: e.target.id
    })

    switch (e.target.id) {
      case '1':
        console.log("全部");
        getCountList(that,"http://127.0.0.1:3000/all")
        break;

      case '2':
        // requestYear = '2017'
        // requestMonth = '00'
        console.log("周消费")
        getCountList(that,"http://127.0.0.1:3000/week")
        break;

      case '3':
        // requestYear = new Date().getFullYear()
        // requestMonth = (("0" + (new Date().getMonth() + 1)).slice(-2))
        console.log("当日明细");
        getCountList(that,"http://127.0.0.1:3000/today");
        break;
    }
  },

 

  bindCat: function (e) {
    wx.navigateTo({
     
    })
  }
})