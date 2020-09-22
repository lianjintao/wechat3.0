// miniprogram/pages/showResult/showResult.js
const app = getApp()

Page({
  data: {
    list: [],
    score:''
    // color:"#DC143C",
    // green:"#00FF7F"
  },

  onLoad: function() {
    this.getResult();
  },

  click: function (e) { 
    console.log("按了：", e.currentTarget.id);
    var app = getApp();
    app.globalData.currentIndex = e.currentTarget.id;

    var ans = this.data.list[e.currentTarget.id]['userAns']
    wx.navigateTo({
      url: '../choiceQuestion/choiceQuestion?id=3&ans='+ans,
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
          for (var i=0; i < res.result.ans_lst.length;i++) {
            var item = {};
            var sequ = i + 1;
            item.id = sequ;
            if (res.result.result[i] != true) {
              item.result = '#FF4040';
            } else {
              item.result = '#00FF7F';
            }
            item.ans = res.result.ans_lst[i];
            item.userAns =res.result.user_ans_lst[i];
            listV.push(item);
          }
          this.setData({
            list:listV,
            score:res.result.score
          })
        },
        fail: err => {
        }
      })
  }
})