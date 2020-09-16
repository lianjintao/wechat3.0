// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 获取题目具体信息（包括题目和答案）
  // 输入： question_id
  // 输出： title、options、ans、analysis、type、difficulty
  const question_id = event.question_id
  const db = cloud.database()
  const ques_res = await db.collection('question').where({
    question_id: question_id
  }).get()
  console.log(ques_res)
  const type = ques_res.data[0].type
  const difficulty = ques_res.data[0].difficulty
  
  const ques_info_res = await db.collection('question_info').where({
    question_id: question_id
  }).get()
  var title = ques_info_res.data[0].title
  const options = ques_info_res.data[0].options
  const ans = ques_info_res.data[0].ans
  const analysis = ques_info_res.data[0].analysis

  if(ques_res.data[0].hasOwnProperty("parent_id")){
    const parent_id = ques_res.data[0].parent_id
    const parent_res = await db.collection('parent_ques').where({
      parent_id: parent_id
    }).field({
      title: true
    }).get()
    var title = parent_res.data[0].title + "\n" + title
  }
  console.log(title)
  return {
    title,
    options,
    ans,
    analysis,
    type,
    difficulty
  }
}