// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 根据输入的module_id获得该module的结果
  // 输入： module_id
  // 输出： ques_lst、result_lst [根据具体页面设计调整]
  const db = cloud.database()
  const module_id = event.module_id
  const module_res = await db.collection("module_history").where({
    _id: module_id
  }).field({
    ques_lst:true
  }).get()
  console.log(module_res)
  const ques_lst = module_res.data[0].ques_lst

  const result_res = await db.collection("user_history").where({
    module_id:module_id
  }).field({
    question_id:true,
    result: true
  }).get()
  
  console.log(result_res)
  var result_dict = {}
  for(let i = 0;i < result_res.data.length;i++){
    result_dict[result_res.data[i].question_id] = result_res.data[i].result
  }
  console.log(result_dict)
  

  return {
    ques_lst,
    result_dict
  }
}