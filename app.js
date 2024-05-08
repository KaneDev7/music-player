const music_player_list = document.querySelector('.music_player_list')
const music_player_list_items = document.querySelector('.music_player_list_items')
const music_player_image = document.querySelector('.music_player_image')
const music_player_av = document.querySelector('.music_player_av')
const close_list_icon = document.querySelector('.close_list')
const show_list_icon = document.querySelector('.list_icon i')
const palyPauseIcon = document.querySelector('.palyPauseIcon i')
const audio = document.querySelector('audio')
const nextBtn = document.querySelector('.nextBtn')
const prevbtn = document.querySelector('.prevBtn')
const music_player_loader = document.querySelector('.music_player_loader')
const listen_style_icon = document.querySelector('.listen_style_icon i')
const music_player_progressBar = document.querySelector('.music_player_progressBar')
const music_player_progress = document.querySelector('.music_player_progress')
const currentTimeEl = document.querySelector('.music_player_timer .currentTime')
const volumeEl = document.querySelector('.volume')


let isShowList = false
let isSondStart = false
let isDataLoad = false
let isPlay = false
let currentIndex = 0
let listenSstyle = 'repeat'
let duration = 0
let currentTime = 0
let rotateValue = 0
let volume = 10

const colors = ['#FFF7D4', '#FFD95A', '#C07F00','#fcbd00','#fff']
// const colors = ['#fff', '#fcbd00']

const url = 'https://shazam.p.rapidapi.com/charts/track?pageSize=8'

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '166dd02a40mshb4df9831f2ca119p1c2a2ejsn45d175ee81e9',
        'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
    }
};


document.addEventListener('DOMContentLoaded', () => {
    music_player_loader.classList.add('hiddden')
})

const toogleShowList = () => {
    isShowList = !isShowList
    const music_player_list_class = `music_player_list ${isShowList && 'showList'}`
    music_player_list.setAttribute('class', music_player_list_class)
}


const insertSongListFromLocal = () => {

    const liList = songsList.map((item, index) => {

        return `<li class="list_item"  onclick="playSongOnClick('${index}')">
                    <div class="list_item_sound">
                        <img src="/images/lflf.jpeg" alt="">
                        <div class="list_item_text">
                            <h4>${troncText(item?.title, 15)} </h4>
                            <p>${item.artist}</p>
                        </div>
                    </div>
                   <audio src="${item.uri}"></audio>
                    <div class="list_item_time">
                        <span class="time"> 0:00 </span>
                        <div class="playing_indicator">
                            <dotlottie-player src="./indicador.json" 
                            background="transparent" speed="2" style="width: 100%; height: 100%;" 
                            loop autoplay></dotlottie-player>
                        </div>
                    </div>
               </li>
        `
    })

    music_player_list_items.innerHTML = liList.join('')
    insertDurationOnElelement()
}

const insertDurationOnElelement = () => {
    const list_items = document.querySelectorAll('.list_item')
    list_items.forEach(item => {
        const timeEl = item.querySelector('.time')
        const audioEl = item.querySelector('audio')
        audioEl.addEventListener('loadeddata', (event) => {
            timeEl.innerText = formatTime(event.target.duration)
        })
    })
}


const playSongOnClick = (index) => {
    music_player_image.style.transition = 'none'
    music_player_image.style.transform = 'none'
    currentIndex = Number(index)
    isPlay = true

    if (!isSondStart) {
        audioVisualisation()
        isSondStart = true
    }

    loadAudio({
        artist: songsList[currentIndex]?.artist,
        title: songsList[currentIndex]?.title,
        uri: songsList[currentIndex]?.uri,
        coverart: `/images/lflf.jpeg`,
        background: `/images/lflf.jpeg`,
        isPlaying: true
    })


}

const nextPrevSong = () => {

    music_player_image.style.transition = 'none'
    music_player_image.style.transform = 'none'
    isSondStart = true
    isPlay = true

    loadAudio({
        artist: songsList[currentIndex]?.artist,
        title: songsList[currentIndex]?.title,
        uri: songsList[currentIndex]?.uri,
        coverart: `/images/lflf.jpeg`,
        background: `/images/lflf.jpeg`,
        isPlaying: true
    })
}


