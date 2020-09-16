// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 查看历史模考试卷的时候，查看用户填写的具体答案
  // 输入： module_id、question_id
  // 返回： ans
  const db = cloud.database()

  const res = await db.collection("user_answers").where({
    module_id: event.module_id,
    question_id: event.question_id
  }).field({
    ans: true
  }).get()

  console.log(res)
  const ans = res.data[0].ans


  return {
    ans
  }
}