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
      content: "用刑罚同一切反革命和其他刑事犯罪行为作斗争",
      doneCount:'',
      totalCount:''
    },{
      id: 2,
      name: '刑诉',
      content: "依照法律规定的程序，解决被追诉者刑事责任问题的活动",
      doneCount:'',
      totalCount:''
    },{
        id: 3,
        name: '民法',
        content: "审理解决民事案件的活动以及由这种活动所产生的诉讼关系的总和",
        doneCount:'',
        totalCount:''
      },{
        id: 4,
        name: '民诉',
        content: "行政主体在行使行政职权和接受行政法制监督过程中而与行政",
        doneCount:'',
        totalCount:''
      },{
        id: 5,
        name: '行政法',
        content: "行政主体在行使行政职权和接受行政法制监督过程中而与行政相对",
        doneCount:'',
        totalCount:''
      },{
          id: 6,
          name: '商经法',
          content: "调整平等主体之间商事关系的法律规范的总称",
          doneCount:'',
          totalCount:''
        },{
          id: 7,
          name: '三国法',
          content: "《国际bai公法》、《国际私法》、《国际经济法》",
          doneCount:'',
          totalCount:''
        },{
          id: 8,
          name: '理论法学',
          content: "探讨法学的基础理论、一般理论为主要任务的法学",
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
        classify: index
      },
      success: res => {
        var app = getApp();
        app.globalData.quesIdArray = res.result.ques_lst;
        app.globalData.currentIndex = 0;
        wx.navigateTo({
          url: '../choiceQuestion/choiceQuestion?id=0',
        })
      },
      fail: err => {
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