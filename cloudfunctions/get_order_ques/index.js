// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 根据分类获得题目列表
  // 输入：  data.classify:法律分类
  // 输出： questionId_lst列表
  const db = cloud.database()

  var union_id = cloud.getWXContext().OPENID
  if(typeof(union_id)=="undefined"){
    union_id = "123"
  }

  const q_classify = event.classify
  //首先需要获得用户在当前分类（classify）的做题进度
  var res = await db.collection('user_history').where({
    union_id: union_id,
    classify: q_classify,
    doing_type:1
  }).limit(1).field({
    question_id: true
  }).orderBy('update_time', 'desc')
  .get()
  //如果做过此分类，需对比是否为最大值
  if(res.data.length != 0){
    var id_standard = res.data[0].question_id
    var res = await db.collection('ques_count').where({
      classify: q_classify
    }).field({
      count: true
    }).get()
    
    const ques_count = res.data[0].count
    if(id_standard == ques_count){
      id_standard = 0
      console.log("重置")
    }
  }
  
  else{
    var id_standard = 0
  }

  

  // 获取所有比上次做题大的id列表，继续做题
  const _ = db.command
  var res = await db.collection('question').where({
    classify: q_classify,
    question_id: _.gt(id_standard)
  }).limit(50).field({
    question_id: true
  }).get()
  let data = res.data

  // 获得id列表
  let ques_lst = []
  for(let i = 0;i < data.length;i = i + 1){
    ques_lst.push(data[i].question_id)
    console.log(data[i].question_id)
  }

  return {
    ques_lst
  }
}