// pages/buy/buy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    rate:0,
    putMoney:0
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
    console.log(app.productTime);
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        rate:app.productRate,
        buyLimit:app.productTime
      })
    })
  },

  //投资金额
  putInput: function (e) {
    this.setData({
      putMoney: e.detail.value
    })
  },

  //购买按钮
  buyBtn: function (e) {
    var app=getApp();
    var earnMoeny = (this.data.putMoney * this.data.rate*this.data.buyLimit)/12;
    var userId=this.data.userInfo.nickName;
   
   var that=this;
    wx.showModal({
      title: '收益情况',
      content: '到期可收益' + earnMoeny + '元',
      success: function (res) {
        if (res.confirm) {
          //扣除购买金额
          wx.request({
            url: "http://127.0.0.1:3000/new",
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
              // "Content-Type": "application/json"
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