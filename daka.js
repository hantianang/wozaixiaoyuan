const KEY = 'JWSESSION'

function GetSeq(){
  const myDate = new Date()
  const hours = myDate.getHours()
  if(0<=hours && hours<=8){
    return 1
  }
  if(11<=hours && hours<=14){
    return 2
  }
  if(17<=hours && hours<=22){
    return 3
  }
  return -1
}

function Sign(){
  const url = `https://student.wozaixiaoyuan.com/heat/save.json`;
  const method = `POST`;
  const headers = {
  'Accept-Encoding' : `gzip,compress,br,deflate`,
  'content-type' : `application/x-www-form-urlencoded`,
  'Connection' : `keep-alive`,
  'Referer' : `https://servicewechat.com/wxce6d08f781975d91/149/page-frame.html`,
  'Host' : `student.wozaixiaoyuan.com`,
  'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.18(0x17001229) NetType/4G Language/zh_CN`,
  'JWSESSION' : $prefs.valueForKey(KEY)
  };
  
  seq = GetSeq()
  if (seq == -1) {
    $notify("打卡失败","不在打卡时段")
    return
  }

  //const body =  `answers=["0"]&seq=`+ seq + `&temperature=温度&userId=&latitude=经度&longitude=纬度&country=中国&city=XX市&district=XX区&province=XX省&township=XX街道&street=XXXXX地址&myArea=`
  const body = `answers=%5B%220%22%2C%220%22%2C%221%22%5D&latitude=34.01085662841797&longitude=108.75390625&country=%E4%B8%AD%E5%9B%BD&city=%E8%A5%BF%E5%AE%89%E5%B8%82&district=%E9%84%A0%E9%82%91%E5%8C%BA&province=%E9%99%95%E8%A5%BF%E7%9C%81&township=%E8%8D%89%E5%A0%82%E8%A1%97%E9%81%93&street=%E4%B8%AD%E5%BF%83%E8%A1%97&areacode=610118"`
  
  const myRequest = {
      url: url,
      method: method,
      headers: headers,
      body: body
  };
  $task.fetch(myRequest).then(response => {
    const data = JSON.parse(response.body)
    if(data.code == 0){
      $notify("打卡成功","打卡成功","打卡成功")
      $done()
    } else {
      $notify("打卡失败","打卡失败","打卡失败")
      $done()
  }
  }, reason => {
      $notify("打卡失败","打卡失败","打卡失败")
      $done()
  });
}

function GetToken(){
  if($request.headers){
   const token = $request.headers[KEY]
   $prefs.setValueForKey(token,KEY)
   $notify("获取token成功","",token)
 } 
}

function ReadToken(){
const isRequest = typeof $request != "undefined"
 if(isRequest){
  const isPost = $request.method == "POST"
  if(isPost){
   GetToken()
   Sign()
  } else {
   $done()
  }
 }
 Sign()
 
}

ReadToken()
