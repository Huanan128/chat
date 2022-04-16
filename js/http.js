const BASE_URL = "https://study.duyiedu.com/api"

async function fetchFn({ url, method = "GET", params = {} }) {
    // 如果是get请求并且有参数，那么对请求路径进行拼接
    if (method === "GET" && Object.entries(params).length) {
        url = url + "?" + Object.entries(params).map(key => {
            return `${key[0]}=${key[1]}&`
        }).join("")
    }
    let extendsObj = {}
    sessionStorage.getItem("token") && (extendsObj.Authorization = "Bearer " + sessionStorage.getItem("token"))

    try {
        const res = await fetch(BASE_URL + url, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...extendsObj
            },
            body: method === "GET" ? null : JSON.stringify(params)
        })
        // 判断是否有token，有就存储到sessionStorage中
        const token = res.headers.get("authorization")
        token && sessionStorage.setItem("token", token)
        const response = await res.json()
        if (response.code === 0) {
            console.log(response)
            if(response.hasOwnProperty("chatTotal")){
                console.log(response.chatTotal,response.data)
                return {chatTotal:response.chatTotal,data:response.data}
            }
            return response.data
        } else {
            /* 权限错误处理 */
            if (response.status === 401) {
                window.alert('权限token不正确')
                sessionStorage.removeItem('token')
                window.location.replace('/login.html')
                return
            }
            alert(response.msg)
        }

    } catch (err) {
        console.log("错误信息", err)
    }

}

// const params = {age:1,name:"huanan"}

// console.log(Object.entries(params))