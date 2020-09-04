// miniprogram/pages/xitilianxiCategory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      id: 1,
      name: '刑法',
      content: "我是张三，见到大家很高兴。。。"
    },{
      id: 2,
      name: '刑诉',
      content: "我是李四，可以带大将去玩。。。。"

    },{
        id: 3,
        name: '民法',
        content: "我是王五，我编码贼好。。。。"

      },{
        id: 4,
        name: '民诉',
        content: "我是张三，见到大家很高兴。。。"
      },{
        id: 5,
        name: '行政法',
        content: "我是李四，可以带大将去玩。。。。"
  
      },{
          id: 6,
          name: '商经法',
          content: "我是王五，我编码贼好。。。。"
  
        },{
          id: 7,
          name: '三国法',
          content: "我是张三，见到大家很高兴。。。"
        },{
          id: 8,
          name: '理论法学',
          content: "我是李四，可以带大将去玩。。。。"
    
        }],

        isShow_03: false,
        listData_03:[['单选题', '多选题', '不定向选择题', '主观题'],['5','10', '15', '20', '25', '30'],['1','2','3','4','5']],
        picker_03_data:[],
  },

  click: function() {
    wx.navigateTo({
      url: '../chooseProjectAndNum/chooseProjectAndNum',
    }) 
  },

    showPicker_03: function () {
      wx.showToast({
        title: '发送成功，请返回微信主界面查看',
      })

    
    wx.navigateTo({
      url: '../chooseProjectAndNum/chooseProjectAndNum',
    }) 
      /** 
       *     this.setData({
      isShow_03: true
    })
      */

  },
  sureCallBack_03 (e) {
    let data = e.detail
    this.setData({
      isShow_03: false,
      picker_03_data: e.detail.choosedData,
      picker_03_index:JSON.stringify(e.detail.choosedIndexArr)
    })
  },
  cancleCallBack_03 () {
    this.setData({
      isShow_03: false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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