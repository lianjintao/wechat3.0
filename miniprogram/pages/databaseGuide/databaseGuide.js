// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({
  data: {
    module_id_lst:[],
    ques_num_lst:[],
    score_lst:[],
    time_lst:[],

    list: []
  },

  click: function (e) { 
    var app = getApp();
    var intIndex = parseInt(e.currentTarget.id);
    var module_id = this.data.module_id_lst[intIndex];
    app.globalData.module_id = module_id;

    wx.navigateTo({
      url: '../showResult/showResult?id=2',
    })
  },
  
  onLoad: function() {
    this.getHistoryInfo();
  },

  getHistoryInfo: function() {
    console.log('hfsldfjsf');
    wx.cloud.callFunction({
      name: 'get_history_module',
      data: {
      },
      success: res => {
        this.setData({
          module_id_lst:res.result.module_id_lst,
          ques_num_lst:res.result.ques_num_lst,
          score_lst:res.result.score_lst,
          time_lst:res.result.time_lst
        })
        console.log(res.result.score_lst);
        console.log(res.result.time_lst);

        var lists = [];
        for (var i = 0; i < this.data.module_id_lst.length;i++) {
          var aList = {};
          aList.name = this.data.score_lst[i];
          aList.content = this.data.time_lst[i];
          lists.push(aList);
        }

        this.setData({
          list:lists
        })
      },
      fail: err => {
      }
    })
  }

})