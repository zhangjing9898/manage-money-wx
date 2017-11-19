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
      // if (res.data.ChinaValue[0].Result == 'True') {

      //   wx.setStorage({
      //     key: "IsUpdate",
      //     data: true
      //   })

      //   if (abID > 0) {
      //     wx.redirectTo({
      //       url: '../result/result?ID=' + abID
      //     })
      //   }
      //   else {
      //     wx.switchTab({
      //       url: '../index/index'
      //     })
      //   }
      // }
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
  // wx.request({
  //   url: "http://localhost:8080/ManageMoney/MoneyServlet?method=find",
  //   method: "POST",
  //   data: {
  //     Type: 'ALL',
  //     Year: requestYear,
  //     Month: requestMonth
  //   },
  //   success: function (res) {
  //     that.setData({
  //       listAll: res.data.ChinaValue
  //     })
  //   }
  // })

  // wx.request({
  //   url: requestUrl + 'wxCount.ashx',
  //   data: {
  //     Type: 'CAT',
  //     Year: requestYear,
  //     Month: requestMonth
  //   },
  //   success: function (res) {
  //     that.setData({
  //       listCat: res.data.ChinaValue
  //     })
  //   }
  // })

  // wx.request({
  //   url: requestUrl + 'wxCount.ashx',
  //   data: {
  //     Type: 'INC',
  //     Year: requestYear,
  //     Month: requestMonth
  //   },
  //   success: function (res) {
  //     that.setData({
  //       listInc: res.data.ChinaValue
  //     })
  //   }
  // })
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

    getCountList(that, "http://localhost:8080/ManageMoney/MoneyServlet?method=find")
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
        getCountList(that,"http://localhost:8080/ManageMoney/MoneyServlet?method=weekend")
        break;

      case '2':
        // requestYear = '2017'
        // requestMonth = '00'
        console.log("周消费")
        getCountList(that,"http://localhost:8080/ManageMoney/MoneyServlet?method=weekend")
        break;

      case '3':
        // requestYear = new Date().getFullYear()
        // requestMonth = (("0" + (new Date().getMonth() + 1)).slice(-2))
        console.log("当日明细");
        getCountList(that,"http://localhost:8080/ManageMoney/MoneyServlet?method=today")
        break;
    }
  },

  bindAll: function (e) {
    var that = this

    var param = e.currentTarget.dataset.id.split("-")

    switch (param.length) {
      case 1:
        requestYear = param[0]
        requestMonth = '00'
        // getCountList(that)

        that.setData({
          optionColorId: 2
        })
        break;

      case 2:
        requestYear = param[0]
        requestMonth = param[1]
        // getCountList(that)

        that.setData({
          optionColorId: 3
        })
        break;

      case 3:
        wx.navigateTo({
          
        })
        break;
    }
  },

  bindCat: function (e) {
    wx.navigateTo({
     
    })
  }
})