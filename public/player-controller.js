import JB_Player from "/static/web4dv/JB_Player.js"

// Button Components
const playBtn = document.getElementById('playBtn')
const pauseBtn = document.querySelector('.ppBtn')
const loading = document.querySelector('.loading')

// Time Components
let totalTime, frameRate, totalFrame, currentPlayingFrame
const time = document.getElementById('time')
const timeBar = document.getElementById('time-bar')
const timeBarStick = document.getElementById('time-bar-stick')

/************************
 * Model URL
 ***********************/
const urlD = "/static/models/4ds/solo.4ds"
const urlM = ""

// Call Model
const mainModel = new JB_Player(urlD, urlM)

/************************
 * Button Events
 ***********************/
// First Big Play Button Event
playBtn.addEventListener('click', () => {
    mainModel.play(true)
    playBtn.style.display = 'none'
    loading.style.display = 'flex'
})

// Play & Pause Event
pauseBtn.addEventListener('click', () => {
    if(mainModel.isPlaying){
        mainModel.pause()
        pauseBtn.className = 'bi bi-play-fill ppBtn btns'
    } else {
        mainModel.play(true)
        pauseBtn.className = 'bi bi-pause ppBtn btns'
    }
})

/************************
 * Before Play Setting
 ***********************/
const getLoadedModelData = () => {
    if(mainModel.isLoaded){
        frameRate = mainModel.getFrameRate()
        totalFrame = mainModel.sequenceTotalLength
    
        const sec = Math.floor(totalFrame / frameRate)
        const frame = Math.floor(totalFrame % frameRate)
    
        totalTime = `${sec >= 10 ? sec : `0${sec}`}:${frame >= 10 ? frame : `0${frame}`}`
        document.getElementById('total').innerText = totalTime

        window.cancelAnimationFrame(getLoadedModelData)
    } else {
        window.requestAnimationFrame(getLoadedModelData)
    }
}

/************************
 * On Playing Button Event
 ***********************/
const onPlayingButtonStatus = () => {
    if(mainModel.isPlaying) {
        loading.style.display = 'none'
        pauseBtn.style.display = 'flex'
        time.style.display = 'block'
        timeBar.style.display = 'block'

        window.cancelAnimationFrame(onPlayingButtonStatus)
    } else {
        window.requestAnimationFrame(onPlayingButtonStatus)
    }
}

/************************
 * Drawing Time
 ***********************/
 const drawTime = () => {
    currentPlayingFrame = mainModel.currentFrame
    let currentSec = Math.floor(currentPlayingFrame/frameRate)
    let currentFrame = Math.floor(currentPlayingFrame % frameRate)
    let currentTime = `${currentSec >= 10 ? currentSec : `0${currentSec}`}:${currentFrame >= 10 ? currentFrame : `0${currentFrame}`}`
    document.getElementById('current').innerText = currentTime

    let progressPercent = (currentPlayingFrame / totalFrame) * 100
    timeBarStick.style.width = `${progressPercent}%`
}

// get loop
const tick = () => {
    if(mainModel.isPlaying){
        drawTime()
    }
    window.requestAnimationFrame(tick)
}

getLoadedModelData()
onPlayingButtonStatus()
tick()