console.log('Lets make the js part');
let currFolder;
let songs = [];

let currentAudio = null; // Global variable to track the current audio object

const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const playMusic = (track, pause = false) => {
    if (!track) {
        console.error("Error in playMusic: Track is undefined or invalid");
        return;
    }

    // If there is already an audio playing, pause it
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Reset to the beginning
    }

    // Create a new audio object and play the new track
    currentAudio = new Audio(`${currFolder}/` + track);
    if (!pause) {
        currentAudio.play();
        play.src = "img/pauseButton.svg";
    }
    document.querySelector(".songName").innerHTML = track.replaceAll("%20", " ").replace(".mp3", "").split("-")[0];
    document.querySelector(".songArtist").innerHTML = track.replaceAll("%20", " ").replace(".mp3", "").split("-")[1];
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";

    // Listen for timeupdate event
    currentAudio.addEventListener("timeupdate", () => {
        const currentTimeFormatted = formatTime(currentAudio.currentTime);
        const durationFormatted = formatTime(currentAudio.duration);

        document.querySelector(".songTime").innerHTML = `${currentTimeFormatted} / ${durationFormatted}`;
        document.querySelector(".circle").style.left = (currentAudio.currentTime / currentAudio.duration) * 100 + "%";
    });

    console.log(`Now playing: ${track}`);
};

async function getSongs(folder) {
    currFolder = folder;
    let response = await fetch(`/${folder}/`);
    if (!response.ok) {
        console.error(`Failed to fetch songs from ${folder}`);
        return [];
    }
    let text = await response.text();
    let div = document.createElement("div");
    div.innerHTML = text;

    let as = div.getElementsByTagName("a");
    songs = [];
    for (let element of as) {
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}/`)[1]);
        }
    }

    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img src="img/music.svg" alt="">
                <div class="info">
                    <div><b>${song.replaceAll("%20", " ").split(" - ")[0]}</b></div>
                    <div>${song.replaceAll("%20", " ").replace(".mp3", "").split(" - ")[1]}</div>
                </div>
                <div class="playNow">
                    <span>Play Now</span>
                    <img src="img/playButtonForPlaylist.svg">
                </div>
            </li>`;
    }

    Array.from(document.querySelectorAll(".songList li")).forEach((li, index) => {
        li.addEventListener("click", () => playMusic(songs[index]));
    });

    return songs;
}

async function main() {
    await getSongs("songs/Pop");
    if (songs.length > 0) {
        playMusic(songs[0], true);
    }

    play.addEventListener("click", () => {
        if (currentAudio.paused) {
            currentAudio.play();
            play.src = "img/pauseButton.svg";
        } else {
            currentAudio.pause();
            play.src = "img/playButton.svg";
        }
    });

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentAudio.src.split("/").slice(-1)[0]);
        if (index > 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentAudio.src.split("/").slice(-1)[0]);
        if (index < songs.length - 1) {
            playMusic(songs[index + 1]);
        }
    });

    document.querySelector(".menu").addEventListener("click", () => {
        document.querySelector(".left").style.right = "0";
    });

    document.querySelector(".back").addEventListener("click", () => {
        document.querySelector(".left").style.right = "-100%";
    });

    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async (item) => {
            let folder = item.currentTarget.dataset.folder;
            songs = await getSongs(`/${folder}`);
        });
    });
}

main();



// console.log('Lets make the js part');
// let currFolder;
// let songs = new Array();

// let currentAudio = null; // Global variable to track the current audio object

// const formatTime = (seconds) => {
//     if (isNaN(seconds)) return "00:00";
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.floor(seconds % 60);
//     return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
// };

// const playMusic = (track, pause=false) => {
//     // If there is already an audio playing, pause it
//     if (currentAudio) {
//         currentAudio.pause();
//         currentAudio.currentTime = 0; // Reset to the beginning
//     }

//     // Create a new audio object and play the new track
//     currentAudio = new Audio(`${currFolder}/` + track);
//     if(!pause){
//         currentAudio.play();
//         play.src = "img/pauseButton.svg"
//     }
//     // currentAudio.play();
//     // play.src = "pauseButton.svg"
//     document.querySelector(".songName").innerHTML = track.replaceAll("%20", " ").replace(".mp3", "").split("-")[0]
//     document.querySelector(".songArtist").innerHTML = track.replaceAll("%20", " ").replace(".mp3", "").split("-")[1]
//     document.querySelector(".songTime").innerHTML = "00:00 / 00:00"

//     //Listen for timeupdate event
//     currentAudio.addEventListener("timeupdate", () => {
//         // Update the current time and total duration
//         const currentTimeFormatted = formatTime(currentAudio.currentTime);
//         const durationFormatted = formatTime(currentAudio.duration);