const loadAudio = ({ artist, title, uri, coverart, background, isPlaying }) => {
    nextBtn.classList.remove('disable')
    prevbtn.classList.remove('disable')
    const music_player_image = document.querySelector('.music_player_image img')
    const music_player_title = document.querySelector('.music_player_text h3')
    const music_player_artist = document.querySelector('.music_player_text p')
    const list_items = document.querySelectorAll('.list_item')
    const music_player_bg = document.querySelector('.music_player_bg img')


    list_items.forEach(item => item.classList.remove('isPlaying'))
    list_items[currentIndex].classList.add('isPlaying')
    music_player_bg.src = background
    music_player_image.src = coverart
    music_player_title.innerText = troncText(title, 25)
    music_player_artist.innerText = artist
    audio.src = uri

    music_player_loader.classList.remove('hiddden')
    music_player_loader.style.opacity = '0'

    setTimeout(() => { music_player_loader.style.opacity = '1' }, 1500)

    audio.addEventListener('loadeddata', () => {
        music_player_loader.classList.add('hiddden')
    })
    playSong(isPlaying)

}

const playSong = (isPlaying) => {
    palyPauseIcon.innerText = isPlaying ? 'pause' : 'play_arrow'
    const list_items = document.querySelectorAll('.list_item')

    if (!isPlaying) {
        list_items[currentIndex].querySelector('.playing_indicator')
            .innerHTML = `<i class="material-icons" style="color: #f5cb4e;" >play_arrow</i>`
        return audio.pause()
    }

    list_items[currentIndex].querySelector('.playing_indicator')
        .innerHTML = `<dotlottie-player src="./indicador.json" 
    background="transparent" speed="2" style="width: 100%; height: 100%;" 
    loop autoplay></dotlottie-player>
    `
    audio.play()
    audio.crossOrigin = "anonymous";
}

// controll
const setListenStyle = () => {
    switch (listenSstyle) {
        case 'repeat':
            listen_style_icon.innerText = 'repeat_one'
            listenSstyle = 'repeat_one'
            break;
        case 'repeat_one':
            listen_style_icon.innerText = 'shuffle'
            listenSstyle = 'shuffle'
            break;
        case 'shuffle':
            listen_style_icon.innerText = 'repeat'
            listenSstyle = 'repeat'
            break
        default:
            listen_style_icon.innerText = 'repeat'
            listenSstyle = 'repeat'
    }
}


// event song
audio.addEventListener('loadeddata', (event) => {
    const durationEl = document.querySelector('.music_player_timer .duration')
    duration = audio.duration
    durationEl.innerText = formatTime(duration)
    setTimeout(() => { music_player_image.style.transition = '1s' }, 0)
})


audio.addEventListener('timeupdate', event => {
    //  music_player_progress = document.querySelector('.music_player_progress')

    duration = event.target.duration
    currentTime = event.target.currentTime

    const width = currentTime / duration * 100
    currentTimeEl.innerText = formatTime(currentTime)
    music_player_progress.style.width = width + '%'
    // rotateValue = currentTime * 10
    // music_player_image.style.transform = `rotate(${rotateValue}deg)`
})


audio.addEventListener('ended', () => {
    music_player_image.style.transition = 'none'
    music_player_image.style.transform = 'none'

    setTimeout(() => { music_player_image.style.transition = '1s' }, 10)

    switch (listenSstyle) {
        case 'repeat':
            currentIndex = currentIndex < songsList.length - 1 ? currentIndex + 1 : 0
            nextPrevSong()
            break;
        case 'repeat_one':
            audio.play()
            break;
        case 'shuffle':
            let newIndex
            do {
                newIndex = Math.floor(Math.random() * songsList.length)
            } while (newIndex === currentIndex);
            currentIndex = newIndex
            loadAudio({
                artist: songsList[currentIndex]?.artist,
                title: songsList[currentIndex]?.title,
                uri: songsList[currentIndex]?.uri,
                coverart: `/images/lflf.jpeg`,
                background: `/images/lflf.jpeg`,
                isPlaying: true
            })
            break
        default:

    }
})

volumeEl.addEventListener('input', () => {
    volume = volumeEl.value / 10
    audio.volume = volume
})


