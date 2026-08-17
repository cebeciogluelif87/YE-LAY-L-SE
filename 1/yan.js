const defaultState = { completed: [], evidence: [], questions: [], lastSave: null, activeAct: 0, sound: true };
let state;
try { state = { ...defaultState, ...JSON.parse(localStorage.getItem("yesiliz-state") || "{}") }; }
catch { state = { ...defaultState }; }
let scene = 0;

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

function renderEpisode() {
  const stage = document.querySelector("#sceneStage");
  if (!stage) return;
  
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

  const next = stage.querySelector(".scene-next");
  if (next) next.addEventListener("click", () => {
    if (scene === 2) recordEpisode();
    scene += 1; renderEpisode();
  });
  const hotspot = stage.querySelector(".hotspot");
  if (hotspot) hotspot.addEventListener("click", revealClue);
  
  // Also we need to bind navigation buttons from the completion scene
  stage.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => {
      // Go back to ana.html, maybe passing the tab to open
      if (button.dataset.go === "notebook") {
          window.location.href = "../ana.html#notebook";
      } else {
          window.location.href = "../ana.html#board";
      }
  }));
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

const st = document.querySelector("#soundToggle");
if (st) st.addEventListener("click", () => {
  state.sound = !state.sound;
  if (state.sound) startAmbientMusic();
  else { ambientMusic.pause(); musicWasUnlocked = false; }
  save();
});

const ft = document.querySelector("#fullscreenToggle");
if (ft) ft.addEventListener("click", async () => {
  if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
  else await document.exitFullscreen?.();
});

const backBtns = document.querySelectorAll(".back-button, [data-go='home']");
backBtns.forEach(b => b.addEventListener("click", () => {
  window.location.href = "../ana.html";
}));

updateChrome();
fitGameStage();
window.addEventListener("resize", fitGameStage);
document.addEventListener("fullscreenchange", fitGameStage);
startAmbientMusic();
document.addEventListener("mousedown", startAmbientMusic, { once: true });
document.addEventListener("mousemove", startAmbientMusic, { once: true });
document.addEventListener("keydown", startAmbientMusic, { once: true });

// Start episode immediately
renderEpisode();
