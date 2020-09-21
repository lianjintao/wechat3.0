// miniprogram/pages/choiceQuestion/choiceQuestion.js
Page({
 
  /**
   * 页面的初始数据
   */
  data: {

    show: false, //题目解析弹窗列表
    area_show: false, //大题textarea
    analysis_show: false, 
    button_show : true,
    check_disabled:false,
    ques_lst_show:false, //题目列表弹窗列表
    ques_lst_btn_show:false, //题目列表btn
    
    ques_num:0,
    done_lst:[],

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
    datiBackGroundColor:'#E6E6FA',
    chooseAnswerList:[],
    chooseAnswerStr:'', 
    datiResult:''
  },

  buttontap(e) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    var app = getApp();
    app.globalData.currentIndex++;
    this.getDataFromApi();
    this.setData({
      datiResult:""
    })
    
  },


  close: function() {
    this.setData({
      show: false,
      button_show: false,
      check_disabled: true
    })
  },

  ques_lst_close: function(){
    this.setData({
      ques_lst_show:false
    })
  },

  showQuesList: function(){
    // 点击查看题目列表按钮事件
    var app = getApp();
    var moludeId = app.globalData.module_id;
    wx.cloud.callFunction({
      name: 'check_module_done',
      data: {
        module_id:moludeId
      },
      success: res => {
        const done_lst = res.result.done_lst
        var ques_color_lst = []
        for(let i = 0;i < done_lst.length;i++){
          if(done_lst[i]){
            ques_color_lst.push("primary")
          }
          else{
            ques_color_lst.push("warn")
          }
        }
        this.setData({
          done_lst: ques_color_lst,
          ques_lst_show:true
        })
      },
      fail: err => {
      }
    })
  },

  ques_lst_tap: function(e){
    //点击弹窗内任意一题按钮,需要获取用户的答案
    var index =  parseInt(e.currentTarget.id)
    this.get_user_answer(index)
  },


  getDataFromApi: function() {
    wx.showLoading({
      title: '加载中',
    })
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
        var data_dict = {
          area_show:false,
          type:res.result.type,
          title:res.result.title,
          options:res.result.options, 
          answer: res.result.ans,
          analysis: res.result.analysis,
          button_show: true,
          check_disabled:false
        }
        if (this.data.id == 0 || this.data.id == 2) {
          data_dict['buttonText'] = "提交答案"
        } else if (this.data.id == 1){
          data_dict['buttonText'] = "下一题"
          data_dict['ques_lst_btn_show'] = true
          data_dict['ques_num'] = app.globalData.quesIdArray.length
        } else if (this.data.id == 3) {
          data_dict['buttonText'] = "解析"
        }

        if (this.data.id == 3) {
          data_dict['analysis_show'] = true
        }

        if(app.globalData.currentIndex == app.globalData.quesIdArray.length - 1) {
          data_dict['buttonText'] = '提交试卷'
        }
        var optionA = {};
        optionA.name='A';
        var titleA = res.result.options[0];
        console.log(res.result.options[0])
        optionA.value= titleA;

        var optionB = {};
        optionB.name='B';
        optionB.value=res.result.options[1];

        var optionC = {};
        optionC.name='C';
        optionC.value=res.result.options[2];

        var optionD = {};
        optionD.name='D';
        optionD.value=res.result.options[3];
        var user_ans = ""
        if(this.data.id == 3){
          user_ans = this.data.answer
        }
        else if(this.data.id == 1||this.data.ia == 2){ //需要修改！！！！！！！！！！！！！！！!!!!
          user_ans = this.data.chooseAnswerStr
        }

        if (this.data.type == 1) {
          if (user_ans == 'A') {
            optionA.checked=true;
          } else if (user_ans == 'B') {
            optionB.checked=true;
          } else if (user_ans == 'C') {
            optionC.checked=true;
          } else if (user_ans == 'D') {
            optionD.checked=true;
          }
        }

        if ((this.data.type == 2 || this.data.type == 3) && user_ans!=null) {
          var ansArray = this.transferToArray(user_ans);
          console.log(ansArray);
          for (let index = 0; index < ansArray.length; index++) {
            console.log(typeof(ansArray))
            var element = ansArray[index];
            console.log(element)
            if (element == 'A') {
              optionA.checked=true;
            } else if (element == 'B') {
              optionB.checked=true;
            } else if (element == 'C') {
              optionC.checked=true;
            } else if (element == 'D') {
              optionD.checked=true;
            }
          }
        }

        let itemss=[];
        itemss.push(optionA);
        itemss.push(optionB);
        itemss.push(optionC);
        itemss.push(optionD);
        console.log(itemss);

        var type = res.result.type;
        if (type == 1) {
          data_dict['mutliItems'] = []
          data_dict['singleItems'] = itemss
          data_dict['typeStr']='单选题'
        } else if (type == 2) {
          data_dict['mutliItems'] = itemss
          data_dict['singleItems'] = []
          data_dict['typeStr']='多选题'
        } else if(type == 3){
          data_dict['mutliItems'] = itemss
          data_dict['singleItems'] = []
          data_dict['typeStr']='不定项'
        } else {
          data_dict['mutliItems'] = []
          data_dict['singleItems'] = []
          data_dict['line']='10em'
          data_dict['datiTitle']='请在输入框内输入你的答案'
          data_dict['datiBackGroundColor']='FFFFFF'
          data_dict['area_show']=true
          data_dict['typeStr']='主观题'
        }
        
        var diff = res.result.difficulty;
        if (diff == 1) {
          data_dict['difficultyStr'] = '入门';
        } else if (diff == 2) {
          data_dict['difficultyStr'] = '简单';
        } else if (diff == 3) {
          data_dict['difficultyStr'] = '普通';
        } else if (diff == 4) {
          data_dict['difficultyStr'] = '较难';
        } else {
          data_dict['difficultyStr'] = '困难';
        }
        data_dict['show'] = false
        this.setData(data_dict)
        wx.hideLoading()
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
      id:options.id,
    })

    
    this.getDataFromApi();//得到数据
  },


  // 隐藏弹窗
  hideModal: function() {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    // this.animateTrans.translateY(300).step()
    // this.animateFade.opacity(0).step()
    // this.setData({
    //   animationData: this.animateTrans.export(),
    //   animationMask: this.animateFade.export()
    // })
  },

  submit: function(){
    
  },

  submitAnswer: function() {

    if (this.data.id == 3) {
      return;
    }

    //文案：提交答案，展示解析弹窗，弹窗中有按钮，跳到下一题

    var app = getApp();

    if (this.data.id == 0) {
      /**提交答案**/
      var app = getApp();
      var currentQuesId = app.globalData.quesIdArray[app.globalData.currentIndex];

      var result;
      if (this.data.type == 1) {
        result = this.data.answer == this.data.chooseAnswerStr ? true :false;
      } else if (this.data.type == 2 || this.data.type == 3) {
        this.setData({
          chooseAnswerStr: this.ans_transfer(this.data.chooseAnswerList)
        })
        console.log(this.data.chooseAnswerStr)
        console.log(this.data.answer);
        result = this.data.chooseAnswerStr == this.data.answer ? true:false;
      }
      wx.cloud.callFunction({
        name: 'update_user_result',
        data: {
          question_id:currentQuesId,
          result:result,
        },
        success: res => {
          this.setData({
            show: true
          })
        },
        fail: err => {
        }
      })

    } else if (this.data.id == 1 || this.data.id == 2) {
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
          this.setData({ //重置题目答案
            chooseAnswerStr:'',
            datiResult:''
          })
        },
        fail: err => {
          wx.showToast({
            title: '提交失败',
          })
        }
      })
      
      if (app.globalData.currentIndex == app.globalData.quesIdArray.length - 1){
        wx.showModal({
          title: '提交提示',
          content: '是否确认提交试卷？',
          success(res){
            if(res.confirm){
              console.log('确定退出')
              wx.redirectTo({
                url: '../showResult/showResult',
              })
              
            } else if(res.cancel){
              console.log('取消')
            }
          }
        })
        return;
      }
      this.get_user_answer(app.globalData.currentIndex+1)
    }
  },

  get_user_answer:function(index){
    var app = getApp();
    app.globalData.currentIndex = index;
    var ques_id = app.globalData.quesIdArray[index]
    var module_id = app.globalData.module_id
    wx.cloud.callFunction({
      name: 'get_user_answer',
      data: {
        question_id:ques_id,
        module_id:module_id
      },
      success: res => {
        this.setData({
          chooseAnswerStr: res.result.ans,
          datiResult: res.result.ans,
          ques_lst_show:false
        })
        console.log(this.datiResult)
        this.getDataFromApi();

      },
      fail: err => {
      }
    })
  },

  readResult: function(){
    this.setData({
      show: true
    })
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

  transferToArray: function(ansStr) {
    console.log(ansStr)
    var res_array = [];
    res_array = ansStr.split("")
    return res_array
    },

  nextProject: function() {
  },

  textareaInput2: function (e) {
    console.log(e.detail.value)
    this.setData({
      datiResult:e.detail.value,
      chooseAnswerStr: e.detail.value
    })

    e.detail.value = '';
  },


})
