// miniprogram/pages/choiceQuestion/choiceQuestion.js
Page({
 
  /**
   * 页面的初始数据
   */
  data: {

    animationData: {}, //内容动画
    animationMask: {}, //蒙板动画
    id:0,
    buttonText:'',

    title:'',
    type:0,
    typeStr:'',
    options:[],
    answer:'Z',
    difficulty:0,
    difficultyStr:'',
    analysis:'',

    singleItems: [],
    mutliItems:[],
    focus: false,
    line:'0em',
    datiTitle:'',
    datiBackGroundColor:'#ff0000',
    chooseAnswerList:[],
    chooseAnswerStr:'',
    datiResult:''
  },

  getDataFromApi: function() {
    var app = getApp();
    var currentQuesId = app.globalData.quesIdArray[app.globalData.currentIndex];
    console.log(currentQuesId);
    wx.cloud.callFunction({
      name: 'get_ques_info',
      data: {
        question_id:currentQuesId
      },
      success: res => {
        console.log(res)

        this.setData({
          type:res.result.type,
          title:res.result.title,
          options:res.result.options, 
          answer:res.result.ans,
        })
        if(app.globalData.currentIndex == app.globalData.quesIdArray.length - 1) {
          this.setData({
            buttonText:'提交试卷'
          })
        }
        var optionA = {};
        optionA.name='A';
        var titleA = this.data.options[0];
        optionA.value= titleA;

        var optionB = {};
        optionB.name='B';
        optionB.value=this.data.options[1];

        var optionC = {};
        optionC.name='C';
        optionC.value=this.data.options[2];

        var optionD = {};
        optionD.name='D';
        optionD.value=this.data.options[3];

        let itemss=[];
        itemss.push(optionA);
        itemss.push(optionB);
        itemss.push(optionC);
        itemss.push(optionD);
        console.log(itemss);

        var type = res.result.type;
        if (type == 1) {
          this.setData({
            singleItems:itemss,
            mutliItems:[],
            line:'0em',
            datiTitle:'',
            datiBackGroundColor:'#FFFFFF'
          })
        } else if (type == 2 || type == 3) {
          this.setData({
            mutliItems:itemss,
            singleItems:[],
            line:'0em',
            datiTitle:'',
            datiBackGroundColor:'#FFFFFF'
          })
        } else {
          this.setData({
            mutliItems:[],
            singleItems:[],
            line:'10em',
            datiTitle:'请在输入框内输入你的答案',
            datiBackGroundColor:'#FF0000'
          })
        }
        var typeStr1 = '';
        if (type == 1) {
          typeStr1 = '单选题';
          //进行UI布局的改变
        } else if (type == 2) {
          typeStr1 = '多选题';
        } else if (type == 3) {
          typeStr1 = '不定向';
        } else if (type == 4) {
          typeStr1 = '主观题';
        }
        this.setData({
          typeStr:typeStr1
        })
        var diff = res.result.difficulty;
        var diffStr1 = '';
        if (diff == 1) {
          diffStr1 = '入门';
        } else if (diff == 2) {
          diffStr1 = '简单';
        } else if (diff == 3) {
          diffStr1 = '普通';
        } else if (diff == 4) {
          diffStr1 = '较难';
        } else {
          diffStr1 = '困难';
        }
        this.setData({
          difficultyStr:diffStr1
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数2222222] [sum] 调用失败：', err)
      }
    })
  },

  radioChange: function(e) {//单选
    this.setData({
      chooseAnswerStr:e.detail.value
    })
  },

  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      chooseAnswerList : e.detail.value
    })
  },

  onLoad: function(options) {  //弹窗动画
    this.animateTrans = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
 
    this.animateFade = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })

    this.setData({
      id:options.id
    })
    var text = '';
    if (this.data.id == 0) {
      text = '提交答案';
    } else {
      text = '下一题';
    }

    this.setData({
      buttonText:text
    })

    this.getDataFromApi();//得到数据
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

  submitAnswer: function() {
    //文案：提交答案，展示解析弹窗，弹窗中有按钮，跳到下一题

    var app = getApp();
    if (app.globalData.currentIndex == app.globalData.quesIdArray.length - 1) { //做到最后一题就得提交试卷和一套题了
      wx.navigateTo({
        url: '../showResult/showResult',
      })
      return;
    }

    if (this.data.id == 0) {

      /**提交答案**/
      var app = getApp();
      var currentQuesId = app.globalData.quesIdArray[app.globalData.currentIndex];

      var result;
      if (this.data.type == 1) {
        result = this.data.answer == this.data.chooseAnswerStr ? true :false;
      } else if (this.data.type == 2 || this.data.type == 3) {
        console(this.data.chooseAnswerList);
        console(this.data.answer);
        result = this.ans_transfer(this.data.chooseAnswerList) == this.data.answer ? true:false;
      }
      wx.cloud.callFunction({
        name: 'update_user_result',
        data: {
          union_id:'123',
          question_id:currentQuesId,
          result:result,
        },
        success: res => {
          wx.showToast({
            title: '提交成功',
          })
        },
        fail: err => {
          wx.showToast({
            title: '提交失败',
          })
        }
      })
      /**
       * 下一题
       */
      var app = getApp();
      app.globalData.currentIndex++;
      this.getDataFromApi();

    } else if (this.data.id == 1) {
      /**
       * 文案：下一题
       * 更新答案：update_user_answer
       * 加载下一题
       */
      var app = getApp();
      var currentQuesId = app.globalData.quesIdArray[app.globalData.currentIndex];
      var moludeId = app.globalData.module_id;
      var result;
      if (this.data.type == 1) {
        result = this.data.chooseAnswerStr;
      } else if (this.data.type == 2 || this.data.type == 3) {
        result = this.ans_transfer(this.data.chooseAnswerList);
      } else {
        result = this.data.datiResult;
      }
      console.log(this.data.answer);
      console.log(this.data.chooseAnswerStr);
      console.log(result);

      wx.cloud.callFunction({
        name: 'update_user_answer',
        data: {
          question_id:currentQuesId,
          ans:result,
          module_id:moludeId
        },
        success: res => {
          wx.showToast({
            title: '提交成功',
          })
        },
        fail: err => {
          wx.showToast({
            title: '提交失败',
          })
        }
      })

      var app = getApp();
      app.globalData.currentIndex++;
      this.getDataFromApi();
    }
  },

  ans_transfer: function (ans){
    var res_str = ""
    var lst = ["A","B","C","D"]
    for(let i = 0;i < 4;i++){
      if(ans.indexOf(lst[i]) >= 0){
        res_str += lst[i]
      }
    }
    console.log(res_str)
    return res_str
  },

  nextProject: function() {
  },

  textareaInput2: function (e) {
    console.log(e.detail.value)
    this.setData({
      datiResult:e.detail.value
    })

    e.detail.value = '';
  }

})
