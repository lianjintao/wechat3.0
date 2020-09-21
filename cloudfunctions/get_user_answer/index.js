// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 用于模考答题中获取用户某题的未提交的答案
  // 输入： question_id、module_id
  // 输出： ans
  const db = cloud.database()
  console.log(event)
  const ans_res = await db.collection("user_answers").where({
    question_id: event.question_id,
    module_id: event.module_id
  }).get()

  console.log(ans_res)
  const ans = ans_res.data[0].ans


  return {
    ans
  }
}