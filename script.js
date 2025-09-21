
// location system
const locations = [
    {"name": "daveLocation"},
    {"name": "atticLocation"},
    {"name": "basementALocation"},
    {"name": "basementBLocation"},
    {"name": "outsideALocation"},
    {"name": "outsideBLocation"},
    {"name": "crystalLocation"}
]
var currentLocation = "daveLocation"

// dave texts on start
var initText = [
    {"t": "didnt ask lmao!", "to": 500},
    {"t": "come in my crib tho", "to": 1000},
    {"t": "theres not much here", "to": 1000, bg: true},
    {"t": "but if you go downstairs", "to": 1000},
    {"t": "theres a bulletin board with some info", "to": 1000},
    {"t": "idk why its there, but its pretty cool ngl", "to": 3000},
    {"t": "wait you think i have more to say?", "to": 2800},
    {"t": "you can click on me to talk", "to": 100, click: true}
]

// dave texts on start after the crystal explotion of 87'
const initTextAfterExplsion = [
    {"t": "didnt ask lmao!", "to": 500},
    {"t": "come in my crib-", "to": 50},
    {"t": "wait a second", "to": 1250},
    {"t": "i know you!", "to": 1250},
    {"t": "YOU BROKE THE CRYSTAL!!", "to": 1250},
    {"t": "i cant believe this", "to": 1250},
    {"t": "because of you, the world reset", "to": 1250},
    {"t": "good thing i had a backup of the scene", "to": 1500},
    {"t": "but still...", "to": 750},
    {"t": "at this point, do i want to talk to you?", "to": 100, click: true, bg: true}
]

// allow clicking dave
var allowClickingDave = false

// json object list with dave's responces
var daveTextList
var bulletinBoardTextList

// location elements
var transitionLocation = document.getElementById("transitionLocation") 
var daveLocation = document.getElementById("daveLocation") 
var basementALocation = document.getElementById("basementALocation") 
var basementBLocation = document.getElementById("basementBLocation") 
var outsideALocation = document.getElementById("outsideALocation") 
var outsideBLocation = document.getElementById("outsideBLocation") 
var atticLocation = document.getElementById("atticLocation") 
var crystalLocation = document.getElementById("crystalLocation") 

//// parent elements of daveLocation
var daveText = document.getElementById("daveText")
var daveImage = document.getElementById("daveCharacter")

// delay function
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

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
        // ^^ Future Smil here, what did past Smil write above? 
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
async function changeLocation(to) {
    if (!locations.some(e => e.name === to)) return
    transitionLocation.classList.remove("hidden")
    transitionLocation.style.visibility = "visible"

    await delay(1000)
    document.getElementById(currentLocation).classList.add("hidden")
    currentLocation = to
    document.getElementById(currentLocation).classList.remove("hidden")

    await delay(1000)
    transitionLocation.classList.add("hidden")
    await delay(1000)
    transitionLocation.style.visibility = "hidden"
}

// Bulletin Page Handler
var currentBulletinPage = 0
async function bulletinPage(a) {
    if (a === "+") {
        if (currentBulletinPage >= 3) return
        currentBulletinPage++
    } else if (a === "-") {
        if (currentBulletinPage <= 0) return
        currentBulletinPage--
    }

    var data = await bulletinBoardTextList[currentBulletinPage]
    document.getElementById("bulletinBoardTitle").innerText = data.title
    document.getElementById("bulletinBoardDescription").innerText = data.description
}

// On Load
// the... uhh.. 🤔 (i forgor) uhm.. thing!!
window.addEventListener('DOMContentLoaded', async () => {
    daveTextList = await fetch("/assets/text.json").then(response => response.json())
    bulletinBoardTextList = await fetch("/assets/bulletin.json").then(response => response.json())

    // key init
    if (localStorage.getItem("sc18_hasKey") === "true") {
        document.getElementById("atticKey").style.visibility = "hidden"
        document.getElementById("basementBChest").style.cursor = "pointer"
    }

    // bulleting board init
    // ^^ Future Smil here, i realised i wrote bulleting lmao
    var data = await bulletinBoardTextList[0]
    document.getElementById("bulletinBoardTitle").innerText = data.title
    document.getElementById("bulletinBoardDescription").innerText = data.description

    var text = "Ask me anything..."
    var textSpeed = 120 // 120

    await delay(3000)
    daveTextAnimation(text, textSpeed)

    await delay(textSpeed * text.length + textSpeed)
    document.getElementById("daveTextBox").style.visibility = "visible"
    document.getElementById("daveTextBox").style.opacity = "1"

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
document.getElementById("daveTextBox").addEventListener("keydown", async (event) => {
    const textSpeed = 75

    if (event.key === "Enter") {
        if (!document.getElementById("daveTextBox").value.endsWith("?")) {
            daveTextAnimation("Thats not a question...", 120)
            return
        }

        event.preventDefault()
        document.getElementById("daveTextBox").style.opacity = "0"

        if (localStorage.getItem("sc18_bigBang") === "true") {
            initText = initTextAfterExplsion
        }

        var delayy = 0
        initText.forEach(e => {
            setTimeout(() => {
                daveTextAnimation(e.t, textSpeed)

                if (e.bg) { 
                    document.getElementById("daveBg").style.removeProperty("visibility")
                    document.querySelectorAll("#daveBtn").forEach(b => b.style.removeProperty("visibility"))
                }
                if (e.click) { 
                    allowClickingDave = true 
                    daveImage.style.cursor = "pointer"
                }
            }, delayy)
            delayy += (textSpeed * e.t.length) + e.to
        })

        await delay(delay)
        document.getElementById("daveTextBox").remove()
    }
})

// On Click Crystal
var crystalClicks = 0
document.getElementById("crystal").addEventListener("click", async () => {
    crystalClicks++
    
    switch (crystalClicks) {
        case 3:
            new Audio("/assets/crystal/critical.ogg").play()
            document.getElementById("crystal").src = "/assets/crystal/1.png"
        break;
        case 5:
            new Audio("/assets/crystal/critical.ogg").play()
            document.getElementById("crystal").src = "/assets/crystal/2.png"
        break;
        case 7, 10:
            new Audio("/assets/crystal/critical.ogg").play()
            document.getElementById("crystal").src = "/assets/crystal/3.png"
        break;
        case 13:    
            new Audio("/assets/crystal/explode.mp3").play()
            await delay(400)
            document.getElementById("crystal").src = "/assets/crystal/cracked.png"

            await delay(5000)
            localStorage.setItem("sc18_bigBang", "true")
            new Audio("/assets/crystal/flashbang.mp3").play()

            document.getElementById("crystal").src = ""
            document.getElementById("crystalBgImg").src = "/assets/locations/6_crystalflashbang.png"
            await delay(4300)
            document.getElementById("crystalText").style.removeProperty("visibility")
            await delay(100)
            document.getElementById("crystalText").style.opacity = "1"

            break;
        default:
            new Audio("/assets/crystal/hit.ogg").play()
        break;
    }
})

// On Key Click
document.getElementById("atticKey").addEventListener("click", async () => {
    document.getElementById("atticKey").style.visibility = "hidden"
    document.getElementById("basementBChest").style.cursor = "pointer"

    localStorage.setItem("sc18_hasKey", "true")
})

// On Dave Click
// handle clicking on dave (my bad for forcing him to be clicked)
daveImage.addEventListener("click", async () => {
    if (allowClickingDave) {
        allowClickingDave = false
        daveImage.style.cursor = "not-allowed"

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

        await delay(text.length * 50)
        allowClickingDave = true
        daveImage.style.cursor = "pointer"
    }
})