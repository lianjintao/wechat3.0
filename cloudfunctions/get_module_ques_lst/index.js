// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 提供给创建模考试卷的接口
  // 输入：is_choice(是否为选择题，bool)
  // 输出： ques_lst, module_id
  const db = cloud.database()
  const is_choice = event.is_choice
  var union_id = cloud.getWXContext().OPENID
  if(typeof(union_id)=="undefined"){
    union_id = "123"
  }
  ques_lst = []
  if(is_choice){
    // 生成客观题试卷
    var res = await db.collection("question")
    .aggregate()
    .match({
      type: 1
    })
    .sample({
      size: 50
    })
    .limit(50)
    .end()
    var data = res.list
    for(let i = 0;i < data.length;i++){
      ques_lst.push(data[i].question_id)
    }

    var res = await db.collection("question")
    .aggregate()
    .match({
      type: 2
    })
    .sample({
      size: 35
    })
    .limit(50)
    .end()
    var data = res.list
    for(let i = 0;i < data.length;i++){
      ques_lst.push(data[i].question_id)
    }

    var res = await db.collection("question")
    .aggregate()
    .match({
      type: 3
    })
    .sample({
      size: 15
    })
    .limit(50)
    .end()
    var data = res.list
    for(let i = 0;i < data.length;i++){
      ques_lst.push(data[i].question_id)
    }
    
  }
  else{
    // 生成主观题试卷
    const ques_num = 7
    random_res = await db.collection("parent_ques")
    .aggregate()
    .match({
      type:4
    })
    .sample({
      size: ques_num
    })
    .end()

    console.log(random_res)
    
    for(let i = 0;i < random_res.list.length;i++){
      ques_lst = ques_lst.concat(random_res.list[i].child_ques)
      console.log(random_res.list[i].child_ques)
    }
    console.log(ques_lst)
  }

  // 更新module中的数据，创建新的module
  var time = new Date()
  time.setTime(time.getTime())
  var module_res = await db.collection("module_history").add({
    data:{
      union_id:union_id,
      is_choice: is_choice,
      ques_lst:ques_lst,
      ques_num: ques_lst.length,
      done_num:null,
      correct_num:null,
      score:null,
      during_time:"",
      created_time:time
    }
  })
  console.log(module_res)
  const module_id = module_res._id

  // 更新user_anser中的数据，创建所有ques_id的记录
  insert_lst = []
  for(let i = 0;i < ques_lst.length;i++){
    insert_dict = {
      union_id: union_id,
      question_id: ques_lst[i],
      module_id: module_id,
      ans: null,
      is_finish: false,
      update_time: time,
    }
    insert_lst.push(insert_dict)
  }
  try {
    await db.collection("user_answers").add({
      data: insert_lst
    })
  } catch(e) {
    console.error(e)
  }

  return {
    ques_lst,
    module_id
  }
}