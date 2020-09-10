// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 用于模考当中获取做题情况
  // 输入：module_id
  // 输出： done_lst
  const db = cloud.database()
  const module_id = event.module_id
  const res = await db.collection("user_answers").where({
    module_id:module_id
  }).field({
    is_finish:true
  })
  .limit(100)
  .get()

  const data = res.data
  var done_lst = []
  for(let i = 0;i < data.length;i++){
    done_lst.push(data[i].is_finish)
  }
  

  return {
    done_lst
  }
}