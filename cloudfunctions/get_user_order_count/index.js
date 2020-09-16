// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 根据分类获取用户的答题情况
  // 输入： 
  // 输出： ques_count_lst、user_complete_count_lst
  const db = cloud.database()
  
  var union_id = cloud.getWXContext().OPENID
  if(typeof(union_id)=="undefined"){
    union_id = "123"
  }

  var ques_count_lst = []
  var user_complete_count_lst = [0,0,0,0,0,0,0,0]

  
  var ques_count_res = await db.collection('ques_count')
  .field({
    classify:true,
    count: true
  }).get()

  // console.log(ques_count_res)

  for(let i = 0;i < 8;i++){
    ques_count_lst.push(ques_count_res.data[i].count)
  }
  // console.log(ques_count_lst)

  const $ = db.command.aggregate
  var user_complete_count_res = await db.collection('user_history')
  .aggregate()
  .match({
    union_id:union_id,
    doing_type:1
  })
  .group({
    _id: '$classify',
    count: $.sum(1)
  })
  .end()

  // console.log(user_complete_count_res)
  const lst = user_complete_count_res.list
  for(let i = 0;i < lst.length;i++){
    user_complete_count_lst[lst[i]._id-1] = lst[i].count
  }
  // console.log(user_complete_count_lst)

  return {
    ques_count_lst,
    user_complete_count_lst
  }

}