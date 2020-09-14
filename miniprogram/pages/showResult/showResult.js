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
    console.log("按了：", e.currentTarget.id)
  },

  getResult: function() {
      var moduleId = app.globalData.module_id;
      console.log(app.globalData.module_id);
      console.log(moduleId);
      wx.cloud.callFunction({
        name: 'submit_module_ques',
        data: {
          module_id:moduleId,
          during_time:'123'
        },
        success: res => {     //返回的结果
          wx.showToast({
            title: '提交成功',
          })
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
          console.log(err)
          wx.showToast({
            title: '提交失败',
          })
        }
      })
  }

})