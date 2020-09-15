// miniprogram/pages/chooseProjectAndNum/chooseProjectAndNum.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow_tixi: false,
    listData_tixi:[['单选题', '多选题', '不定项选择题', '主观题']],
    picker_tixi_data:[],
    picker_tixi_index:0,

    isShow_tishu: false,
    listData_tishu:[['5', '10', '15', '20', '25', '30']],
    picker_tishu_data:[],
    picker_tishu_index:0,

    isShow_nandu: false,
    listData_nandu:[['⭐️ ☆  ☆  ☆  ☆', '⭐️ ⭐️ ☆  ☆  ☆', '⭐️ ⭐️ ⭐️ ☆  ☆','⭐️ ⭐️ ⭐️ ⭐️ ☆','⭐️ ⭐️ ⭐️ ⭐️ ⭐️']],
    picker_nandu_data:[],
    picker_nandu_index:0,

    isShow_classify: false,
    listData_classify:[['全部','邢法', '刑诉', '民法','民诉','行政法','商经法','三国法','理论法学']],
    picker_classify_data:[],
    picker_classify_index:0,
  },

  onClickTixiPicker: function() {
    this.setData({
      isShow_tixi: true
    })
  },

  sureCallBack_tixi (e) {
    let data = e.detail
    this.setData({
      isShow_tixi: false,
      picker_tixi_data: e.detail.choosedData,
      picker_tixi_index:JSON.stringify(e.detail.choosedIndexArr)
    })
  },
  cancleCallBack_tixi () {
    this.setData({
      isShow_tixi: false,
    })
  },

  onClickTishuPicker: function() {
    this.setData({
      isShow_tishu: true
    })
  },

  sureCallBack_tishu (e) {
    let data = e.detail
    this.setData({
      isShow_tishu: false,
      picker_tishu_data: e.detail.choosedData,
      picker_tishu_index:JSON.stringify(e.detail.choosedIndexArr)
    })
  },
  cancleCallBack_tishu () {
    this.setData({
      isShow_tishu: false,
    })
  },

  onClickNanduPicker: function() {
    this.setData({
      isShow_nandu: true
    })
  },

  sureCallBack_nandu (e) {
    let data = e.detail
    this.setData({
      isShow_nandu: false,
      picker_nandu_data: e.detail.choosedData,
      picker_nandu_index:JSON.stringify(e.detail.choosedIndexArr)
    })
  },
  cancleCallBack_nandu () {
    this.setData({
      isShow_nandu: false,
    })
  },

  onClickClassifyPicker: function() {
    this.setData({
      isShow_classify:true
    })
  },

  sureCallBack_classify (e) {
    let data = e.detail
    this.setData({
      isShow_classify: false,
      picker_classify_data: e.detail.choosedData,
      picker_classify_index:JSON.stringify(e.detail.choosedIndexArr)
    })
  },
  cancleCallBack_classify () {
    this.setData({
      isShow_classify: false,
    })
  },


  onClickStartDati() {

    var typeInt = parseInt(this.data.picker_tixi_index[1]) + 1;
    var numInt = parseInt(this.data.picker_tishu_data[0]);
    var classifyInt = parseInt(this.data.picker_classify_index[1]);
    var difficultyInt = parseInt(this.data.picker_nandu_index[1]) + 1;
    
    wx.cloud.callFunction({
      name: 'get_random_ques',
      data: {
        type: typeInt,
        num:numInt,
        classify: classifyInt,
        difficulty: difficultyInt
      },
      success: res => {
        var app = getApp();
        console.log(res.result.ques_lst);
        app.globalData.quesIdArray = res.result.ques_lst;
        app.globalData.currentIndex = 0;
        app.globalData.module_id = res.result.module_id;
        wx.navigateTo({
          url: '../choiceQuestion/choiceQuestion?id=1',
        })
      },
      fail: err => {
      }
    })
  },
})