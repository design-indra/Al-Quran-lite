document.addEventListener("DOMContentLoaded", function () {

const themeToggle = document.getElementById("themeToggle");

// Set tema awal saat load halaman
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "☀️";
} else {
  themeToggle.textContent = "🌙";
}

// Toggle theme saat tombol diklik
themeToggle.onclick = () => {
  document.body.classList.toggle("light");
  const light = document.body.classList.contains("light");
  themeToggle.textContent = light ? "☀️" : "🌙";
  localStorage.setItem("theme", light ? "light" : "dark");
};

const surahList = document.getElementById("surah-list");
const ayahView = document.getElementById("ayah-view");
const ayahList = document.getElementById("ayah-list");
const surahTitle = document.getElementById("surah-title");
const backBtn = document.getElementById("back");
const search = document.getElementById("search");
const qariSelect = document.getElementById("qari");
const quotesBox = document.getElementById("quotes");
const themeToggle = document.getElementById("themeToggle");

let currentQari = "alafasy";
let audioPlayer = new Audio();
let surahs = [];

// Quotes random
const quotes = [
  "Sesungguhnya Al-Qur’an adalah cahaya bagi hati.",
  "Hati yang jauh dari Al-Qur’an akan terasa kosong.",
  "Al-Qur’an tidak berubah, tapi ia mengubahmu.",
  "Bacalah Al-Qur’an sebelum dunia menyibukkanmu."
];
quotesBox.textContent = quotes[Math.floor(Math.random() * quotes.length)];

// Ambil daftar surah
fetch("https://api.alquran.cloud/v1/surah")
  .then(res => res.json())
  .then(data => {
    surahs = data.data;
    renderSurahs(surahs);
  })
  .catch(err => console.error("Gagal memuat surah:", err));

// Render daftar surat
function renderSurahs(list) {
  surahList.innerHTML = "";
  list.forEach(s => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<strong>${s.number}. ${s.name}</strong><br>${s.englishName}`;
    div.addEventListener("click", () => showAyahs(s.number, s.name));
    surahList.appendChild(div);
  });
}

// Tampilkan ayah
async function showAyahs(num, name) {
  try {
    surahList.classList.add("hidden");
    ayahView.classList.remove("hidden");
    surahTitle.textContent = name;
    ayahList.innerHTML = "";

    const arRes = await fetch(`https://api.alquran.cloud/v1/surah/${num}/ar.${currentQari}`);
    const ar = await arRes.json();
    const idRes = await fetch(`https://api.alquran.cloud/v1/surah/${num}/id.indonesian`);
    const id = await idRes.json();

    if (!ar.data || !id.data) {
      ayahList.innerHTML = "<p>Error: Gagal memuat surah.</p>";
      return;
    }

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

    ayahView.scrollIntoView({behavior: "smooth"});

  } catch (err) {
    ayahList.innerHTML = `<p>Error: ${err.message}</p>`;
    console.error(err);
  }
}

// Tombol kembali
backBtn.onclick = () => {
  ayahView.classList.add("hidden");
  surahList.classList.remove("hidden");
};

// Search surat
search.oninput = e => {
  const keyword = e.target.value.toLowerCase().trim();
  const filtered = surahs.filter(s =>
    s.name.toLowerCase().includes(keyword) ||
    s.englishName.toLowerCase().includes(keyword) ||
    s.number.toString().includes(keyword)
  );
  renderSurahs(filtered);
};

// Pilihan qari
qariSelect.onchange = e => currentQari = e.target.value;

// Theme toggle
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

});
