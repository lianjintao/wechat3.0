// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 用于错题本展示多少错题页面
  // 输入：无
  // 返回： error_num
  const db = cloud.database()

  var union_id = cloud.getWXContext().OPENID
  if(typeof(union_id)=="undefined"){
    union_id = "123"
  }

  const _ = db.command
  const res = await db.collection('user_history')
  .aggregate()
  .match({
    union_id: "123",
    result: false,
    is_ignore: _.neq(true)
  })
  .group({
    // 按 category 字段分组
    _id: '$question_id',
  })
  .count('count')
  .end()

  console.log(res)
  const error_num = res.list[0].count

  return {
    error_num
  }
}