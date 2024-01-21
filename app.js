const music_player_list = document.querySelector('.music_player_list')
const music_player_list_items = document.querySelector('.music_player_list_items')
const music_player_image = document.querySelector('.music_player_image')
const close_list_icon = document.querySelector('.close_list')
const show_list_icon = document.querySelector('.list_icon i')
const palyPauseIcon = document.querySelector('.palyPauseIcon i')
const audio = document.querySelector('audio')
const nextBtn = document.querySelector('.nextBtn')
const prevbtn = document.querySelector('.prevBtn')
const listen_style_icon = document.querySelector('.listen_style_icon i')
// const audio = new Audio()

let isShowList = false
let songsList = []
let isSondStart = false
let isDataLoad = false
let isPlay = false
let currentIndex = 0
let listenSstyle = 'repeat'

const url = 'https://shazam.p.rapidapi.com/charts/track?pageSize=9';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '85dfc8a7ffmsh8393631339b84c5p1d6c80jsn3cbf1a94580a',
        'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
    }
};

const toogleShowList = () => {
    isShowList = !isShowList
    const music_player_list_class = `music_player_list ${isShowList && 'showList'}`
    music_player_list.setAttribute('class', music_player_list_class)
}


const getSongFormApi = async () => {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        songsList = [...result?.tracks]
        insertSongList()

    } catch (error) {
        console.log(error);
        alert('Check your connection')
        getSongFormApi()

    }
}


const insertSongList = () => {

    const liList = songsList.map((item, index) => {
        console.log(item)
        const artist = item?.artists?.map((element, i) => element?.alias).join('')
        const uri = item?.hub?.actions?.map((element, i) => element?.uri)[1]

        return item?.images && `<li class="list_item " 
        onclick="playSongOnClick('${index}') ">
          <div class="list_item_sound">
            <img src="${item?.images?.coverart || item?.images?.coverarthq}" alt="">
            <div class="list_item_text">
                <h4>${troncText(item?.title, 25)} </h4>
               <p>${artist}</p>
            </div>
        </div>
        <audio src="${uri}"></audio>
        <div class="list_item_time">
            <span class="time"> 0:00 </span>
            <div class="playing_indicator">
            <dotlottie-player src="https://lottie.host/6c3715b5-79c8-4d18-8d6d-77ea088f6133/iIo5HMcrKF.json" 
            background="transparent" speed="2" style="width: 100%; height: 100%;" 
            loop autoplay></dotlottie-player>
            </div>
        </div>
    </li>
        `
    })
    music_player_list_items.innerHTML = liList.join('')
    document.querySelector('.music_player_loader').classList.add('hiddden')
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
    currentIndex = Number(index)
    isSondStart = true
    isPlay = true
    loadAudio({
        artist: songsList[currentIndex]?.artists[0]?.alias,
        title: songsList[currentIndex]?.title,
        uri: songsList[currentIndex]?.hub?.actions[1]?.uri,
        coverart: songsList[currentIndex]?.images?.coverart,
        background: songsList[currentIndex]?.images?.background,
        isPlaying: true
    })
}

const nextPrevSong = () => {
    isSondStart = true
    isPlay = true
    loadAudio({
        artist: songsList[currentIndex]?.artists[0]?.alias,
        title: songsList[currentIndex]?.title,
        uri: songsList[currentIndex]?.hub?.actions[1]?.uri,
        coverart: songsList[currentIndex]?.images?.coverart,
        background: songsList[currentIndex]?.images?.background,
        isPlaying: true
    })
}

const loadAudio = ({ artist, title, uri, coverart, background, isPlaying }) => {
    const music_player_image = document.querySelector('.music_player_image img')
    const music_player_title = document.querySelector('.music_player_text h3')
    const music_player_artist = document.querySelector('.music_player_text p')
    const list_items = document.querySelectorAll('.list_item')
    const music_player_bg = document.querySelector('.music_player_bg img')

    
    list_items.forEach(item => item.classList.remove('isPlaying'))
    list_items[currentIndex].classList.add('isPlaying')
    music_player_bg.src = background
    music_player_image.src = coverart
    music_player_title.innerText = troncText(title, 30)
    music_player_artist.innerText = artist
    audio.src = uri
    playSong(isPlaying)
}

const playSong = (isPlaying) => {
    palyPauseIcon.innerText = isPlaying ? 'pause' : 'play_arrow'
    if (!isPlaying) return audio.pause()
    audio.play()
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
    const duration = audio.duration
    durationEl.innerText = formatTime(duration)
})

audio.addEventListener('timeupdate', event => {
    const music_player_progress = document.querySelector('.music_player_progress ')
    const currentTimeEl = document.querySelector('.music_player_timer .currentTime')

    const duration = event.target.duration
    const currentTime = event.target.currentTime

    const width = currentTime / duration * 100
    currentTimeEl.innerText = formatTime(currentTime)
    music_player_progress.style.width = width + '%'
    music_player_image.style.transform = `rotate(${currentTime * 10}deg)`

})

audio.addEventListener('ended', () => {
    switch (listenSstyle) {
        case 'repeat':
            currentIndex = currentIndex < songsList.length - 1 ? currentIndex + 1 : 0
            nextPrevSong()
            break;
        case 'repeat_one':
            audio.play()
            break;
        case 'shuffle':
            console.log('currentIndex',currentIndex)
            let newIndex
            do {
                newIndex = Math.floor(Math.random() * songsList.length)
            } while (newIndex === currentIndex);
            currentIndex = newIndex
            console.log('currentIndex',currentIndex)

            loadAudio({
                artist: songsList[currentIndex]?.artists[0]?.alias,
                title: songsList[currentIndex]?.title,
                uri: songsList[currentIndex]?.hub?.actions[1]?.uri,
                coverart: songsList[currentIndex]?.images?.coverart,
                background: songsList[currentIndex]?.images?.background,
                isPlaying: true
            })
            break
        default:

    }
})

getSongFormApi()



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
nextBtn.addEventListener('click', () => {
    currentIndex = currentIndex < songsList.length - 1 ? currentIndex + 1 : 0
    nextPrevSong()
})
prevbtn.addEventListener('click', () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : songsList.length - 1
    nextPrevSong()
})

palyPauseIcon.addEventListener('click', () => {
    isPlay = !isPlay

    if (!isSondStart) {
        loadAudio({
            artist: songsList[currentIndex]?.artists[0]?.alias,
            title: songsList[currentIndex]?.title,
            uri: songsList[currentIndex]?.hub?.actions[1]?.uri,
            coverart: songsList[currentIndex]?.images?.coverart,
            background: songsList[currentIndex]?.images?.background,
            isPlaying: true
        })
        return isSondStart = true
    } else {
        playSong(isPlay)
    }

})



