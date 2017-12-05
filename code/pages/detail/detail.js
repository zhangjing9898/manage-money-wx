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