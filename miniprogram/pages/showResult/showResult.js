// miniprogram/pages/showResult/showResult.js
const app = getApp()

Page({
  data: {
    list: []
  },

  onLoad: function() {
    this.getResult();
  },

  click: function (e) { 
    console.log("按了：", e.currentTarget.id);
    var app = getApp();
    app.globalData.currentIndex = e.currentTarget.id;

    wx.navigateTo({
      url: '../choiceQuestion/choiceQuestion?id=3',
    })
  },

  getResult: function() {
      var moduleId = app.globalData.module_id;
      wx.cloud.callFunction({
        name: 'submit_module_ques',
        data: {
          module_id:moduleId,
          during_time:'123'
        },
        success: res => {     //返回的结果
          console.log(res)
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
  }

})