//         // Update the .songTime element with the current time and total duration
//         document.querySelector(".songTime").innerHTML = `${currentTimeFormatted} / ${durationFormatted}`;

//         document.querySelector(".circle").style.left = (currentAudio.currentTime/currentAudio.duration)*100 + "%"
//     });

//     // Optional: Log the currently playing track
//     console.log(`Now playing: ${track}`);
// };

// async function getSongs(folder) {
//     currFolder = folder;
//     let a = await fetch(`/${folder}/`)
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a")
//     songs = []
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if(element.href.endsWith(".mp3")){
//             songs.push(element.href.split(`/${folder}/`)[1])
//         }
//     }

//     // Show all the songs in the folder
//     let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
//     songUL.innerHTML = ""
//     for (const song of songs) {
//         songUL.innerHTML = songUL.innerHTML + 
//         `<li> 
//                             <img src="img/music.svg" alt="">
//                             <div class="info">
//                                 <div><b>${song.replaceAll("%20", " ").split(" - ")[0]}</b></div>
//                                 <div>${song.replaceAll("%20", " ").replaceAll(".mp3", "").split(" - ")[1]}</div>
//                             </div>
//                             <div class="playNow">
//                                 <span>Play Now</span>
//                                 <img src="img/playButtonForPlaylist.svg" >
//                             </div>
//          </li>`;        
//     }

//     // Attach event listeners to play songs on click
//     // Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index) => {
//     //     e.addEventListener("click", () => {
//     //         let track = songs[index];
//     //         playMusic(track); // Play the selected song
//     //     });
//     // });
//     Array.from(document.querySelectorAll(".songList li")).forEach((li, index) => {
//         li.addEventListener("click", () => playMusic(songs[index]));
//     });
    
//     return songs;
// }

// async function main(){
//     // Get the list of all the songs
//     await getSongs("songs/Pop")
//     playMusic(songs[0], true)
//     console.log(songs)

//     // // Show all the songs in the folder
//     // let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
//     // for (const song of songs) {
//     //     songUL.innerHTML = songUL.innerHTML + 
//     //     `<li> 
//     //                         <img src="music.svg" alt="">
//     //                         <div class="info">
//     //                             <div><b>${song.replaceAll("%20", " ").split(" - ")[0]}</b></div>
//     //                             <div>${song.replaceAll("%20", " ").replaceAll(".mp3", "").split(" - ")[1]}</div>
//     //                         </div>
//     //                         <div class="playNow">
//     //                             <span>Play Now</span>
//     //                             <img src="playButtonForPlaylist.svg" >
//     //                         </div>
//     //      </li>`;        
//     // }

//     // // Attach event listeners to play songs on click
//     // Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index) => {
//     //     e.addEventListener("click", () => {
//     //         let track = songs[index];
//     //         playMusic(track); // Play the selected song
//     //     });
//     // });

//     // // Attach event listeners to play songs on click
//     // Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index) => {
//     //     e.addEventListener("click", () => {
//     //         let track = songs[index];
//     //         playMusic(track); // Play the selected song
//     //     });
//     // });

//     //Attach an event listener to play, next and previous
//     play.addEventListener("click",()=>{
//         if(currentAudio.paused){
//             currentAudio.play()
//             play.src = "img/pauseButton.svg"
//         }        

//         else{
//             currentAudio.pause()
//             play.src = "img/playButton.svg"
//         }
//     })

//     // Add event listener for the prev
//     previous.addEventListener("click", ()=>{
//         // console.log("previous clicked")
//         let index = songs.indexOf(currentAudio.src.split("/").slice(-1)[0])
//         // console.log(songs, index)
//         playMusic(songs[index-1])     
//     })

//     // Add event listener for the next
//     next.addEventListener("click", ()=>{
//         // console.log("next clicked")
//         let index = songs.indexOf(currentAudio.src.split("/").slice(-1)[0])
//         // console.log(songs, index)
//         playMusic(songs[index+1])
//     })

//     //Add event listener for the menu
//     document.querySelector(".menu").addEventListener("click", ()=> {
//         document.querySelector(".left").style.right = "0"
//     })

//     document.querySelector(".back").addEventListener("click", ()=> {
//         document.querySelector(".left").style.right = "-100%"
//     })

//     //Load the playlist whenever card is clicked
//     // Array.from(document.getElementsByClassName("card")).forEach(e=>{
//     //     e.addEventListener("click", async item=>{
//     //         songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
//     //         console.log(songs)
//     //     })
//     // })
//     Array.from(document.getElementsByClassName("card")).forEach((e) => {
//         e.addEventListener("click", async (item) => {
//             let folder = item.currentTarget.dataset.folder;
//             console.log("Clicked folder:", folder); // Debug folder path
//             songs = await getSongs(`/${folder}`);
//             console.log("Loaded songs:", songs); // Check loaded songs
//         });
//     });
    

// }

// main()
