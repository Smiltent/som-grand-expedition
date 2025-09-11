
var allowClicking = false

var daveValues = fetch("/assets/text.json").then(response => response.json())

var initText = [
    {"t": "didnt ask lmao!", "to": 500},
    {"t": "come in my crib tho", "to": 1000},
    {"t": "theres not much here", "to": 1000, bg: true},
    {"t": "but if you go downstairs", "to": 1000},
    {"t": "theres a buletin board with some info", "to": 1000},
    {"t": "idk why its there, but its pretty cool ngl", "to": 3000},
    {"t": "wait you think i have more to say?", "to": 2800},
    {"t": "you can click on me to talk if you want", "to": -1, click: true}
]

// Dave Text Animation
// handling the text animation at the begining of the page
var i = 0
var allow = true
function daveTextAnimation(text, speed) {
    let index = 0;
    allow = true;
    document.getElementById("davetext").innerHTML = "";

    function type() {
        if (!allow || index >= text.length) {
            allow = false;
            return;
        }
        document.getElementById("davetext").innerHTML += text.charAt(index++);
        setTimeout(type, speed);
    }

    type();
}

// On Load
// the... uhh.. 🤔 (i forgor) uhm.. thing!!
window.addEventListener('DOMContentLoaded', () => {
    var text = "Ask me anything..."
    var textSpeed = 120

    setTimeout(() => {
        daveTextAnimation(text, textSpeed);

        setTimeout(() => {
            document.getElementById("davetextbox").style.opacity = 1
        }, textSpeed * text.length + textSpeed)
    }, 3000)
})

// On Enter Press in the Question Box
// handle animations when submitted the question
document.getElementById("davetextbox").addEventListener("keydown", function(event) {
    var textSpeed = 75

    if (event.key === "Enter") {
        event.preventDefault()

        document.getElementById("davetextbox").style.opacity = 0

        let delay = 0;
        initText.forEach(e => {
            setTimeout(() => {
                document.getElementById("davetext").innerHTML = ""
                allow = true

                daveTextAnimation(e.t, textSpeed)

                if (e.bg) { document.getElementById("davequestion").style.backgroundColor = "transparent" }
                if (e.click) { 
                    allowClicking = true 
                    document.getElementById("dave").style.cursor = "pointer"
                }
            }, delay)
            delay += (textSpeed * e.t.length) + e.to;
        })
    }
})

// On Dave Click
// handle clicking on dave (my bad for forcing him to be clicked)
document.getElementById("dave").addEventListener("click", function() {
    if (allowClicking) {
        allowClicking = false
        document.getElementById("dave").style.cursor = "not-allowed"

        daveValues.then(values => {
            const randomIndex = Math.floor(Math.random() * values.length);
            var text = values[randomIndex]

            if (document.getElementById("dave").src == "/assets/davenohat.png") {
                document.getElementById("dave").src = "/assets/dave.png"
            }

            if (text.startsWith("<hat>")) {
                text = text.replace("<hat>", "").trim();
                document.getElementById("dave").src = "/assets/davenohat.png"
            }
            
            setTimeout(() => {
                daveTextAnimation(text, 75);

                allowClicking = true
                document.getElementById("dave").style.cursor = "pointer"
            }, text.length * 75)
        })
    }
})