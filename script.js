
// location System
const locations = [
    {"name": "daveLocation"},
    {"name": "atticLocation"},
    {"name": "basementALocation"},
    {"name": "basementBLocation"},
    {"name": "outsideALocation"},
    {"name": "outsideBLocation"},
    {"name": "crystalLocation"},
    {"name": "hobbitLocation"}
]
var currentLocation = "daveLocation"

// dave Texts on start
const initText = [
    {"t": "didnt ask lmao!", "to": 500},
    {"t": "come in my crib tho", "to": 1000},
    {"t": "theres not much here", "to": 1000, bg: true},
    {"t": "but if you go downstairs", "to": 1000},
    {"t": "theres a bulletin board with some info", "to": 1000},
    {"t": "idk why its there, but its pretty cool ngl", "to": 3000},
    {"t": "wait you think i have more to say?", "to": 2800},
    {"t": "you can click on me to talk if you want", "to": 100, click: true}
]

const initTextAfterExplsion = [
    {"t": "didnt ask lmao!", "to": 500},
    {"t": "come in my crib tho", "to": 1000},
    {"t": "theres not much here", "to": 100, bg: true},
    {"t": "wait i know you...", "to": 1000},
    {"t": "YOU BROKE THE CRYSTAL!!", "to": 1000},
    {"t": "i cant believe this", "to": 1000},
    {"t": "because of you, the world reset", "to": 1000},
    {"t": "good thing i backed up the scene yesterday", "to": 1000},
    {"t": "but still...", "to": 1000},
    {"t": "you owe me big time", "to": 3000},
    {"t": "at this point, do i want to talk to you?", "to": 100, click: true}
]

// allow clicking dave
var allowClickingDave = false

// json object list with dave's responces
var daveTextList = fetch("/assets/text.json").then(response => response.json())

// location elements
var transitionLocation = document.getElementById("transitionLocation") 
var daveLocation = document.getElementById("daveLocation") 
var basementALocation = document.getElementById("basementALocation") 
var basementBLocation = document.getElementById("basementBLocation") 
var outsideALocation = document.getElementById("outsideALocation") 
var outsideBLocation = document.getElementById("outsideBLocation") 
var atticLocation = document.getElementById("atticLocation") 
var crystalLocation = document.getElementById("crystalLocation") 
var hobbitLocation = document.getElementById("hobbitLocation") 

//// parent elements of daveLocation
var daveText = document.getElementById("daveText") // Dave Text (above)
var daveImage = document.getElementById("daveCharacter") // Dave Image (center)

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

// Location Change Handler
// handles changing locations when buttons are pressed
function changeLocation(to) {
    if (!locations.some(e => e.name === to)) return
    var loc = locations.find(e => e.name === to)

    document.getElementById(currentLocation).classList.add("hidden")

    currentLocation = to
    document.getElementById(currentLocation).classList.remove("hidden")
}

// On Load
// the... uhh.. 🤔 (i forgor) uhm.. thing!!
window.addEventListener('DOMContentLoaded', () => {
    var text = "Ask me anything..."
    var textSpeed = 120

    setTimeout(() => {
        daveTextAnimation(text, textSpeed)

        setTimeout(() => {
            document.getElementById("daveTextBox").style.visibility = "visible"
            document.getElementById("daveTextBox").style.opacity = "1"
        }, textSpeed * text.length + textSpeed)
    }, 3000)

    // dotted text animation for transition text
    setInterval(() => {
        var dotText = document.getElementById("transitionDottedText")
        
        if (dotText.innerText.length >= 3) {
            dotText.innerText = ""
        } else {
            dotText.innerText += "."
        }
    }, 200)
})

// On Enter Press in the Question Box
// handle animations when submitted the question
document.getElementById("daveTextBox").addEventListener("keydown", function(event) {
    const textSpeed = 75

    if (event.key === "Enter") {
        if (!document.getElementById("daveTextBox").value.endsWith("?")) {
            daveTextAnimation("Thats not a question...", 120)
            return
        }

        event.preventDefault()
        document.getElementById("daveTextBox").style.opacity = "0"

        if (localStorage.getItem("bigBang") === "true") {
            initText = initTextAfterExplsion
        }

        var delay = 0
        initText.forEach(e => {
            setTimeout(() => {
                daveTextAnimation(e.t, textSpeed)

                if (e.bg) { 
                    document.getElementById("daveBg").style.visibility = "visible"
                    document.getElementById("daveBtnDownstairs").style.removeProperty("visibility")
                }
                if (e.click) { 
                    allowClickingDave = true 
                    daveImage.style.cursor = "pointer"
                }
            }, delay)
            delay += (textSpeed * e.t.length) + e.to
        })
        setTimeout(() => {
            document.getElementById("daveTextBox").remove()
        }, delay)
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
                daveImage.src = "/assets/dave/dave.png"
                daveImage.classList.remove("hasHat", "hasOnlyHat")
            }

            // custom tags handling custom situations
            if (text.startsWith("<hat>")) {
                daveImage.src = "/assets/dave/davenohat.png"
                text = text.replace("<hat>", "").trim()
                daveImage.classList.add("hasHat")
            } else if (text.startsWith("<onlyhat>")) {
                daveImage.src = "/assets/dave/daveonlyhat.png"
                text = text.replace("<onlyhat>", "").trim()
                daveImage.classList.add("hasOnlyHat")
            }

            daveTextAnimation(text, 50)
            setTimeout(() => {
                allowClickingDave = true
                daveImage.style.cursor = "pointer"
            }, text.length * 50)
        })
    }
})

// On Button, change location (formating: btn[locationFrom]_[locationTo])
// // from main
// document.getElementById("btnDave_basementA").addEventListener("click", changeLocation("basementLocation"))
// document.getElementById("btnDave_outsideA").addEventListener("click", changeLocation("outsideLocation"))
// document.getElementById("btnDave_outsideB").addEventListener("click", changeLocation("outsideLocation"))
// document.getElementById("btnDave_attic").addEventListener("click", changeLocation("atticLocation"))

// // from basement A
// document.getElementById("btnBasementA_dave").addEventListener("click", changeLocation("daveLocation"))
// document.getElementById("btnBasementA_basementB").addEventListener("click", changeLocation("basementBLocation"))
// document.getElementById("btnBasementA_crystal").addEventListener("click", changeLocation("crystalLocation"))
// document.getElementById("btnBasementA_hobbit").addEventListener("click", changeLocation("hobbitLocation"))

// // to dave
// document.getElementById("btnBasementA_dave").addEventListener("click",changeLocation("daveLocation"))
// document.getElementById("btnOutsideA_dave").addEventListener("click", changeLocation("daveLocation"))
// document.getElementById("btnOutsideB_dave").addEventListener("click", changeLocation("daveLocation"))
// document.getElementById("btnAttic_dave").addEventListener("click", changeLocation("daveLocation"))

// // to basement A
// document.getElementById("btnDave_basementA").addEventListener("click", changeLocation("basementLocation"))
// document.getElementById("btnBasementB_basementA").addEventListener("click", changeLocation("basementLocation"))
// document.getElementById("btnCrystal_basementA").addEventListener("click", changeLocation("basementLocation"))
// document.getElementById("btnHobbit_basementA").addEventListener("click", changeLocation("basementLocation"))