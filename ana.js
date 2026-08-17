const acts = [
  { name: "PERDE I · DEFTERİN VARLIĞI", range: [1, 9] },
  { name: "PERDE II · DİJİTAL İZ", range: [10, 18] },
  { name: "PERDE III · GERÇEK MÜCADELE", range: [19, 27] },
  { name: "PERDE IV · SON SAYFA", range: [28, 36] }
];

const episodeNames = [
  "Kantindeki İlk İz", "Nabız Gibi Bir İz", "Şifreli Tehlike Listesi", "Bahçedeki Dört Kök",
  "114 Numaralı Dolap", "Kantin Teyzesinin Hatırladığı", "Gece Yarısı Işıkları", "Panoda Dağılan Düşünceler",
  "Bir Öğrenciydi", "Son Sayfadaki Kullanıcı Adı", "Tozlu Forumun Kapısı", "Kilitli Kutunun Şifresi",
  "Panodaki Anahtar Parçası", "Mükemmel Görünen Profil", "Ödülün Peşinde", "Rumuzlar Arasında",
  "Yıllardır Taşınan Yanlış", "Oyun Kayıtları", "Çarkın Arkasındaki Sistem", "Ekransız Gün",
  "Bağlantıyı Kes", "Yardım Aranan Ama Bulunamayan", "Kimsenin Fark Etmediği Öğrenci", "Sanal Çarkın Gölgesi",
  "Bugün Hâlâ Konuşuluyor", "Yanlış İnançlar Panosu", "Cesaret İsteyen Cümle", "Hayır Diyemediği An",
  "Son Sayfanın Kilidi", "Ortak Bir Etkinlik", "Kararlılığın İzi", "Kontrol Yanılgısı", "Kilit Açılıyor",
  "Yarım Kalan Plan", "Yarım Kalan Yerden Devam", "Kayıp Defterin Sonu"
];

const defaultState = { completed: [], evidence: [], questions: [], lastSave: null, activeAct: 0, sound: true };
let state;
try { state = { ...defaultState, ...JSON.parse(localStorage.getItem("yesiliz-state") || "{}") }; }
catch { state = { ...defaultState }; }

const view = document.querySelector("#view");
const toast = document.querySelector("#toast");
const ambientMusic = document.querySelector("#ambientMusic");
let musicWasUnlocked = false;

function startAmbientMusic() {
  if (!state.sound || musicWasUnlocked) return;
  ambientMusic.play().then(() => { musicWasUnlocked = true; }).catch(() => {});
}

function fitGameStage() {
  const designWidth = 1920;
  const designHeight = 1080;
  const scale = Math.min(window.innerWidth / designWidth, window.innerHeight / designHeight);
  const app = document.querySelector("#app");
  if (!app) return;
  app.style.transform = `scale(${scale})`;
  app.style.left = `${(window.innerWidth - designWidth * scale) / 2}px`;
  app.style.top = `${(window.innerHeight - designHeight * scale) / 2}px`;
}

function save() {
  state.lastSave = new Date().toISOString();
  localStorage.setItem("yesiliz-state", JSON.stringify(state));
  updateChrome();
}

function updateChrome() {
  const p = document.querySelector("#progressText");
  if (p) p.textContent = `${state.completed.length} / 36`;
  const st = document.querySelector("#soundToggle");
  if (st) st.textContent = `SES: ${state.sound ? "AÇIK" : "KAPALI"}`;
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2300);
}

function stampDate(value) {
  if (!value) return "Henüz başlanmadı";
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function render(templateId) {
  if (!view) return;
  const template = document.querySelector(templateId);
  if (!template) return;
  view.replaceChildren(template.content.cloneNode(true));
  view.focus({ preventScroll: true });
  bindNavigation();
}

function bindNavigation() {
  document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.go)));
  document.querySelectorAll("[data-start]").forEach(button => button.addEventListener("click", startEpisode));
}

function navigate(target) {
  if (target === "home") { startAmbientMusic(); renderHome(); }
  if (target === "board") { ambientMusic.pause(); musicWasUnlocked = false; renderBoard(); }
  if (target === "notebook") { ambientMusic.pause(); musicWasUnlocked = false; renderNotebook(); }
}

function renderHome() {
  render("#homeTemplate");
  const ls = document.querySelector("#lastSave");
  if (ls) ls.textContent = stampDate(state.lastSave);
  const action = document.querySelector(".next-case-copy b");
  if (action && state.completed.includes(1)) action.textContent = "Bölüm 1 — Tamamlandı";
}

