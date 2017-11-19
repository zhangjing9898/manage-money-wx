// pages/finance/finance.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingStatus: false,
    date: '',
    title: '',
    money: '',
    remark: '',
    categoryArray: [
      { "ID": 1, "Name": "餐饮" },
      { "ID": 2, "Name": "交通" },
      { "ID": 3, "Name": "健康" },
      { "ID": 4, "Name": "购物" },
      { "ID": 5, "Name": "娱乐" },
      { "ID": 6, "Name": "其他" },
    ],
    categoryIndex: 0,
    m_cid: 0,
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