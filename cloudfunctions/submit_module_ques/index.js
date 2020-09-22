// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 用于提交试卷，结算用户答案，获得分数
  // 输入： union_id、module_id、during_time
  // 输出： res_lst  score  ans_lst  user_ans_lst
  const db = cloud.database()
  const module_id = event.module_id
  
  var union_id = cloud.getWXContext().OPENID
  if(typeof(union_id)=="undefined"){
    union_id = "123"
  }

  const during_time = event.during_time
  var time = new Date()
  time.setTime(time.getTime())
  console.log(module_id)
  // 获得modeule初始化时的数据
  module_res = await db.collection("module_history").where({
    _id:module_id
  }).field({
    is_choice:true,
    ques_lst:true,
  }).get()
  console.log(module_res)
  ques_lst = module_res.data[0].ques_lst
  is_choice = module_res.data[0].is_choice
  console.log(ques_lst)

  if(is_choice){ // 为选择题，需要核对答案给出分数
    // 对比用户的答案和标准答案，获得result_lst 和 完成情况
    var ans_res = await db.collection("user_answers").where({
      module_id: event.module_id
    }).field({
      ans:true,
      question_id:true
    })
    .get()
    console.log(ans_res)
    user_ans_dict = build_ques_ans_dict(ans_res.data)
    console.log(user_ans_dict)
  
    const _ = db.command
    ans_res = await db.collection("question_info").where({
      question_id: _.in(ques_lst)
    }).field({
      ans:true,
      question_id:true
    })
    .get()
  
    ans_dict = build_ques_ans_dict(ans_res.data)
    console.log(ans_dict)
  
    var res = compare_ans(user_ans_dict, ans_dict)
    var result_dict = res.dict
    var correct_count = res.correct_count
    var done_count = res.done_count
    if(ques_lst.length > 50){
      var score = res.score
    }
    else{
      var score = 100*correct_count/ques_lst.length
    }
    var ans_lst = res.ans_lst
    var user_ans_lst = res.user_ans_lst
    console.log(result_dict)

    // 构建插入的dict
    user_history_lst = []
    for(let item of result_dict.keys()){
      d = {
        union_id: union_id,
        question_id: item,
        module_id:module_id,
        type:0,
        classify:0,
        created_time:time,
        update_time:time,
        result:result_dict.get(item),
        doing_type:2
      }
      user_history_lst.push(d)
    }
  }
  else{
    // 全为主观题
    var correct_count = 0
    var result_dict = new Map()
    var done_count = ques_lst.length
    var score = 0
    var ans_lst = []

    const _ = db.command
    var ans_res = await db.collection("question_info").where({
      question_id: _.in(ques_lst)
    }).field({
      ans:true,
    })
    .get()
    for(let i = 0;i < ans_res.data.length;i++){
      ans_lst.push(ans_res.data[i].ans)
      // console.log(ans_res.data[i].ans)
    }
    console.log(ans_lst)
    var user_ans_lst = []
    // 构建插入的dict
    user_history_lst = []
    for(let i = 0;i < ques_lst.length;i++){
      d = {
        union_id: union_id,
        question_id: ques_lst[i],
        module_id: module_id,
        type:0,
        classify:0,
        created_time:time,
        update_time:time,
        result:false,
        doing_type:2
      }
      user_history_lst.push(d)
    }
  }
  // 插入所有做题记录到user_history
  try {
    await db.collection("user_history").add({
      data: user_history_lst
    })
  } catch(e) {
    console.error(e)
  }

  // 更新user_answer的is_finish
  try {
    await db.collection("user_answers").where({
      module_id: module_id
    })
    .update({
      data: {
        is_finish: true
      },
    })
  } catch(e) {
    console.error(e)
  }


  try {
    console.log(score)
    await db.collection("module_history").where({
      _id: module_id
    })
    .update({
      data: {
        done_num:done_count,
        correct_num:correct_count,
        score:score,
        during_time:during_time,
        created_time:time
      },
    })
  } catch(e) {
    console.error(e)
  }
  

  let result= []
  console.log(result_dict)
  for (let[k,v] of result_dict) {
      result.push(v)
  }

  console.log(ans_lst)
  return {
    result,
    score,
    ans_lst,
    user_ans_lst
  }



  function build_ques_ans_dict(data){
    var dict = new Map()
    for(let i = 0;i < data.length;i++){
      dict.set(data[i].question_id, data[i].ans)
    }
    return dict
  }

  function compare_ans(user_dict,ans_dict){
    // user_dict是按照题目顺序的，ans_dict不是按照顺序
    var result_dict = new Map()
    var correct_count = 0
    var done_count = 0
    var ans_lst = []
    var user_ans_lst = []
    var score = 0
    var count = 1
    for(let item of user_dict.keys()){
      ans_lst.push(ans_dict.get(item))
      if(user_dict.get(item) == null){
        user_ans_lst.push("")
      }
      else{
        user_ans_lst.push(user_dict.get(item))
      }
      if(user_dict.get(item) == ans_dict.get(item)){
        correct_count += 1
        result_dict.set(item, true)
        if(count <= 50){
          score += 1
        }
        else{
          score += 2
        }
      }
      else{
        result_dict.set(item, false)
        if(user_dict.get(item) != null){
          done_count += 1
        }
        
      }
    }
    return {
      dict:result_dict,
      correct_count:correct_count,
      done_count:done_count,
      ans_lst:ans_lst,
      user_ans_lst:user_ans_lst,
      score:score
    }
  }

}