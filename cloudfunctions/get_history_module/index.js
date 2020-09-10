// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 返回曾经做过的模考试卷历史
  // 输入： 无
  // 输出： module_id_lst、ques_num_lst、score_lst、time_lst
  const db = cloud.database()
  var union_id = cloud.getWXContext().OPENID
  if(typeof(union_id)=="undefined"){
    union_id = "123"
  }

  const module_res = await db.collection("module_history").where({
    union_id:union_id,
  }).field({
    _id:true,
    ques_num:true,
    score:true,
    created_time:true
  }).get()
  console.log(module_res)
  var module_id_lst = []
  var ques_num_lst = []
  var score_lst = []
  var time_lst = []
  const data = module_res.data

  for(let i = 0;i < data.length;i++){
    module_id_lst.push(data[i]._id)
    ques_num_lst.push(data[i].ques_num)
    score_lst.push(data[i].score)
    time_lst.push(data[i].created_time)
  }


  return {
    module_id_lst,
    ques_num_lst,
    score_lst,
    time_lst
  }
}