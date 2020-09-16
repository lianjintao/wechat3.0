// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 更新用户记录的答案（未提交的）
  // 输入参数： question_id、module_id、ans
  const db = cloud.database()
  var union_id = cloud.getWXContext().OPENID
  if(typeof(union_id)=="undefined"){
    union_id = "123"
  }
  //当传入ans为""时，置为null
  var ans = ans_transfer(event.ans)
  var is_finish = true

  var time = new Date()
  time.setTime(time.getTime())
  try {
    return await db.collection("user_answers").where({
      union_id: union_id,
      question_id: event.question_id,
      module_id: event.module_id
    })
    .update({
      data: {
        ans: ans,
        update_time: time,
        is_finish:is_finish
      },
    })
  } catch(e) {
    console.error(e)
  }

  function ans_transfer(ans){
    var res_str = ""
    var lst = ["A","B","C","D"]
    console.log()
    for(let i = 0;i < 4;i++){
      if(ans.indexOf(lst[i]) >= 0){
        res_str += lst[i]
      }
    }
    console.log(res_str)
    return res_str
  }

}