document.getElementById("nav").style.width = (window.innerWidth - 100) + "px"

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function welcome_go_up() {
    await sleep(500)
    var element = document.getElementsByClassName("welcome_div")[0]
    console.log(window.innerHeight)
    element.style.marginTop = (window.innerHeight / 10) + "px";
}

async function underline() {
    await sleep(1)
    var element = document.getElementById("underline")
    element.style.marginRight = "0px"
}

async function redirect(url) {
    await sleep(1000)
    window.location.href = url
}

async function login_popup() {
    element = (document.getElementsByClassName("login_form")[0])
    element.style.opacity = "100"
    element.style.zIndex = "100"
    element = document.getElementsByClassName("left")[0]
    element.style.opacity = "0"

}

async function login_popup_close() {
    element = (document.getElementsByClassName("login_form")[0])
    element.style.opacity = "0"
    element.style.zIndex = "0"
    element = document.getElementsByClassName("left")[0]
    element.style.opacity = "100"

}

welcome_go_up()

underline()