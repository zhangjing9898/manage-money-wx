// pages/finance/finance.js
var getCountList = function (that, Requrl) {
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
  /**
   * 页面的初始数据
   */
  data: {
    listAll: [],
    userInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //调用应用实例的方法获取全局数据
    var that = this

    //调用应用实例的方法获取全局数据
    var app = getApp()
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    //得到相应rate


    getCountList(that, "http://127.0.0.1:3000/products");
  },

  //进入购买
  bindToBuy:function(e){
    // console.log(e);
    var id=e.target.dataset.id;
    var time=e.target.dataset.time;
    console.log(time);
    var app=getApp();
    app.productRate=id;
    app.productTime=time;
    wx.navigateTo({
      url: '../buy/buy'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
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