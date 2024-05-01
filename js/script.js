let currentSong = new Audio();
currentSong.volume = currentSong.volume = 1;
let currentFolder;
let value = true;

document.querySelector(".volume").getElementsByTagName("input")[0].value =
  currentSong.volume * 100;

let songs;
function playMusic(track, pause = false) {
  currentSong.src = `/${currentFolder}/` + track;

  if (!pause) {
    currentSong.play();
    let src = play.src;
    src = src.replace("svg/Play.svg", "svg/pause.svg");
    play.src = src;
  } else {
    currentSong.pause();
    let src = play.src;
    src = src.replace("svg/pause.svg", "svg/Play.svg");
    play.src = src;
  }
  document.querySelector(".songs-info>.song-name").innerHTML = decodeURI(
    track
  ).replace("/", " ");

  currentSong.onloadedmetadata = function () {
    document.querySelector(".song-time").innerHTML = `${secondsToMinutes(
      currentSong.currentTime
    )}/${secondsToMinutes(currentSong.duration)}`;
  };
}

async function getSong(folder) {
  currentFolder = folder;

  let a = await fetch(`${folder}`);
  let resp = await a.text();

  let div = document.createElement("div");
  div.innerHTML = resp;

  let songBox = div.querySelector("#files").children;
  songs = [];
  for (let i = 0; i < songBox.length; i++) {
    let element = songBox[i];
    let a = element.children[0];
    if (a.href.endsWith(".mp3")) {
      songs.push(a.href.split(`/${folder}`)[1]);
    }
  }

  // This is for playing song
  let randomSong = Math.floor(Math.random() * songs.length);

  playMusic(songs[randomSong], true);
  let songList = document
    .getElementsByClassName("song-list")[0]
    .getElementsByTagName("ul")[0];
  songList.innerHTML = "";
  //
  for (let song of songs) {
    let li = document.createElement("li");
    let parse = song.replaceAll("%20", " ");
    parse = parse.replaceAll("/", " ");
    li.classList.add("justify-evenly");
    li.innerHTML = `<img title="song" class="invert-img music-icon"  src="svg/music.svg" alt="music" />
    <div class="song-info">
      <div class="song-name">${parse}</div>
    </div>
    <img title="Play-Now" src="svg/Play.svg" class="invert-img play-now" alt="" />
  `;

    songList.insertAdjacentElement("beforeend", li);
    // Attaching teh event listener to each song
  }
  Array.from(
    document
      .getElementsByClassName("song-list")[0]
      .getElementsByTagName("ul")[0]
      .getElementsByTagName("li")
  ).forEach((e) => {
    // this e point to the play-now   class containing div

    e = e.children[2];
    src = e.src;

    e.addEventListener("click", () => {
      if (e.src.includes("Play.svg")) {
      }
      let songName = e.parentElement
        .querySelector(".song-info>.song-name")
        .innerHTML.trim();
      function trueFalseDetect(value) {
        if (value === false) {
          return (value = true);
        } else {
          return (value = false);
        }
      }
      value = trueFalseDetect(value);

      playMusic(songName, value);
      playPause(e);
    });
  });
  return songs;
}
//  Play Music Function

function playSong() {
  currentSong
    .play()
    .then(() => {})
    .catch((error) => {
      // Handle error here, such as displaying a message to the user
    });
}

//Play Pause function

function playPause(el = play) {
  let src = el.src;
  if (src.endsWith("Play.svg")) {
    src = src.replace("svg/Play.svg", "svg/pause.svg");
    el.src = src;

    currentSong.play();
  } else {
    src = src.replace("svg/pause.svg", "svg/Play.svg");
    el.src = src;
    currentSong.pause();
  }
}
// Seconds To Minutes
function secondsToMinutes(seconds) {
  // Round down seconds to ignore any numbers after the decimal point
  seconds = Math.floor(seconds);

  // Calculate minutes and remaining seconds
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;

  // Format the time as "mm:ss"
  var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  var formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  var formattedTime = `${formattedMinutes}:${formattedSeconds}`;

  return formattedTime;
}

async function displayAlbum() {
  let a = await fetch(`songs`);
  let resp = await a.text();
  let div = document.createElement("div");
  div.innerHTML = resp;
  let allAnchor = Array.from(div.getElementsByTagName("a"));
  for (let index = 0; index < allAnchor.length; index++) {
    const e = allAnchor[index];

    if (e.href.includes("/songs")) {
      if (e.querySelector("span") != null) {
        let folder = e.href.split("/").slice(-2)[1];
        let a = await fetch(`songs/${folder}/info.json`);
        let resp = await a.json();
        document.querySelector(".card-container").innerHTML =
          document.querySelector(".card-container").innerHTML +
          `<div data-folder="${folder}" class="card">
        <div class="play-btn">
        <img src="../svg/Play.svg" class="play-img" alt="Play_Symbole" />
        </div>
        <img src="songs/${folder}/cover.jpg" class="play-img" alt="Play_Symbole" />
        <h2 style="text-transform:capitalize;">${folder}</h2>
        <p class="para color-gray p-1 ">${resp.description}
        </p>
      </div>`;
      }
    }
    Array.from(document.getElementsByClassName("card")).forEach((e) => {
      e.addEventListener("click", async (item) => {
        let src = play.src;
        src = src.replace("svg/pause.svg", "svg/Play.svg");
        play.src = src;

        await getSong(`songs/${item.currentTarget.dataset.folder}`);
        playMusic(songs[0]);
      });
    });
  }
}

