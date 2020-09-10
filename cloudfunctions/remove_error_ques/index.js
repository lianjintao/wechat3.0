// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 移出该题
  // 输入：question_id
  const db = cloud.database()
  const question_id = event.question_id

  var union_id = cloud.getWXContext().OPENID
  if(typeof(union_id)=="undefined"){
    union_id = "123"
  }

  try {
    return await db.collection("user_history").where({
      union_id: union_id,
      question_id: question_id
    })
    .update({
      data: {
        is_ignore:true
      },
    })
  } catch(e) {
    console.error(e)
  }

}