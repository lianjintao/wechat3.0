// miniprogram/pages/xitilianxiCategory.js

const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {    
    list: [{
      id: 1,
      name: '刑法',
      content: "我是张三，见到大家很高兴。。。",
      doneCount:'',
      totalCount:''
    },{
      id: 2,
      name: '刑诉',
      content: "我是李四，可以带大将去玩。。。。",
      doneCount:'',
      totalCount:''
    },{
        id: 3,
        name: '民法',
        content: "我是王五，我编码贼好。。。。",
        doneCount:'',
        totalCount:''
      },{
        id: 4,
        name: '民诉',
        content: "我是张三，见到大家很高兴。。。",
        doneCount:'',
        totalCount:''
      },{
        id: 5,
        name: '行政法',
        content: "我是李四，可以带大将去玩。。。。",
        doneCount:'',
        totalCount:''
      },{
          id: 6,
          name: '商经法',
          content: "我是王五，我编码贼好。。。。",
          doneCount:'',
          totalCount:''
        },{
          id: 7,
          name: '三国法',
          content: "我是张三，见到大家很高兴。。。",
          doneCount:'',
          totalCount:''
        },{
          id: 8,
          name: '理论法学',
          content: "我是李四，可以带大将去玩。。。。",
          doneCount:'',
          totalCount:''
        }],

        doneCountList:[],
        totalCountList:[]
  },

  click: function(e) {
    var index = parseInt(e.currentTarget.id) + 1;
        wx.cloud.callFunction({
      name: 'get_order_ques',
      data: {
        union_id: '123',
        classify: index
      },
      success: res => {
        wx.showToast({
          title: '加载中',
          icon: 'loading'
        })
        var app = getApp();
        app.globalData.quesIdArray = res.result.ques_lst;
        app.globalData.currentIndex = 0;
        wx.navigateTo({
          url: '../choiceQuestion/choiceQuestion?id=0',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },

  getProgress:function() {
    wx.cloud.callFunction({
      name: 'get_user_order_count',
      data: {
        union_id:'123'
      },
      success: res => {
        this.setData({
          doneCountList:res.result.user_complete_count_lst,
          totalCountList:res.result.ques_count_lst
        })

        console.log(this.data.doneCountList);
        console.log(this.data.totalCountList);

        var items = this.data.list;
        for (var i = 0; i < this.data.totalCountList.length; i++) {
          items[i].totalCount = this.data.totalCountList[i];
          console.log(this.data.totalCountList[i]);
          items[i].doneCount = this.data.doneCountList[i];
          console.log(this.data.doneCountList[i]);
        }

        console.log(items);
        this.setData({
          list:items
        })

        console.log(this.data.list);
      },

      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getProgress();
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
    this.getProgress();
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