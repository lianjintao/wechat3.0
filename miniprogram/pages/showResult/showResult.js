// miniprogram/pages/showResult/showResult.js
const app = getApp()

Page({
  data: {
    list: [],
    id:0
  },

  onLoad: function(options) {
    this.setData({
      id:options.id
    })
    this.getResult();
  },

  click: function (e) { 
    var app = getApp();
    var index = parseInt(e.currentTarget.id);
    console.log("按了：", index);
    console.log(typeof(index));
    app.globalData.currentIndex = index;

    wx.navigateTo({
      url: '../choiceQuestion/choiceQuestion?id=3',
    })
  },

  getResult: function() {
      var moduleId = app.globalData.module_id;
      if (this.data.id == 1) {
        wx.cloud.callFunction({
          name: 'submit_module_ques',
          data: {
            module_id:moduleId,
          },
          success: res => {     //返回的结果
            var listV = [];
            for (var i=0; i < res.result.result.length;i++) {
              var item = {};
              item.id = i;
              item.result = res.result.result[i];
              listV.push(item);
            }
  
            this.setData({
              list:listV
            })
          },
          fail: err => {
          }
        })
      } else {
        wx.cloud.callFunction({
          name: 'get_module_res',
          data: {
            module_id:moduleId,
          },
          success: res => {     //返回的结果
            var app = getApp();
            app.globalData.quesIdArray = res.result.ques_lst;
          },
          fail: err => {
          }
        })
      }
  }

})