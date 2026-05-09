const songs = [
    {
        title: "Tiny Shell",
        artist: "Blue Deer, Nyles Lannon",
        url: "https://res.cloudinary.com/dzasiciin/video/upload/q_auto/f_auto/v1778254671/Tiny_Shell_-_Blue_Deer_Nyles_Lannon_vmoj6n.mp3",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        title: "Through The Night (feat. Devyn Rush)",
        artist: "Blue Deer",
        url: "https://res.cloudinary.com/dzasiciin/video/upload/q_auto/f_auto/v1778254668/Through_The_Night_feat._Devyn_Rush_-_Blue_Deer_fbpeop.mp3",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        title: "Talk To Me (feat. Devyn Rush)",
        artist: "Blue Deer",
        url: "https://res.cloudinary.com/dzasiciin/video/upload/q_auto/f_auto/v1778254665/Talk_To_Me_feat._Devyn_Rush_-_Blue_Deer_ylg6ty.mp3",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        title: "Working (feat. Jordan King)",
        artist: "Cory Barker",
        url: "https://res.cloudinary.com/dzasiciin/video/upload/q_auto/f_auto/v1778254666/Working_-_Cory_Barker_feat._Jordan_King_x9k1qk.mp3",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        title: "Willow Gozilla (feat. Rusty James Miller)",
        artist: "Zenith Bikini",
        url: "https://res.cloudinary.com/dzasiciin/video/upload/q_auto/f_auto/v1778254661/Willow_Gozilla_feat._Rusty_James_Miller_-_Zenith_Bikini_hxtvcw.mp3",
        cover: "https://images.unsplash.com/photo-1493225457124-a1a2a5fd3a43?auto=format&fit=crop&q=80&w=200&h=200"
    }
];

let currentSongIndex = 0;
let isPlaying = false;
const audio = new Audio();

// DOM Elements
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const masterPlayAll = document.getElementById('masterPlayAll');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const songListEl = document.getElementById('songList');
const currentTitleEl = document.getElementById('currentTitle');
const currentArtistEl = document.getElementById('currentArtist');
const currentCoverEl = document.getElementById('currentCover');
const muteBtn = document.getElementById('muteBtn');

// Initialize
function init() {
    renderSongList();
    loadSong(currentSongIndex);
}

// Render Song List
function renderSongList() {
    songListEl.innerHTML = '';
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.classList.add('song-item');
        if (index === currentSongIndex) songItem.classList.add('playing');
        
        songItem.innerHTML = `
            <div class="col col-index">${index + 1}</div>
            <div class="col col-title-artist">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="col">Album</div>
            <div class="col">--:--</div>
        `;
        
        songItem.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
        
        songListEl.appendChild(songItem);
    });
}

// Update Active Class in List
function updateActiveSongInList() {
    const items = document.querySelectorAll('.song-item');
    items.forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add('playing');
        } else {
            item.classList.remove('playing');
        }
    });
}

// Load Song
function loadSong(index) {
    const song = songs[index];
    audio.src = song.url;
    currentTitleEl.textContent = song.title;
    currentArtistEl.textContent = song.artist;
    currentCoverEl.src = song.cover;
    updateActiveSongInList();
    
    // reset progress
    progressBar.value = 0;
    currentTimeEl.textContent = "0:00";
}

// Play Song
function playSong() {
    audio.play();
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    masterPlayAll.innerHTML = '<i class="fas fa-pause"></i>';
}

// Pause Song
function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    masterPlayAll.innerHTML = '<i class="fas fa-play"></i>';
}

// Toggle Play/Pause
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Next Song
function nextSong() {
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// Prev Song
function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// Format Time
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
masterPlayAll.addEventListener('click', () => {
    if(!isPlaying && audio.src === "") {
        loadSong(0);
    }
    togglePlay();
});
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

audio.addEventListener('timeupdate', () => {
    const { currentTime, duration } = audio;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.textContent = formatTime(currentTime);
        totalTimeEl.textContent = formatTime(duration);
        
        // Dynamic background update for range slider
        progressBar.style.background = `linear-gradient(to right, var(--accent-color) ${progressPercent}%, #535353 ${progressPercent}%)`;
    }
});

audio.addEventListener('ended', nextSong);

progressBar.addEventListener('input', (e) => {
    const seekTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

volumeBar.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
    if (audio.volume === 0) {
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    const volPercent = e.target.value;
    volumeBar.style.background = `linear-gradient(to right, var(--text-primary) ${volPercent}%, #535353 ${volPercent}%)`;
});

let isMuted = false;
let previousVolume = 1;
muteBtn.addEventListener('click', () => {
    if (isMuted) {
        audio.volume = previousVolume;
        volumeBar.value = previousVolume * 100;
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        isMuted = false;
    } else {
        previousVolume = audio.volume;
        audio.volume = 0;
        volumeBar.value = 0;
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        isMuted = true;
    }
    const volPercent = volumeBar.value;
    volumeBar.style.background = `linear-gradient(to right, var(--text-primary) ${volPercent}%, #535353 ${volPercent}%)`;
});

// Run Init
init();