music_player_progressBar.addEventListener('click', (e) => {
    if (!isSondStart) return
    const rect = music_player_progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    const newTime = percentage * audio.duration;
    rotateValue = rotateValue + newTime
    audio.currentTime = newTime;
    // music_player_image.style.transform = `rotate(${rotateValue}deg)`
})


// Helper
const troncText = (text, length) => {
    if (text.length > length) return text.substr(0, length) + '...'
    return text
}

function formatTime(currentTime) {
    if (isNaN(currentTime)) return "0:00";
    var minutes = Math.floor(currentTime / 60);
    var seconds = Math.floor(currentTime % 60);
    var secondsString = seconds < 10 ? "0" + seconds : "" + seconds;
    return minutes + ":" + secondsString;
}


// Event controll
show_list_icon.addEventListener('click', toogleShowList)
close_list_icon.addEventListener('click', toogleShowList)
listen_style_icon.addEventListener('click', setListenStyle)


document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        currentIndex = currentIndex < songsList.length - 1 ? currentIndex + 1 : 0
        nextPrevSong()
    } else if (event.key === 'ArrowLeft') {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : songsList.length - 1
        nextPrevSong()
    } else if (event.key === ' ') {
        isPlay = !isPlay
        if (!isSondStart) {
            loadAudio({
                artist: songsList[currentIndex]?.artist,
                title: songsList[currentIndex]?.title,
                uri: songsList[currentIndex]?.uri,
                coverart: `/images/lflf.jpeg`,
                background: `/images/lflf.jpeg`,
                isPlaying: true
            })
            audioVisualisation()
            return isSondStart = true
        } else {
            playSong(isPlay)
        }
    }
})

nextBtn.addEventListener('click', () => {
    currentIndex = currentIndex < songsList.length - 1 ? currentIndex + 1 : 0
    nextPrevSong()
})
prevbtn.addEventListener('click', () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : songsList.length - 1
    nextPrevSong()
})

function playPauseSong(event){
    // event.stopPropagation()
    console.log(this)
        isPlay = !isPlay
    
        if (!isSondStart) {
            loadAudio({
                artist: songsList[currentIndex]?.artist,
                title: songsList[currentIndex]?.title,
                uri: songsList[currentIndex]?.uri,
                coverart: `/images/lflf.jpeg`,
                background: `/images/lflf.jpeg`,
                isPlaying: true
            })
            audioVisualisation()
            return isSondStart = true
        } else {
            playSong(isPlay)
        }
    
    }


palyPauseIcon.addEventListener('click', playPauseSong)


insertSongListFromLocal()


// AUDIO VISUALISTATION

const clamp = (num, min, max) => {
    if (num >= max) return max;
    if (num <= min) return min;
    return num;
}

const audioVisualisation = () => {

    window.AudioContext = window.AudioContext || window.webkitAudioContext
    const audioContext = new window.AudioContext()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaElementSource(audio)
    source.connect(analyser)
    source.connect(audioContext.destination)
    analyser.fftSize = 128
    const bufferLength = analyser.frequencyBinCount
    let dataArray = new Uint8Array(bufferLength)

    let elements = []
    for (let i = 0; i < bufferLength; i++) {
        const element = document.createElement('span')
        element.classList.add('element')
        elements.push(element)
        music_player_av.appendChild(element)
    }

    document.querySelectorAll('.element')
        .forEach(item => {
            const color = colors[Math.floor(Math.random() * colors.length)]
            item.style.borderTop = `10px solid ${color}`
        })

    const update = () => {
        analyser.getByteFrequencyData(dataArray)

        for (let i = 0; i < bufferLength; i++) {
            let item = dataArray[i];
            item = item > 150 ? item / 1.5 : item * 1.5;
            if (window.innerWidth <= 380) {
                elements[i].style.transform = `rotateZ(${i * (360 / bufferLength)}deg) translate(-50%, ${clamp(item, 100, 130)}px)`;
            } else if (window.innerWidth <= 360) {
                elements[i].style.transform = `rotateZ(${i * (360 / bufferLength)}deg) translate(-50%, ${clamp(item, 100, 115)}px)`;
            } else {
                elements[i].style.transform = `rotateZ(${i * (360 / bufferLength)}deg) translate(-50%, ${clamp(item, 100, 135)}px)`;
            }


        }
        requestAnimationFrame(update)

    }
    update()
}

