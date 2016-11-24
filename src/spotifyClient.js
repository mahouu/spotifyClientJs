var texto = "";
var timeoutUID = 0;
var cajaTexto = document.querySelector("input");
var divAlbums = document.querySelector(".suggest nav");
var divPlaying = document.querySelector(".albums");
var audio = document.querySelector("audio");
var playList = [];
var playListNames = [];
var addTrack = function (song, songName){
    playList.push(song);
    playListNames.push(songName);
    //console.log('adding song',playList);
}

var writeAnchor = function (track, trackName){
    const playingHref = document.createElement('a');
    playingHref.innerText = trackName;
    playingHref.addEventListener('click',()=>{
        audio.src=track;
        audio.play();
    });
    divPlaying.appendChild(playingHref);
}

audio.addEventListener('ended',()=>{
                  var index = playList.length;
                  var track = playList.shift();
                  var trackName = playListNames.shift();
                  audio.src=track;
                  playList.splice(index);
                  playListNames.splice(index);
                  console.log(trackName);
                  writeAnchor(track, trackName);
              });

var llamadaSpotify = function (){
    fetch('https://api.spotify.com/v1/search?q='+texto+'&type=track')
  .then(function(response) {
    var contentType = response.headers.get("content-type");
    if(contentType && contentType.indexOf("application/json") !== -1) {
      return response.json().then(function({tracks:{items}}) {
          items.forEach(({name,id, href, preview_url}) =>{
              const enlace = document.createElement('a');
              enlace.innerText = name;
              enlace.href = href;
              addTrack(preview_url, name);
              enlace.addEventListener('mousedown',()=>{
                  audio.src=preview_url;
                  console.log(preview_url);
                  writeAnchor(preview_url, name);
              });
              
              divAlbums.appendChild(enlace);
          })
      });
    } else {
      console.log("Oops, we haven't got JSON!");
    }
}).catch(function(response){
  console.log("Petao", response);
});
}
var evento = cajaTexto.addEventListener('input', function(event){
    texto = event.target.value;
    clearTimeout(timeoutUID);
    timeoutUID = setTimeout(llamadaSpotify, 3000);
})


