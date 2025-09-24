
// location variables
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

// ################################################################################################
// ################################################################################################
// ################################################################################################

// dave texts that begin on page load
var initText = [
    {"text": "didnt ask lmao!", "wait": 750},
    {"text": "come in my crib tho", bg: true},
    {"text": "theres not much here"},
    {"text": "but if you go downstairs"},
    {"text": "theres a bulletin board with some info"},
    {"text": "idk why its there, but its pretty cool", "wait": 3500},
    {"text": "wait you think i have more to say?", "wait": 3500},
    {"text": "you can click on me to talk", click: true}
]

// dave texts on page load after the crystal explotion of 87'
const initTextAfterExplsion = [
    {"text": "didnt ask lmao!", "wait": 750},
    {"text": "come in my crib-", "wait": 50},
    {"text": "wait a second", "wait": 500},
    {"text": "i know you!", "wait": 500},
    {"text": "YOU BROKE THE CRYSTAL!!", "speed": 50, "wait": 1250},
    {"text": "i cant believe this"},
    {"text": "because of you, the world reset"},
    {"text": "good thing i had a backup of the scene", "wait": 1500},
    {"text": "but still...", "wait": 500},
    {"text": "at this point, do i want to talk to you?", click: true, bg: true}
]

// ################################################################################################
// ################################################################################################
// ################################################################################################

// allow clicking dave
var allowClickingDave = false

// json object list with dave's responces
var daveTextList
var bulletinBoardTextList

//// parent elements of daveLocation
var daveText = document.getElementById("daveText")
var daveImage = document.getElementById("daveCharacter")

// Delay function
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// ################################################################################################
// ################################################################################################
// ################################################################################################

// Dave Text Function - handles queueing (?) and animating daves text
var daveTextqueue = []
var isDaveTextPlaying = false

// queue text
function queueDaveText({ text, speed = 100, wait = 1000 }) {
    daveTextqueue.push({ text, speed, wait })
    playDaveTextQueue()

    return text.length * speed + wait
}

// play text
async function playDaveTextQueue() {
    if (isDaveTextPlaying || daveTextqueue.length === 0) return

    isDaveTextPlaying = true

    while (daveTextqueue.length > 0) {
        const item = daveTextqueue.shift()
        await daveTextAnimation(item.text, item.speed)
        await delay(item.wait || 0)
    }

    isDaveTextPlaying = false
}

// display text
function daveTextAnimation(text, speed) {
    return new Promise(resolve => {
        var index = 0
        daveText.innerHTML = ""

        function type() {
            var textt = text.charAt(index++)
            var speedModifier = speed

            daveText.innerHTML += textt
            if (textt === "," || textt === "!" || textt === "?") { speedModifier += 100 }

            if (index >= text.length) {
                resolve()
            } else {
                setTimeout(type, speedModifier)
            }
        }

        type()
    })
} 

// ################################################################################################
// ################################################################################################
// ################################################################################################

// Location Function - handles changing locations between different areas
var transitionLocation = document.getElementById("transitionLocation")
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

// Bulletin Board Page Function - handles changing pages on the bulletin board
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

// ################################################################################################
// ################################################################################################
// ################################################################################################

// On Page Load
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

    await delay(3000)
    await delay(queueDaveText({ text: "Ask me anything...", speed: 120, wait: 100 }))

    // await delay(textSpeed * text.length + textSpeed)
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

// ################################################################################################
// ################################################################################################
// ################################################################################################

// On Enter Press in the Question Box
document.getElementById("daveTextBox").addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        if (!document.getElementById("daveTextBox").value.endsWith("?")) {
            queueDaveText({ text: "that doesnt look like a question to me", speed: 120 })
            return
        }

        event.preventDefault()
        document.getElementById("daveTextBox").style.opacity = "0"

        if (localStorage.getItem("sc18_bigBang") === "true") {
            initText = initTextAfterExplsion
        }

        for (const e of initText) {
            await delay(queueDaveText({ text: e.text, speed: 75, wait: e.wait }))

            if (e.bg) { 
                document.getElementById("daveBg").style.removeProperty("visibility")
                document.querySelectorAll("#daveBtn").forEach(b => b.style.removeProperty("visibility"))
            }
            if (e.click) { 
                allowClickingDave = true 
                daveImage.style.cursor = "pointer"
            }
        }

        document.getElementById("daveTextBox").remove()
    }
})

// ################################################################################################
// ################################################################################################
// ################################################################################################

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
            new Audio("/assets/other/explode.mp3").play()
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

// ################################################################################################
// ################################################################################################
// ################################################################################################

// On Dave Click
daveImage.addEventListener("click", async () => {
    if (allowClickingDave) {
        allowClickingDave = false
        daveImage.style.cursor = "not-allowed"

        const randomIndex = Math.floor(Math.random() * daveTextList.length)
        var text = daveTextList[randomIndex]

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

        await delay(queueDaveText({ text: text, speed: 60 }))

        allowClickingDave = true
        daveImage.style.cursor = "pointer"
    }
})

// ################################################################################################
// ################################################################################################
// ################################################################################################

// On Key Click
document.getElementById("atticKey").addEventListener("click", async () => {
    document.getElementById("atticKey").style.visibility = "hidden"
    document.getElementById("basementBChest").style.cursor = "pointer"

    localStorage.setItem("sc18_hasKey", "true")
})

// On Chest Click
document.getElementById("basementBChest").addEventListener("click", async () => {
    if (localStorage.getItem("sc18_hasKey") !== "true") return
    localStorage.setItem("sc18_openedChest", "true")

    new Audio("/assets/other/explode.mp3").play()
    document.getElementById("basementBChest").style.visibility = "hidden"
})