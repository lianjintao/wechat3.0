// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({
  data: {
    list: [{
      id: 1,
      name: '芒果',
      content: "我是张三，见到大家很高兴。。。"
    },{
      id: 2,
      name: '香蕉',
      content: "我是李四，可以带大将去玩。。。。"

    },{
        id: 3,
        name: '苹果',
        content: "我是王五，我编码贼好。。。。"

      },{
        id: 1,
        name: '芒果',
        content: "我是张三，见到大家很高兴。。。"
      },{
        id: 2,
        name: '香蕉',
        content: "我是李四，可以带大将去玩。。。。"
  
      },{
          id: 3,
          name: '苹果',
          content: "我是王五，我编码贼好。。。。"
  
        }]
  },

  click: function (e) { 
    console.log("按了：", e.currentTarget.id)
  }

})