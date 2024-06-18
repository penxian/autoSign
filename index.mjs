import minimist from 'minimist'
let cookie = process.env.COOKIE

function getGrowthSign() {
  let url =  "https://drive-m.quark.cn/1/clouddrive/capacity/growth/sign?"
  const querystring = {"pr": "ucpro", "fr": "pc", "uc_param_str": ""}
  url = url + new URLSearchParams(querystring).toString()
  const payload = {"sign_cyclic": true}
  return fetch(url, {
    method: 'post',
    headers: {
      cookie
    },
    body: JSON.stringify(payload)
  }).then((res) => res.json()).then((data) => {
    console.log(data)
    if (data.data) {
      return data?.data?.sign_daily_reward
    } else {
      return null
    }
  })
}

// 查询签到情况
function getGrowthInfo() {
  let url = "https://drive-m.quark.cn/1/clouddrive/capacity/growth/info?"
  const querystring = {"pr": "ucpro", "fr": "pc", "uc_param_str": ""}
  url = url + new URLSearchParams(querystring).toString()
  return fetch(url, {
    method: 'get',
    headers: {
      cookie
    }
  }).then((res) => res.json()).then((data) => {
    if (data.data) {
      return data.data
    } else {
      return null
    }
  })
}

function getAccountInfo() {
  let url = "https://pan.quark.cn/account/info?"
  const querystring = {"fr": "pc", "platform": "pc"}
  url = url + new URLSearchParams(querystring).toString()
  return fetch(url, {
    method: 'get',
    headers: {
      cookie
    }
  }).then((res) => res.json()).then((data) => {
    if (data.success) {
      return data.data
    } else {
      return null
    }
  })
}


(async () => {
  console.log(process.env.COOKIE, cookie)
  const userinfo = await getAccountInfo()
  if (!userinfo) {
    console.log('昵称', userinfo['nickname'])
    const signInfo = await getGrowthInfo()
    console.log('签到情况', signInfo?.cap_sign?.sign_daily)
    if (signInfo?.cap_sign?.sign_daily) {
      const msg = `✅执行签到: 今日已签到+${signInfo['cap_sign']['sign_daily_reward'] / 1024 / 1024}MB，
      连签进度(${signInfo['cap_sign']['sign_progress']/signInfo['cap_sign']['sign_target']})`
      console.log(msg)
    } else {
      const growthSign = await getGrowthSign()
      console.log('签到结果', growthSign)
      if (growthSign) {
        const msg = `✅ 执行签到: 今日签到+${growthSign / 1024 / 1024}MB，
        连签进度(${(signInfo['cap_sign']['sign_progress'] + 1)/signInfo['cap_sign']['sign_target']})`
        console.log('签到成功', msg)
      }
    }
  }
})()