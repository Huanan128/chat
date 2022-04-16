(() => {
    let doms = {
        nickName: document.querySelector(".nick-name"),
        accountName: document.querySelector(".account-name"),
        loginTime: document.querySelector(".login-time"),
        closeBtn: document.querySelector(".close"),
        contentBody: document.querySelector(".content-body"),
        sendBtn: document.querySelector(".send-btn"),
        inputContainer: document.querySelector(".input-container"),
        arrowContainer: document.querySelector(".arrow-container"),
        selectContainer: document.querySelector(".select-container"),
        selectContainerItem: document.querySelectorAll(".select-item")
    }

    let page = 0
    let size = 10
    let chatTotal = 0
    let sendMode = "enter"//发送消息的方式

    // 获取用户信息
    async function getUserInfo() {
        const token = sessionStorage.getItem("token")
        let data = await fetchFn({
            url: "/user/profile",
            method: "GET"
        })

        // 将返回的用户信息填充到页面中
        doms.nickName.innerHTML = data.nickname
        doms.accountName.innerHTML = data.loginId
        doms.loginTime.innerHTML = formaDate(data.lastLoginTime)
    }

    // 获取消息
    async function getChat(direction) {
        const data = await fetchFn({
            url: "/chat/history",
            method: "GET",
            params: {
                page,
                size
            }
        })
        chatTotal = data.chatTotal
        if (chatTotal < page * 10) {
            console.log("没有数据了,不再请求")
            return
        }
        // 将内容渲染到页面
        renderChat(data.data, direction)
    }

    // 将消息渲染到页面
    function renderChat(data, direction) {
        // 内容渲染
        if (data.length === 0) {
            doms.contentBody.innerHTML = `
            <div class="chat-container robot-container">
                <img src="./img/robot.jpg" alt="">
                <div class="chat-txt">
                    您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
                </div>
            </div>
            `
            return
        }
        data.reverse()//将数据反向展示

        const chatData = data.map(item => {
            return item.from === 'user'
                ? `<div class="chat-container avatar-container">
                <img src="./img/avtar.png" alt="">
                <div class="chat-txt">${item.content}</div>
               </div>`
                : `<div class="chat-container robot-container">
                <img src="./img/robot.jpg" alt="">
                <div class="chat-txt">
                   ${item.content}
                </div>
               </div>`
        }).join("")
        if (direction === "bottom") {
            // 将滚动条移动到最底部 初始化 发送消息
            doms.contentBody.innerHTML = doms.contentBody.innerHTML + chatData
            let lastEL = document.querySelectorAll(".chat-container")[document.querySelectorAll(".chat-container").length - 1]
            doms.contentBody.scrollTo(0, lastEL.offsetTop)
        } else {
            doms.contentBody.innerHTML = chatData + doms.contentBody.innerHTML
        }
    }

    // 发送消息
    async function sendChat() {
        // 判断输入框是否有值
        const content = doms.inputContainer.value.trim()
        if (!content) {
            alert("发送消息不能为空")
            return
        }
        // 将发送的值填充的页面中
        renderChat([{ content, from: "user" }], "bottom")
        doms.inputContainer.value = ""

        // 发送请求获取机器人返回消息,并填充到页面中
        const data = await fetchFn({
            url: "/chat",
            method: "POST",
            params: {
                content
            }
        })
        renderChat([{ content: data.content, from: "robot" }], "bottom")

    }

    // 聊天记录框滚动事件
    function scrollHandel() {
        // 当滚动条滚动到顶部,需要发送获取下一页数据的请求
        if (doms.contentBody.scrollTop === 0) {
            page = page + 1
            getChat("top")
        }
    }

    // 选择发送消息的快捷方式
    function choiceHandler(e) {
        const changeEl = document.querySelector(".select-item.on")
        changeEl && changeEl.classList.remove("on")
        e.target.classList.add("on")
        doms.selectContainer.style.display = "none";
        sendMode = e.target.getAttribute("type")
    }

    // 监听输入框中键盘的点击事件
    function keyUpHandler(e) {
        console.log(e.keyCode)
        if (e.keyCode === 13 && sendMode === "enter" && !e.ctrlKey || e.keyCode === 13 && sendMode === "ctrlEnter" && e.ctrlKey) {
            sendChat()
        }
    }
    
    // 初始化
    function init() {
        // 获取用户信息
        getUserInfo()
        // 获取聊天接口
        getChat("bottom")
        // 监听发送按钮点击事件
        doms.sendBtn.addEventListener("click", sendChat)
        // 监听聊天记录框滚动事件
        doms.contentBody.addEventListener("scroll", scrollHandel)
        // 监听切换发送快捷键按钮的点击事件
        doms.arrowContainer.addEventListener("click", () => {
            doms.selectContainer.style.display = "block";
        })
        // 监听选择发送快捷键的点击事件
        doms.selectContainerItem.forEach(item => {
            item.addEventListener("click", choiceHandler)
        })
        // 监听键盘按下事件
        doms.inputContainer.addEventListener("keyup", keyUpHandler)
        // 监听关闭事件
        doms.closeBtn.addEventListener("click", () => {
            sessionStorage.removeItem("token")
            window.location.replace("./login")
        })
    }

    init()
})()