function renderBoard() {
  render("#boardTemplate");
  const tabs = document.querySelector(".act-tabs");
  if (!tabs) return;
  acts.forEach((act, index) => {
    const button = document.createElement("button");
    button.textContent = act.name;
    button.className = index === state.activeAct ? "active" : "";
    button.addEventListener("click", () => { state.activeAct = index; save(); renderBoard(); });
    tabs.append(button);
  });
  const grid = document.querySelector(".episode-grid");
  const [start, end] = acts[state.activeAct].range;
  for (let number = start; number <= end; number++) {
    const complete = state.completed.includes(number);
    const unlocked = number === 1 || state.completed.includes(number - 1);
    const card = document.createElement("button");
    card.className = `episode-card ${complete ? "complete" : ""} ${unlocked && !complete ? "current" : ""}`;
    card.style.setProperty("--tilt", `${((number % 5) - 2) * .8}deg`);
    card.disabled = !unlocked;
    card.innerHTML = `<span class="number">${String(number).padStart(2, "0")}</span>${complete ? `<b>${episodeNames[number - 1]}</b>` : ""}<small>${complete ? "TAMAMLANDI" : unlocked ? "İNCELEMEYE HAZIR" : "KİLİTLİ DOSYA"}</small>`;
    if (number === 1) card.addEventListener("click", startEpisode);
    else if (unlocked) card.addEventListener("click", () => showToast("Bu prototipte yalnızca 1. bölüm oynanabilir."));
    grid.append(card);
  }
}

function renderNotebook(tab = "evidence") {
  render("#notebookTemplate");
  const ec = document.querySelector("#evidenceCount");
  if (ec) ec.textContent = state.evidence.length;
  const qc = document.querySelector("#questionCount");
  if (qc) qc.textContent = state.questions.length;
  document.querySelectorAll("[data-note-tab]").forEach(button => {
    button.classList.toggle("active", button.dataset.noteTab === tab);
    button.addEventListener("click", () => renderNotebookContent(button.dataset.noteTab));
  });
  renderNotebookContent(tab);
}

function renderNotebookContent(tab) {
  document.querySelectorAll("[data-note-tab]").forEach(b => b.classList.toggle("active", b.dataset.noteTab === tab));
  const content = document.querySelector("#notebookContent");
  if (!content) return;
  const items = tab === "evidence" ? state.evidence : tab === "questions" ? state.questions : [];
  if (!items.length) {
    content.innerHTML = `<div class="empty-state"><div><i></i><h3>Bu sayfa henüz boş.</h3><p>Hikâyede bulduğun izler burada birikecek.</p></div></div>`;
    return;
  }
  content.innerHTML = `<div class="note-list">${items.map((item, i) => `<article class="note-entry"><time>KAYIT ${String(i + 1).padStart(2,"0")}</time><div><b>${item.title}</b><p>${item.text}</p></div></article>`).join("")}</div>`;
}

function startEpisode() {
  window.location.href = "1/yan.html";
}

const st = document.querySelector("#soundToggle");
if (st) st.addEventListener("click", () => {
  state.sound = !state.sound;
  if (state.sound) startAmbientMusic();
  else { ambientMusic.pause(); musicWasUnlocked = false; }
  save();
});

const rp = document.querySelector("#resetProgress");
if (rp) rp.addEventListener("click", () => {
  if (!window.confirm("Kaydedilmiş ilerleme silinsin ve oyun en baştan başlasın mı?")) return;
  state = { ...defaultState };
  localStorage.removeItem("yesiliz-state");
  updateChrome();
  renderHome();
  showToast("Oyun başlangıç durumuna döndü.");
});

const ft = document.querySelector("#fullscreenToggle");
if (ft) ft.addEventListener("click", async () => {
  if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
  else await document.exitFullscreen?.();
});

document.querySelectorAll(".topbar [data-go], .mobile-nav [data-go]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.go)));
updateChrome();
fitGameStage();
window.addEventListener("resize", fitGameStage);
document.addEventListener("fullscreenchange", fitGameStage);
startAmbientMusic();
document.addEventListener("mousedown", startAmbientMusic, { once: true });
document.addEventListener("mousemove", startAmbientMusic, { once: true });
document.addEventListener("keydown", startAmbientMusic, { once: true });

if (window.location.hash === "#notebook") {
  navigate("notebook");
} else if (window.location.hash === "#board") {
  navigate("board");
} else {
  renderHome();
}
