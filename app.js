const backendURL = "http://127.0.0.1:8000";

let playlists = [];

async function loadPlaylists() {
  const res = await fetch("playlists.json");
  playlists = await res.json();

  const selectDiv = document.getElementById("playlist-select");
  const select = document.createElement("select");
  playlists.forEach((p, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = p.nome;
    select.appendChild(option);
  });
  selectDiv.appendChild(select);
}

async function getAudioUrl(videoId) {
  const status = document.getElementById("now-playing");
  status.textContent = `🔄 Chiedo link audio per: ${videoId}...`;

  try {
    const res = await fetch(`${backendURL}/api/yt-audio?id=${videoId}`);
    const data = await res.json();

    if (!data.url) {
      status.textContent = "❌ Errore: Nessun link audio ricevuto";
      return null;
    }

    status.textContent = `✅ Audio URL: ${data.url}`;
    return data.url;
  } catch (err) {
    status.textContent = "❌ Errore fetch: " + err.message;
    return null;
  }
}

async function shuffleAndPlay() {
  const videoIds = [
    "dQw4w9WgXcQ",
    "3JZ_D3ELwOQ",
    "DLzxrzFCyOs"
  ].sort(() => 0.5 - Math.random());

  const firstId = videoIds[0];
  const audioUrl = await getAudioUrl(firstId);

  if (!audioUrl) return;

  const audio = document.getElementById("audio");
  audio.src = audioUrl;
  audio.play().then(() => {
    document.getElementById("now-playing").textContent = `🎶 In riproduzione: https://youtu.be/${firstId}`;
  }).catch(err => {
    document.getElementById("now-playing").textContent = "❌ Errore nel player: " + err.message;
  });
}

document.getElementById("shuffle-btn").addEventListener("click", shuffleAndPlay);
window.addEventListener("DOMContentLoaded", loadPlaylists);
