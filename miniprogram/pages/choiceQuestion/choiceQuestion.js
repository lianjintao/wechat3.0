// miniprogram/pages/choiceQuestion/choiceQuestion.js
Page({
 
  /**
   * 页面的初始数据
   */
  data: {

    animationData: {}, //内容动画
    animationMask: {}, //蒙板动画

    view1: 'selection1',
    view2: 'selection1',
    view3: 'selection1',
    view4: 'selection1',
    // 默认答案为2，后台会给的
    key: 2,
    // 选项是否被点击
    isSelect: false
  },

  onLoad: function() {  //弹窗动画
    this.animateTrans = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
 
    this.animateFade = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
  },

  // 隐藏弹窗
  hideModal: function() {
    this.animateTrans.translateY(300).step()
    this.animateFade.opacity(0).step()
    this.setData({
      animationData: this.animateTrans.export(),
      animationMask: this.animateFade.export()
    })
  },

  submitAnswer: function() {//提交答案，展示弹窗
    this.animateTrans.translateY(0).step()
    this.animateFade.opacity(1).step()
    this.setData({
      animationData: this.animateTrans.export(), //动画实例的export方法导出动画数据传递给组件的animation属性
      animationMask: this.animateFade.export()
    })
  },

  nextProject: function() {
    wx.showToast({
      title: 'title',
    })
  },
 
  view1Click: function(e) {
    var select = e.target.id
    // 选项没被选择时将执行
    if (!this.data.isSelect) {
      // 将选项设置为“已被选择”
      this.setData({
        isSelect: true
      })
      // 注意！此处必须是'=='而不是'='
      if (select == this.data.key) {
        this.setData({
          view1: 'selection2'
        })
      } else {
        this.setData({
          view1: 'selection3'
        })
        // 将正确选项显示出来
        this.showAnswer(this.data.key)
      }
 
    }
  },
  view2Click: function(e) {
    var select = e.target.id
    // 选项没被选择时将执行
    if (!this.data.isSelect) {
      this.setData({
        isSelect: true
      })
      // 注意！此处必须是'=='而不是'='
      if (select == this.data.key) {
        this.setData({
          view2: 'selection2'
        })
      } else {
        this.setData({
          view2: 'selection3'
        })
        // 将正确选项显示出来
        this.showAnswer(this.data.key)
      }
 
    }
  },
  view3Click: function(e) {
    var select = e.target.id
    // 选项没被选择时将执行
    if (!this.data.isSelect) {
      this.setData({
        isSelect: true
      })
      // 注意！此处必须是'=='而不是'='
      if (select == this.data.key) {
        this.setData({
          view3: 'selection2'
        })
      } else {
        this.setData({
          view3: 'selection3'
        })
        // 将正确选项显示出来
        this.showAnswer(this.data.key)
      }
 
    }
  },
  view4Click: function(e) {
    var select = e.target.id
    // 选项没被选择时将执行
    if (!this.data.isSelect) {
      this.setData({
        isSelect: true
      })
      // 注意！此处必须是'=='而不是'='
      if (select == this.data.key) {
        this.setData({
          view4: 'selection2'
        })
      } else {
        this.setData({
          view4: 'selection3'
        })
        // 将正确选项显示出来
        this.showAnswer(this.data.key)
      }
 
    }
  },

  showAnswer: function(key) {
    // 通过swith语句判断正确答案，从而显示正确选项
    switch (key) {
      case 1:
        this.setData({
          view1: 'selection2'
        })
        break;
      case 2:
        this.setData({
          view2: 'selection2'
        })
        break;
      case 3:
        this.setData({
          view3: 'selection2'
        })
        break;
      default:
        this.setData({
          view4: 'selection2'
        })
    }
  }
})
