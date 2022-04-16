(() => {
    const doms = {
        name: document.querySelector("#userName"),
        nickName: document.querySelector("#userNickname"),
        pswd: document.querySelector("#userPassword"),
        confirmPswd: document.querySelector("#userConfirmPassword"),
        signin: document.querySelector(".signin")
    }

    // const registerUrl = "https://study.duyiedu.com/api/user/reg"
    // const verificationUrl = "https://study.duyiedu.com/api/user/exists"
    const registerUrl = "/user/reg"
    const verificationUrl = "/user/exists"

    let isExistence = false
    // 发送验证用户名请求
    async function verificationFn(value) {
        // // 注意在写query参数的时候=两边不要加空格
        // const res = await fetch(verificationUrl + `?loginId=${value}`)
        // const response = await res.json()
        // if(response.data){
        //     isExistence = true;
        //     alert("账号已存在")
        // }else{
        //     isExistence = false;
        // }
        const data = await fetchFn({ url: verificationUrl, method: "GET", params: { loginId: value } })
        console.log(data)
        if (data) {
            isExistence = true;
            alert("账号已存在")
        } else {
            isExistence = false;
        }
    }

    // 发送用户注册请求
    async function registerFn(loginId, nickname, loginPwd) {
        // let res = await fetch(registerUrl, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         loginId, nickname, loginPwd
        //     })
        // })
        // const response = await res.json()
        // console.log(response)
        // if (response.code === 0) {
        //     window.location.replace("/")
        // } else {
        //     alert(response.msg)
        // }
        const data = await fetchFn({
            url: registerUrl,
            method: "POST",
            params: {
                loginId, nickname, loginPwd
            }
        })
        data && window.location.replace("/")
    }

    // 初始化
    function init() {
        // 监听用户名输入框失去焦点的事件
        doms.name.addEventListener("blur", (e) => {
            let value = doms.name.value.trim()
            if (value) {
                verificationFn(value)
            }
        })
        //监听用户点击注册按钮事件
        doms.signin.addEventListener("click", (e) => {
            // 清除表单默认事件
            e.preventDefault()
            const loginId = doms.name.value.trim()
            const nickname = doms.nickName.value.trim()
            const loginPwd = doms.pswd.value.trim()
            const confirmPswd = doms.confirmPswd.value.trim()
            switch (true) {
                case !loginId: alert("用户名不能为空")
                    return
                case !nickname: alert("昵称不能为空")
                    return
                case !loginPwd: alert("密码不能为空")
                    return
                case !confirmPswd: alert("确认密码不能为空")
                    return
                case loginPwd !== confirmPswd: alert("两次输入的密码不一致")
                    return
                case isExistence: alert("账号已存在")
                    return
                default: registerFn(loginId, nickname, loginPwd)
            }
        })
    }

    init()
})()