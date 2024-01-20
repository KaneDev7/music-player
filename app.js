const music_player_list = document.querySelector('.music_player_list')
const music_player_list_items = document.querySelector('.music_player_list_items')
const close_list_icon = document.querySelector('.close_list')
const show_list_icon = document.querySelector('.list_icon i')
const palyPauseIcon = document.querySelector('.palyPauseIcon i')
const audio = document.querySelector('audio')

// const audio = new Audio()

let isShowList = false
let songsList = []
let isSondStart = false
let isDataLoad = false
let isPlay = false

const url = 'https://shazam.p.rapidapi.com/charts/track';
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
        console.log(result?.tracks)
        songsList = [...result?.tracks]
        insertSongList()
    } catch (error) {
        console.log(error);
    }
}




const insertSongList = () => {

    const liList = songsList.map((item, index) => {
        const artist = item?.artists?.map((element, i) => element?.alias).join('')
        const uri = item?.hub?.actions?.map((element, i) => element?.uri)[1]

        return item?.images && `<li class="list_item isPlaying" 
        onclick="loadAudio('${artist}','${item?.title}','${uri}','${item?.images?.coverart}','${true}' ) ">
          <div class="list_item_sound">
            <img src="${item?.images?.coverart || item?.images?.coverarthq}" alt="">
            <div class="list_item_text">
                <h4>${troncText(item?.title, 25)} </h4>
                <p>${artist}</p>
            </div>
        </div>

        <div class="list_item_time">
            <span class="time">2:05</span>
            <div class="playing_indicator">
                <span style="height: 80%;" class="playing_indicator_bar"></span>
                <span style="height: 90%;" class="playing_indicator_bar"></span>
                <span style="height: 50%;" class="playing_indicator_bar"></span>
            </div>
        </div>
    </li>
        `
    })
    console.log('liList', liList)
    music_player_list_items.innerHTML = liList.join('')
    document.querySelector('.music_player_loader').classList.add('hiddden')
}

const loadAudio = (artist, title, uri, coverart, isPlaying) => {
    console.log({ artist, title, uri, coverart })
    const music_player_image = document.querySelector('.music_player_image img')
    const music_player_title = document.querySelector('.music_player_text h3')
    const music_player_artist = document.querySelector('.music_player_text p')

    music_player_image.src = coverart
    music_player_title.innerText = title
    music_player_artist.innerText = artist
    audio.src = uri
    playSong(isPlaying)
}

const playSong = (isPlaying) => {
    palyPauseIcon.innerText = isPlaying ? 'pause' :'play_arrow'
    if (!isPlaying) return audio.pause() 
    audio.play()
}

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
})

audio.addEventListener('ended', () => {
    audio.play()
})



getSongFormApi()

// Helper

const troncText = (text, length) => {
    if (text.length > length) return text.substr(0, length) + '...'
    return text
}

function formatTime(currentTime) {
    // Vérifier si currentTime est un nombre
    if (isNaN(currentTime)) {
        return "0:00";
    }

    // Calculer les minutes et les secondes
    var minutes = Math.floor(currentTime / 60);
    var seconds = Math.floor(currentTime % 60);

    // Ajouter un zéro devant les secondes si nécessaire
    var secondsString = seconds < 10 ? "0" + seconds : "" + seconds;

    // Retourner le format minutes:secondes
    return minutes + ":" + secondsString;
}

show_list_icon.addEventListener('click', toogleShowList)
close_list_icon.addEventListener('click', toogleShowList)

palyPauseIcon.addEventListener('click', () => {
    isPlay = !isPlay

    if(!isSondStart){
        loadAudio(
            songsList[0]?.artists[0]?.alias,
            songsList[0]?.title,
            songsList[0]?.hub?.actions[1]?.uri,
            songsList[0]?.images?.coverart,
            true
        )
        return isSondStart = true
    }else{
        playSong(isPlay)
    }
  
})



