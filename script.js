const surahList = document.getElementById("surah-list");
const ayahView = document.getElementById("ayah-view");
const ayahList = document.getElementById("ayah-list");
const surahTitle = document.getElementById("surah-title");
const backBtn = document.getElementById("back");
const search = document.getElementById("searchInput");
const qariSelect = document.getElementById("qari");
const quotesBox = document.getElementById("quotes");
const themeToggle = document.getElementById("themeToggle");

let currentQari = "alafasy";
let audioPlayer = new Audio();
let surahs = [];

const quotes = [
  "Sesungguhnya Al-Qur’an adalah cahaya bagi hati.",
  "Hati yang jauh dari Al-Qur’an akan terasa kosong.",
  "Al-Qur’an tidak berubah, tapi ia mengubahmu.",
  "Bacalah Al-Qur’an sebelum dunia menyibukkanmu."
];

quotesBox.textContent = quotes[Math.floor(Math.random() * quotes.length)];

fetch("https://api.alquran.cloud/v1/surah")
  .then(res => res.json())
  .then(data => {
    surahs = data.data;
    renderSurahs(surahs);
  });

function renderSurahs(list) {
  surahList.innerHTML = "";
  list.forEach(s => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<strong>${s.number}. ${s.name}</strong><br>${s.englishName}`;
    div.onclick = () => showAyahs(s.number, s.name);
    surahList.appendChild(div);
  });
}

async function showAyahs(num, name) {
  surahList.classList.add("hidden");
  ayahView.classList.remove("hidden");
  surahTitle.textContent = name;
  ayahList.innerHTML = "";

  const ar = await fetch(`https://api.alquran.cloud/v1/surah/${num}/ar.${currentQari}`).then(r => r.json());
  const id = await fetch(`https://api.alquran.cloud/v1/surah/${num}/id.indonesian`).then(r => r.json());

  ar.data.ayahs.forEach((a, i) => {
    const div = document.createElement("div");
    div.className = "ayah-card";
    div.innerHTML = `
      <button class="play-btn">▶</button>
      <p class="arab">${a.text}</p>
      <p class="translation">${id.data.ayahs[i].text}</p>
    `;
    div.querySelector(".play-btn").onclick = () => {
      audioPlayer.pause();
      audioPlayer.src = a.audio;
      audioPlayer.play();
    };
    ayahList.appendChild(div);
  });
}

backBtn.onclick = () => {
  ayahView.classList.add("hidden");
  surahList.classList.remove("hidden");
};

/* =========================
   SMART SEARCH SURAH (FIXED)
========================= */
const search = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");

search.addEventListener("input", function () {
  const keyword = this.value.toLowerCase().trim();
  suggestionsBox.innerHTML = "";

  if (!keyword) {
    suggestionsBox.style.display = "none";
    renderSurahs(surahs);
    return;
  }

  const filtered = surahs.filter(s =>
    s.name.toLowerCase().includes(keyword) ||
    s.englishName.toLowerCase().includes(keyword) ||
    s.number.toString().includes(keyword)
  );

  renderSurahs(filtered);

  if (filtered.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  filtered.slice(0, 7).forEach(s => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.textContent = `${s.number}. ${s.englishName}`;
    div.onclick = () => {
      showAyahs(s.number, s.name);
      suggestionsBox.style.display = "none";
      search.value = "";
    };
    suggestionsBox.appendChild(div);
  });

  suggestionsBox.style.display = "block";
});

/* ENTER buka hasil pertama */
search.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const first = suggestionsBox.querySelector(".suggestion-item");
    if (first) first.click();
  }
});

qariSelect.onchange = e => currentQari = e.target.value;

/* THEME */
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "☀️";
}

themeToggle.onclick = () => {
  document.body.classList.toggle("light");
  const light = document.body.classList.contains("light");
  themeToggle.textContent = light ? "☀️" : "🌙";
  localStorage.setItem("theme", light ? "light" : "dark");
};
