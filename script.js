
// location System
const locations = [
    {"name": "daveLoc", "bg": "/assets/locations/1_main.png"},
    {"name": "basementLoc", "bg": "/assets/locations/2_basement.png"},
    {"name": "crystalLoc", "bg": "/assets/locations/3_crystal.png"}
]
var currentLocation = "daveLoc"

// dave Texts on start
const initText = [
    {"t": "didnt ask lmao!", "to": 500},
    {"t": "come in my crib tho", "to": 1000},
    {"t": "theres not much here", "to": 1000, bg: true},
    {"t": "but if you go downstairs", "to": 1000},
    {"t": "theres a buletin board with some info", "to": 1000},
    {"t": "idk why its there, but its pretty cool ngl", "to": 3000},
    {"t": "wait you think i have more to say?", "to": 2800},
    {"t": "you can click on me to talk if you want", "to": 1, click: true}
]

// allow clicking dave
var allowClickingDave = false

// json object list with dave's responces
var daveTextList = fetch("/assets/text.json").then(response => response.json())

// parent of all elements below
var daveLocation = document.getElementById("daveLoc") 
var daveText = document.getElementById("daveText") // Dave Text (above)
var daveImage = document.getElementById("daveCharacter") // Dave Image (center)
var daveTextBox = document.getElementById("daveTextBox") // Dave Text Box (below, used once)

// location Buttons
var btnDownstairs = document.getElementById("btnDownstairs")
var btnUpstairs = document.getElementById("btnUpstairs")
var btnToCrystal = document.getElementById("btnToCrystal")
var btnFromCrystal = document.getElementById("btnFromCrystal")

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

    document.getElementById(currentLocation).style.visibility = "hidden"

    document.body.style.backgroundImage = `url('${loc.bg}')`

    currentLocation = to
    document.getElementById(currentLocation).style.visibility = "visible"
}

// On Load
// the... uhh.. 🤔 (i forgor) uhm.. thing!!
window.addEventListener('DOMContentLoaded', () => {
    var text = "Ask me anything..."
    var textSpeed = 1 // 120

    setTimeout(() => {
        daveTextAnimation(text, textSpeed)

        setTimeout(() => {
            daveTextBox.style.visibility = "visible"
            daveTextBox.style.opacity = "1"
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

        daveTextBox.style.opacity = "0"

        var delay = 0
        initText.forEach(e => {
            setTimeout(() => {
                daveTextAnimation(e.t, textSpeed)

                if (e.bg) { 
                    daveLocation.style.backgroundColor = "transparent"
                    document.getElementById("btnDownstairs").style.removeProperty("visibility")
                }
                if (e.click) { 
                    allowClickingDave = true 
                    daveImage.style.cursor = "pointer"
                }
            }, delay)
            delay += (textSpeed * e.t.length) + e.to
        })
        setTimeout(() => {
            daveTextBox.remove()
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

// On Page Resize
// handle page resizing, for mobile support & random screen handling



// On Button to Downstairs Click
btnDownstairs.addEventListener("click", () => changeLocation("basementLoc"))
btnUpstairs.addEventListener("click", () => changeLocation("daveLoc"))
btnToCrystal.addEventListener("click", () => changeLocation("crystalLoc"))
btnFromCrystal.addEventListener("click", () => changeLocation("basementLoc"))