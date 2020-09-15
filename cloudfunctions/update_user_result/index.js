// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  // 更新用户做题结果
  // 输入: data.question_id, data.result, data.doing_type
  var union_id = cloud.getWXContext().OPENID
  if(typeof(union_id)=="undefined"){
    union_id = "123"
  }
  console.log(union_id)

  const question_id = event.question_id
  const result = event.result
  if(event.hasOwnProperty("doing_type")){
    var doing_type = event.doing_type
  }
  var doing_type = 1

  const db_name = "user_history"
  const db = cloud.database()
  var time = new Date()
  time.setTime(time.getTime())
  //首先在history表中判断是否存在记录（曾经做过）
  var his_count = await db.collection(db_name)
  .where({
    union_id:union_id,
    question_id:question_id,
    doing_type: doing_type
  }).count()

  console.log(his_count)

  if(his_count['total'] > 0){
    // 执行更新操作（updatetime、result）
    try {
      return await db.collection(db_name).where({
        union_id: union_id,
        question_id: question_id,
        doing_type: doing_type
      })
      .update({
        data: {
          result: result,
          update_time: time
        },
      })
    } catch(e) {
      console.error(e)
    }
  }
  else{
    // 执行插入操作
    // 首先获得question_id的type和classify
    var res = await db.collection("question")
    .where({
      question_id:question_id
    }).field({
      type: true,
      classify: true
    }).get()
    const type = res.data[0].type
    const classify = res.data[0].classify
    try {
      return await db.collection(db_name).add({
        // data 字段表示需新增的 JSON 数据
        data: {
          union_id: union_id,
          question_id: question_id,
          type: type,
          classify: classify,
          created_time: time,
          update_time: time,
          result: result,
          doing_type: doing_type
        }
      })
    } catch(e) {
      console.error(e)
    }
  }
}