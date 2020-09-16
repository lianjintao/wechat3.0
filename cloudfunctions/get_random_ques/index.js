// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 根据分类的情况，随机返回符合的题目
  // 输入： type、classify、num、difficulty
  const db = cloud.database()
  const num = event.num

  var union_id = cloud.getWXContext().OPENID
  if(typeof(union_id)=="undefined"){
    union_id = "123"
  }

  condition_dict = {}
  condition_dict['type'] = event.type
  if(event.type == 4){
    var is_choice = false
  }
  else{
    var is_choice = true
  }
  if(event.hasOwnProperty("classify")){
    if(event.classify>0){
      condition_dict['classify'] = event.classify
    }
  }
  if(event.hasOwnProperty("difficulty")){
    if(event.difficulty>0){
      condition_dict['difficulty'] = event.difficulty
    }
  }
  
  console.log(num)

  // 获得指定数目和条件的question_lst
  random_res = await db.collection("question")
    .aggregate()
    .match(condition_dict)
    .sample({
      size: num
    })
    .limit(num)
    .end()
  
  console.log(random_res)
  ques_lst = []
  data = random_res.list
  for(let i = 0;i < data.length;i = i + 1){
    ques_lst.push(data[i].question_id)
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