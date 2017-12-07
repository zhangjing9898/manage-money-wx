// pages/buy/buy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    listDetail:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
    //调用应用实例的方法获取全局数据
    var that = this
    //调用应用实例的方法获取全局数据
    var app = getApp()
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        detailId:app.detailId
      })
    })
    var userId=that.data.userInfo.nickName;
    wx.request({
      url: "http://127.0.0.1:3000/detail",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // "Content-Type": "application/json"
      },
      data: {
        "wechatname": userId,
        "detailId":that.data.detailId 
      },

      success: function (res) {
        console.log(res);
        if (res.statusCode == '200') {
          that.setData({
            listDetail: res.data[0]
          })
        }
        else {
          wx.showToast({
            title: '查询失败',
            image: "../../images/icon-no.png",
            mask: true,
            duration: 1000
          })
        }
      }
    })

  },

  //购买按钮
  buyBtn: function (e) {
    var app = getApp();
    var earnMoeny = (this.data.putMoney * this.data.rate * this.data.buyLimit) / 12;
    var userId = this.data.userInfo.nickName;

    var that = this;
    wx.showModal({
      title: '收益情况',
      content: '到期可收益' + earnMoeny + '元',
      success: function (res) {
        if (res.confirm) {
          //扣除购买金额
          wx.request({
            url: "http://127.0.0.1:3000/detail",
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              "wechatname": userId,
              "putMoney": that.data.putMoney
            },

            success: function (res) {
              console.log(res);
              if (res.statusCode == '200') {

              }
              else {
              }
            }
          })
        }
      }
    })


  },
  //保存
  formSave: function (e) {
    var billDate = e.detail.value.inputDate
    var categoryID = e.detail.value.inputStyle
    var typeName = e.detail.value.inputType
    var title = e.detail.value.inputTitle
    var money = e.detail.value.inputMoney
    var remark = e.detail.value.inputDetail
    var userId = this.data.userInfo.nickName;
    var detailId = this.data.listDetail._id;
    console.log(detailId);
    var checkResult = true
    console.log(categoryID)
    if (title == '') {
      checkResult = false
      wx.showToast({
        title: '写个标题',
        image: "../../images/icon-no.png",
        mask: true,
        duration: 1000
      })
    }
    else {
      if (money == '') {
        checkResult = false
        wx.showToast({
          title: '输入金额',
          image: "../../images/icon-no.png",
          mask: true,
          duration: 1000
        })
      }
      else {
        if (remark == '') {
          checkResult = false
          wx.showToast({
            title: '描述一下',
            image: "../../images/icon-no.png",
            mask: true,
            duration: 1000
          })
        }
      }
    }

    if (checkResult) {
      this.setData({
        loadingStatus: true
      })
      var that = this;

      wx.request({
        url: "http://127.0.0.1:3000/new",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
          // "Content-Type": "application/json"
        },
        data: {
          "wechatname": userId,
          "detailId":detailId,
          "date": billDate,
          "style": categoryID,
          "type": typeName,
          "title": title,
          "changed": money,
          "detail": remark
        },

        success: function (res) {
          console.log(res);
          if (res.statusCode == '200') {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              mask: true,
              duration: 1000
            })
            that.setData({
              loadingStatus: false
            })
            // wx.redirectTo({
            //   url: '../index/index'
            // })
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
  },
  //删除操作
  delete:function(e){
    var userId = this.data.userInfo.nickName;
    var detailId = this.data.listDetail._id;
    wx.request({
      url: "http://127.0.0.1:3000/delete",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // "Content-Type": "application/json"
      },
      data: {
        "wechatname": userId,
        "detailId": detailId
      },

      success: function (res) {
        console.log(res);
        if (res.statusCode == '200') {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            mask: true,
            duration: 1000
          })
        }
        else {
          wx.showToast({
            title: '删除失败',
            image: "../../images/icon-no.png",
            mask: true,
            duration: 1000
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow!");
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})