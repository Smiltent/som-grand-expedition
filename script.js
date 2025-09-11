
var aa_text = "Ask me anything..."
var ab_text = "didn't ask lmao! come in my crib tho"

// Dave Text Animation
// handling the text animation at the begining of the page
var i = 0
var allow = true
function daveTextAnimation(text, speed) {
    if (allow) {
        if (i < text.length) {
            document.getElementById("davetext").innerHTML += text.charAt(i)
            i++
            setTimeout(() => daveTextAnimation(text, speed), speed)
        } else {
            allow = false
        }
    }
}

// On Load
// the... uhh.. 🤔 (i forgor) uhm.. thing!!
window.addEventListener('DOMContentLoaded', () => {
    var textSpeed = 120;

    setTimeout(() => {
        daveTextAnimation(aa_text, textSpeed);

        setTimeout(() => {
            document.getElementById("davetextbox").style.opacity = 1
        }, textSpeed * aa_text.length + textSpeed)
    }, 3000)
})

document.getElementById("davetextbox").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault()

        document.getElementById("davetextbox").style.opacity = 0

        setTimeout(() => {
            document.getElementById("davetext").innerHTML = ""
            i = 0
            allow = true

            daveTextAnimation(ab_text, 75)
        }, 750)
    }
})