(() => {
  //获取元素
  const doms = {
    name: document.getElementById("userName"),
    pswd: document.getElementById("userPassword"),
    signin: document.querySelector(".signin")
  }
  // const loginUrl = "https://study.duyiedu.com/api/user/login"
  const loginUrl = "/user/login"

  //发送请求
  async function sendLoginFn() {
    // let response = await fetch(loginUrl, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     loginId: doms.name.value,
    //     loginPwd: doms.pswd.value
    //   })
    // })
    // let res = await response.json()
    // console.log(res)
    // if (res.code === 0) {
    //   window.location.href = "./index.html"
    // } else {
    //   console.log("错误,显示错误信息")
    //   alert(res.msg)
    // }
    const data = await fetchFn({
      url: loginUrl,
      method: "POST",
      params: {
        loginId: doms.name.value,
        loginPwd: doms.pswd.value
      }
    })

    data && sessionStorage.getItem("token") && window.location.replace("/")


  }
  function init() {
    // 监听登录的点击事件
    doms.signin.addEventListener("click", (e) => {
      // 清除表单提交的默认事件
      e.preventDefault()
      // 进行登录请求
      // 使用trim去除输入框中的空格
      if (!doms.name.value.trim() || !doms.pswd.value.trim()) {
        alert("用户名或密码不能为空")
      } else {
        // 一个函数只做一件事,所以我们把发送请求的操作封装成一个函数进行调用
        sendLoginFn()
      }
    })
  }
  init()
})()