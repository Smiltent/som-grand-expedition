
const themes = [
    {"name": "main", "bg": "/assets/1_main.png"},
    {"name": "basement", "bg": "/assets/2_basement.png"},
    {"name": "crystal", "bg": "/assets/3_crystal.png"}
]

// const initText = [
//     {"t": "didnt ask lmao!", "to": 500},
//     {"t": "come in my crib tho", "to": 1000},
//     {"t": "theres not much here", "to": 1000, bg: true},
//     {"t": "but if you go downstairs", "to": 1000},
//     {"t": "theres a buletin board with some info", "to": 1000},
//     {"t": "idk why its there, but its pretty cool ngl", "to": 3000},
//     {"t": "wait you think i have more to say?", "to": 2800},
//     {"t": "you can click on me to talk if you want", "to": 1, click: true}
// ]
const initText = [
    {"t": "dev!", "to": 1, click: true, bg: true}
]

var allowClickingDave = false
var currentTheme = themes[0]

// Json object list with dave's responces
var daveTextList = fetch("/assets/text.json").then(response => response.json())

var daveLocation = document.getElementById("daveLoc") // Parent of all elements below
var daveText = document.getElementById("daveText") // Dave Text (above)
var daveImage = document.getElementById("daveCharacter") // Dave Image (center)
var daveTextBox = document.getElementById("daveTextBox") // Dave Text Box (below, used once)

// Dave Text Animation
// handling the text animation at the begining of the page
function daveTextAnimation(t, speed) {
    var index = 0
    var allow = true
    daveText.innerHTML = ""

    // create an internal function, that handles the typing mechanism
    function type() {
        var text = t.charAt(index++)
        var speedMod = speed

        daveText.innerHTML += text
        if (text === "," || text === "!" || text === "?") { speedMod += 100 } // if theres punctuation, add longer delay

        // If allow is true, dont continue. Else, continue
        if (!allow || index >= t.length) {
            allow = false
        } else {
            setTimeout(type, speedMod)
        }
    }

    type()
}

// On Load
// the... uhh.. 🤔 (i forgor) uhm.. thing!!
window.addEventListener('DOMContentLoaded', () => {
    var text = "Ask me anything..."
    var textSpeed = 1 // 120

    setTimeout(() => {
        daveTextAnimation(text, textSpeed)

        setTimeout(() => {
            daveTextBox.style.opacity = 1
        }, textSpeed * text.length + textSpeed)
    }, 3000)
})

// On Enter Press in the Question Box
// handle animations when submitted the question
daveTextBox.addEventListener("keydown", function(event) {
    const textSpeed = 75

    if (event.key === "Enter") {
        if (!daveTextBox.value.endsWith("?")) {
            daveTextAnimation("Thats not a question...", 1) // 120
            return
        }

        event.preventDefault()

        daveTextBox.style.opacity = 0

        var delay = 0
        initText.forEach(e => {
            setTimeout(() => {
                daveTextAnimation(e.t, textSpeed)

                if (e.bg) { daveLocation.style.backgroundColor = "transparent" }
                if (e.click) { 
                    allowClickingDave = true 
                    daveImage.style.cursor = "pointer"
                }
            }, delay)
            delay += (textSpeed * e.t.length) + e.to
        })
    }
})

// On Dave Click
// handle clicking on dave (my bad for forcing him to be clicked)
daveImage.addEventListener("click", function() {
    if (allowClickingDave) {
        allowClickingDave = false
        daveImage.style.cursor = "not-allowed"

        daveTextList.then(values => {
            const randomIndex = Math.floor(Math.random() * values.length)
            var text = values[randomIndex]

            if (daveImage.classList.contains("hasHat") || daveImage.classList.contains("hasOnlyHat")) {
                daveImage.src = "/assets/dave.png"
                daveImage.classList.remove("hasHat", "hasOnlyHat")
            }

            // custom tags handling custom situations
            if (text.startsWith("<hat>")) {
                daveImage.src = "/assets/davenohat.png";
                text = text.replace("<hat>", "").trim();
                daveImage.classList.add("hasHat");
            } else if (text.startsWith("<onlyhat>")) {
                daveImage.src = "/assets/daveonlyhat.png";
                text = text.replace("<onlyhat>", "").trim();
                daveImage.classList.add("hasOnlyHat");
            }

            daveTextAnimation(text, 50)
            setTimeout(() => {
                allowClickingDave = true
                daveImage.style.cursor = "pointer"
            }, text.length * 50)
        })
    }
})