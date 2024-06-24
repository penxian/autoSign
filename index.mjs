import got from "got";
let cookie = process.env.COOKIE;

async function getGrowthSign() {
  let url = "https://drive-m.quark.cn/1/clouddrive/capacity/growth/sign?";
  const querystring = { pr: "ucpro", fr: "pc", uc_param_str: "" };
  url = url + new URLSearchParams(querystring).toString();
  const payload = { sign_cyclic: true };
  const data = await got
    .post(url, {
      method: "post",
      headers: {
        cookie
      },
      json: payload
    })
    .json();
  if (data.data) {
    return data?.data?.sign_daily_reward;
  } else {
    return null;
  }
}

// 查询签到情况
async function getGrowthInfo() {
  let url = "https://drive-m.quark.cn/1/clouddrive/capacity/growth/info?";
  const querystring = { pr: "ucpro", fr: "pc", uc_param_str: "" };
  url = url + new URLSearchParams(querystring).toString();
  const data = await got(url, {
    method: "get",
    headers: {
      cookie
    }
  }).json();
  if (data.data) {
    return data.data;
  } else {
    return null;
  }
}

async function getAccountInfo() {
  let url = "https://pan.quark.cn/account/info?";
  const querystring = { fr: "pc", platform: "pc" };
  url = url + new URLSearchParams(querystring).toString();
  const data = await got(url, {
    method: "get",
    headers: {
      cookie
    }
  }).json();

  if (data.success) {
    return data.data;
  } else {
    return null;
  }
}

(async () => {
  if (!cookie) {
    console.log("请设置 COOKIE 环境变量");
    return;
  }
  const userinfo = await getAccountInfo();
  if (userinfo) {
    const signInfo = await getGrowthInfo();
    console.log("签到情况", signInfo?.cap_sign?.sign_daily);
    if (signInfo?.cap_sign?.sign_daily) {
      const msg = `✅执行签到: 今日已签到+${
        signInfo["cap_sign"]["sign_daily_reward"] / 1024 / 1024
      }MB，
      连签进度(${
        signInfo["cap_sign"]["sign_progress"] /
        signInfo["cap_sign"]["sign_target"]
      })`;
      console.log(msg);
    } else {
      const growthSign = await getGrowthSign();
      if (growthSign) {
        const msg = `✅ 执行签到: 今日签到+${growthSign / 1024 / 1024}MB，
        连签进度(${
          (signInfo["cap_sign"]["sign_progress"] + 1) /
          signInfo["cap_sign"]["sign_target"]
        })`;
        console.log("签到成功", msg);
      } else {
        console.log("签到失败");
      }
    }
  } else {
    console.log("cookie失效");
  }
})();
