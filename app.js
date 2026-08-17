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
let scene = 0;

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
  document.querySelector("#progressText").textContent = `${state.completed.length} / 36`;
  document.querySelector("#soundToggle").textContent = `SES: ${state.sound ? "AÇIK" : "KAPALI"}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2300);
}

function stampDate(value) {
  if (!value) return "Henüz başlanmadı";
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function render(templateId) {
  const template = document.querySelector(templateId);
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
  document.querySelector("#lastSave").textContent = stampDate(state.lastSave);
  const action = document.querySelector(".next-case-copy b");
  if (state.completed.includes(1)) action.textContent = "Bölüm 1'i yeniden incele";
}

function renderBoard() {
  render("#boardTemplate");
  const tabs = document.querySelector(".act-tabs");
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
    card.innerHTML = `<span class="number">${String(number).padStart(2, "0")}</span>${complete ? `<b>${episodeNames[number - 1]}</b>` : ""}<small>${complete ? "DOSYA KAPANDI" : unlocked ? "İNCELEMEYE HAZIR" : "KİLİTLİ DOSYA"}</small>`;
    if (number === 1) card.addEventListener("click", startEpisode);
    else if (unlocked) card.addEventListener("click", () => showToast("Bu prototipte yalnızca 1. bölüm oynanabilir."));
    grid.append(card);
  }
}

function renderNotebook(tab = "evidence") {
  render("#notebookTemplate");
  document.querySelector("#evidenceCount").textContent = state.evidence.length;
  document.querySelector("#questionCount").textContent = state.questions.length;
  document.querySelectorAll("[data-note-tab]").forEach(button => {
    button.classList.toggle("active", button.dataset.noteTab === tab);
    button.addEventListener("click", () => renderNotebookContent(button.dataset.noteTab));
  });
  renderNotebookContent(tab);
}

function renderNotebookContent(tab) {
  document.querySelectorAll("[data-note-tab]").forEach(b => b.classList.toggle("active", b.dataset.noteTab === tab));
  const content = document.querySelector("#notebookContent");
  const items = tab === "evidence" ? state.evidence : tab === "questions" ? state.questions : [];
  if (!items.length) {
    content.innerHTML = `<div class="empty-state"><div><i></i><h3>Bu sayfa henüz boş.</h3><p>Hikâyede bulduğun izler burada birikecek.</p></div></div>`;
    return;
  }
  content.innerHTML = `<div class="note-list">${items.map((item, i) => `<article class="note-entry"><time>KAYIT ${String(i + 1).padStart(2,"0")}</time><div><b>${item.title}</b><p>${item.text}</p></div></article>`).join("")}</div>`;
}

function startEpisode() { ambientMusic.pause(); musicWasUnlocked = false; scene = 0; renderEpisode(); }

function renderEpisode() {
  render("#episodeTemplate");
  const stage = document.querySelector("#sceneStage");
  document.querySelector("#sceneCounter").textContent = `SAHNE ${scene + 1} / 4`;
  document.querySelector("#sceneProgress").style.width = `${(scene + 1) * 25}%`;

  if (scene === 0) stage.innerHTML = `
    <div class="story-scene" style="grid-template-columns: 1fr;"><div class="scene-visual"><div class="canteen-window"></div><div class="old-locker"></div><div class="canteen-table"></div><div class="clue-glint"></div><div class="scene-caption"><span>OKUL KANTİNİ · ÖĞLE ARASI</span><h3>Kantindeki İlk İz</h3></div></div></div>`;
  if (scene === 1) stage.innerHTML = `
    <div class="inspect-scene"><div class="inspect-copy"><p class="eyebrow">SAHNE 2 · KEŞİF</p><h3>Dolabın altındaki izi bul.</h3><p>Dolabın alt köşesinde küçük bir çentik ve içine sıkışmış katlanmış bir sembol var: solmuş yeşil mürekkeple çizilmiş bir yaprak ve iz.</p><p class="narration">Kantin görevlisi yaklaşır: “O dolap senden önceki zamanlardan kalma. Üstünde bir pano vardı; sonra bir gün kimse fark etmeden kaldırıldı.”</p><div class="instruction"><i></i> ÇENTİĞİ İNCELE, SEMBOLÜ ÇIKAR</div></div><div class="inspect-area"><div class="locker-close"><button class="hotspot" aria-label="Gizli izi incele"></button></div></div></div>`;
  if (scene === 2) stage.innerHTML = `
    <div class="story-scene"><div class="scene-visual"><div class="canteen-window"></div><div class="canteen-table"></div><div class="scene-caption"><span>SAHNE 3 · İLK İPUCU</span><h3>Bir yaprak. Bir iz.</h3></div></div>
    <div class="scene-copy"><span class="speaker">KÂĞIDIN ARKASINDAKİ NOT</span><p class="dialogue">“Bu okulda bir iz bıraktım. Bulan, devam ettirsin.”</p><p class="narration">Yeşiliz sembolü ışığa tutar. Bu sıradan bir çöp parçası değildir. Sembol, dijital ipucu panosuna eklenen ilk kanıt olur.</p><button class="scene-next">KANITI İZ DEFTERİNE EKLE →</button></div></div>`;
  if (scene === 3) stage.innerHTML = `
    <div class="completion-scene"><div><div class="completion-mark"><i></i></div><p class="eyebrow">SAHNE 4 · KAPANIŞ · SINIF KORİDORU</p><h3>Birinci iz bulundu.</h3><p>Öğle arası biterken Kod, kâğıdın kenarındaki “01”i fark eder: “Sanki bir seri gibi.” Yeşiliz başını sallar. Bu okulda kim, ne zaman ve neden bir iz bırakmış olabilir?</p><p>Ders zili çalar. Eski dolap artık sıradan görünmez; sanki okul, uzun zamandır sakladığı hikâyeyi fısıldamaya başlamıştır.</p><div class="completion-actions"><button data-go="notebook">İZ DEFTERİNİ AÇ</button><button data-go="board">SEZON DOSYASINA DÖN</button></div></div></div>`;

  bindNavigation();
  const next = stage.querySelector(".scene-next");
  if (next) next.addEventListener("click", () => {
    if (scene === 2) recordEpisode();
    scene += 1; renderEpisode();
  });
  const hotspot = stage.querySelector(".hotspot");
  if (hotspot) hotspot.addEventListener("click", revealClue);
}

function revealClue() {
  const area = document.querySelector(".inspect-area");
  area.insertAdjacentHTML("beforeend", `<div class="clue-modal"><div class="clue-paper"><div class="leaf-symbol"></div><p>Bu okulda bir iz bıraktım.<br>Bulan, devam ettirsin.</p><small>01</small><button>İNCELEMEYE DEVAM ET</button></div></div>`);
  area.querySelector(".clue-modal button").addEventListener("click", () => { scene += 1; renderEpisode(); });
}

function recordEpisode() {
  if (!state.completed.includes(1)) state.completed.push(1);
  if (!state.evidence.some(e => e.id === "symbol")) state.evidence.push({ id: "symbol", title: "Yaprak ve İz Sembolü", text: "Kantindeki eski dolabın altında bulundu. Arkasında 'Bulan, devam ettirsin' yazıyor." });
  if (!state.evidence.some(e => e.id === "number01")) state.evidence.push({ id: "number01", title: "01 Numarası", text: "Kâğıdın kenarına gizlenmiş. Bunun bir serinin ilk parçası olabileceği düşünülüyor." });
  if (!state.questions.some(q => q.id === "owner")) state.questions.push({ id: "owner", title: "Bu izi kim bıraktı?", text: "Bu okulda kim, ne zaman ve neden bir iz bırakmış olabilir?" });
  save(); showToast("Kanıtlar İz Defteri'ne kaydedildi.");
}

document.querySelector("#soundToggle").addEventListener("click", () => {
  state.sound = !state.sound;
  if (state.sound) startAmbientMusic();
  else { ambientMusic.pause(); musicWasUnlocked = false; }
  save();
});
document.querySelector("#resetProgress").addEventListener("click", () => {
  if (!window.confirm("Kaydedilmiş ilerleme silinsin ve oyun en baştan başlasın mı?")) return;
  state = { ...defaultState };
  localStorage.removeItem("yesiliz-state");
  updateChrome();
  renderHome();
  showToast("Oyun başlangıç durumuna döndü.");
});
document.querySelector("#fullscreenToggle").addEventListener("click", async () => {
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
renderHome();