//   The Main Function

async function main() {
  await getSong(`songs/Chill`);
  playMusic(songs[0], true);

  displayAlbum();

  var audio = new Audio();
  //   audio.play();
  audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    //
  });
  let showBtn = document.getElementsByClassName("plus")[0];

  showBtn.addEventListener("click", () => {
    let songLibrary = document
      .getElementsByClassName("song-list")[0]
      .getElementsByTagName("ul")[0];
    //

    if (songLibrary.style.opacity == "0") {
      songLibrary.style.display = "block";
      setTimeout(() => {
        songLibrary.style.opacity = `${1}`;
      }, 100);

      showBtn.style.transform = `rotate(${45}deg)`;
    } else {
      songLibrary.style.opacity = `${0}`;
      setTimeout(() => {
        songLibrary.style.display = "none";
      }, 10);

      songLibrary.style.position = "relative";

      showBtn.style.transform = `rotate(${0}deg)`;
    }
  });

  //  play, pause song  by click
  play.addEventListener("click", () => {
    play.style.backgroundColor = "gray";
    let src = play.src;
    playPause(play);
    setTimeout(() => {
      play.style.backgroundColor = `rgb(189, 189, 189)`;
    }, 100);
  });

  // Current Time Updater

  currentSong.addEventListener("timeupdate", () => {
    if (!isNaN(currentSong.duration)) {
      document.querySelector(".song-time").innerHTML = `${secondsToMinutes(
        currentSong.currentTime
      )}/${secondsToMinutes(currentSong.duration)}`;
    }
    let present = (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector(".circle").style.left = present - 1 + "%";
    document.querySelector(".line-track").style.width = present + "%";
  });

  //  Attaching seek bar
  document.querySelector(".seek-bar").addEventListener("click", (e) => {
    let present = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = present - 1 + "%";

    document.querySelector(".line-track").style.width = present + 1 + "%";

    // when i update seek bar the current time must to be update
    currentSong.currentTime = (currentSong.duration * present) / 100;
  });
  // Auto pose when the  song ends
  currentSong.addEventListener("ended", () => {
    let src = play.src;

    src = src.replace("svg/pause.svg", "svg/Play.svg");
    play.src = src;
    document.querySelector(".circle").style.left = `${-2}%`;
    document.querySelector(".line-track").style.width = `${-2}%`;
    currentSong.currentTime = currentSong.currentTime = 0;
  });

  // Menu bar
  document.querySelector(".menue").addEventListener("click", () => {
    // alert("menue clicked");
    document.querySelector(".left").style.left = `${0}%`;
  });
  document.querySelector(".cancle").addEventListener("click", () => {
    // alert("menue clicked");
    document.querySelector(".left").style.left = `${-100}%`;
  });
  // Adding eventlistener to the Previous and Next

  // previus
  Previous.addEventListener("click", () => {
    let index = songs.indexOf("/" + currentSong.src.split("/").slice(-1)[0]);

    // when teh lenght of the 0 < =  0 then update the  songs last
    if (index - 1 < 0) {
      index = songs.length;
    } else {
      playMusic(songs[index - 1], false);
    }
  }); // Next
  Next.addEventListener("click", () => {
    let index = songs.indexOf("/" + currentSong.src.split("/").slice(-1)[0]);
    // when the lenght of the 13>=  13 then update the  songs to the first

    if (index + 1 >= songs.length) {
      index = 0;
    } else {
      playMusic(songs[index + 1], false);
    }
  });

  // Adding event ot  the Volume
  document
    .querySelector(".volume")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });
  // Mute  unmute behavior
  let cVolume = currentSong.volume;
  document
    .querySelector(".volume")
    .getElementsByTagName("img")[0]
    .addEventListener("click", () => {
      if (!(currentSong.volume == 0)) {
        currentSong.volume = currentSong.volume = 0;
        document
          .querySelector(".volume")
          .getElementsByTagName("input")[0].value = currentSong.volume;
        let el = document
          .querySelector(".volume")
          .getElementsByTagName("img")[0];
        el.src = el.src.replace("svg/volume.svg", "svg/mute.svg");
      } else {
        currentSong.volume = cVolume;
        document
          .querySelector(".volume")
          .getElementsByTagName("input")[0].value = cVolume * 100;
        let el = document
          .querySelector(".volume")
          .getElementsByTagName("img")[0];
        el.src = el.src.replace("svg/mute.svg", "svg/volume.svg");
      }
    });
}

main();
