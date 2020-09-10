// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 获得用户错误的ques_id列表
  // 输入： 无
  // 输出： error_ques_lst
  const db = cloud.database()
  var union_id = cloud.getWXContext().OPENID
  if(typeof(union_id)=="undefined"){
    union_id = "123"
  }

  const $ = db.command.aggregate
  const _ = db.command
  const res = await db.collection('user_history')
  .aggregate()
  .match({
    union_id: union_id,
    result: false,
    is_ignore: _.neq(true)
  })
  .group({
    _id: null,
    question_id: $.addToSet('$question_id')
  })
  .sort({
    update_time:-1
  })
  .end()

  const error_ques_lst = res.list[0].question_id

  console.log(error_ques_lst.length)

  return {
    error_ques_lst
  }
}