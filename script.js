document.addEventListener("DOMContentLoaded", () => {

  const surahList = document.getElementById("surah-list");
  const ayahContainer = document.getElementById("ayah-container");
  const audioPlayer = document.getElementById("audioPlayer");

  let currentAyahs = [];
  let currentAyahIndex = 0;

  /* LOAD SURAH */
  fetch("https://api.alquran.cloud/v1/surah")
    .then(res => res.json())
    .then(result => {
      result.data.forEach(surah => {
        const btn = document.createElement("button");
        btn.className = "surah-card";
        btn.innerHTML = `
          <b>${surah.number}. ${surah.name}</b>
          <small>${surah.englishName}</small>
        `;
        btn.onclick = () => loadSurah(surah.number);
        surahList.appendChild(btn);
      });
    })
    .catch(err => {
      surahList.innerHTML = "Gagal memuat surah.";
      console.error(err);
    });

  /* LOAD AYAT */
  function loadSurah(number) {
    ayahContainer.innerHTML = "Memuat ayat...";
    fetch(`https://api.alquran.cloud/v1/surah/${number}`)
      .then(res => res.json())
      .then(result => {
        currentAyahs = result.data.ayahs;
        currentAyahIndex = 0;
        renderAyahs();
      });
  }

  /* RENDER AYAT */
  function renderAyahs() {
    ayahContainer.innerHTML = "";

    currentAyahs.forEach((ayah, index) => {
      const div = document.createElement("div");
      div.className = "ayah-card";

      div.innerHTML = `
        <p class="arabic">${ayah.text}</p>
        <button class="play-btn">▶ Putar</button>
      `;

      div.querySelector(".play-btn").onclick = () => playAyah(ayah.number, index);

      ayahContainer.appendChild(div);
    });
  }

  /* PLAY AYAT */
  function playAyah(ayahNumber, index) {
    currentAyahIndex = index;
    audioPlayer.src = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNumber}.mp3`;
    audioPlayer.play();
  }

  /* AUTO NEXT */
  audioPlayer.onended = () => {
    if (currentAyahIndex < currentAyahs.length - 1) {
      currentAyahIndex++;
      playAyah(currentAyahs[currentAyahIndex].number, currentAyahIndex);
    }
  };

});
