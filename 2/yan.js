

const defaultState = { completed: [], evidence: [], questions: [], inventory: [], invScrollIndex: 0, lastSave: null, activeAct: 0, sound: true, sfx: true };
let state;
try { state = { ...defaultState, ...JSON.parse(localStorage.getItem("yesiliz-state") || "{}") }; }
catch { state = { ...defaultState }; }
let scene = 0;

const toast = document.querySelector("#toast");
let musicWasUnlocked = false;

function startAmbientMusic() {
  if (!state.sound || musicWasUnlocked) return;
  const ambientMusic = document.querySelector("#ambientMusic");
  if (ambientMusic) {
    ambientMusic.play().then(() => { musicWasUnlocked = true; }).catch(() => {});
  }
}


function playClickSound() {
  if (!state.sound) return;
  const clickSound = document.querySelector("#clickSound");
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.error("Sound error:", e));
  }
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
  const sfxBtn = document.querySelector("#sfxToggle");
  if (sfxBtn) { sfxBtn.textContent = "♫"; sfxBtn.classList.toggle("muted", !state.sfx); }
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
    <div class="story-scene" style="grid-template-columns: 1fr;"><div class="scene-visual"><div class="library-window"></div><div class="scene-caption"><span>KÜTÜPHANE · PENCERE KENARI</span><h3>Nabız Gibi Bir İz</h3></div></div>
    <div class="scene-copy"><p class="narration">Bir önceki gün bulunan '01' numarasının peşini bırakmayan Yeşiliz, teneffüste kütüphaneye kaçar. Sembolü tekrar ışığa tutar; bu kez kâğıdın arka yüzünde önceden fark etmediği ince bir çizgi dikkatini çeker: küçük, dalgalı bir çizim, tıpkı bir nabız grafiği gibi.</p>
    <span class="speaker">YEŞİLİZ (İç Ses)</span><p class="dialogue">"Dün gördüğüm sadece bir cümle değilmiş demek. Bu kâğıt daha çok şey saklıyor."</p>
    <button class="scene-next">DEVAM ET →</button></div></div>`;
  if (scene === 1) stage.innerHTML = `
    <div class="inspect-scene"><div class="inspect-copy"><p class="eyebrow">SAHNE 2 · ÇÖZÜMLEME</p><h3>Nabız çizimini incele.</h3><p>Kod, telefonundaki bir uygulamayla dalga şeklini büyütüp inceler; bu şeklin altında, çok küçük harflerle 'Bedenin sana söylediklerini dinle' yazdığını fark ederler.</p><p class="narration">Tam bu sırada Yeşiliz, kendi kalbinin de hızlandığını hisseder — heyecanla mı, yoksa bir şeyi kaçırıyor olma korkusuyla mı, kestiremez.</p><div class="instruction"><i></i> ÇİZİMİ YAKINLAŞTIR</div></div><div class="inspect-area"><div class="pulse-paper"><button class="hotspot" aria-label="Nabız çizimini incele"></button></div></div></div>`;
  if (scene === 2) stage.innerHTML = `
    <div class="story-scene"><div class="scene-visual"><div class="library-window"></div><div class="scene-caption"><span>SAHNE 3 · KAPANIŞ</span><h3>Tehlike...</h3></div></div>
    <div class="scene-copy"><span class="speaker">KÂĞITTAKİ NOT</span><p class="dialogue">"Tehlike..."</p><p class="narration">Kâğıdı katlarken Yeşiliz, alt köşesinde önceden fark etmediği küçük bir kırışıklık daha görür ve dikkatle açar. Tek kelime, yarım bırakılmış gibi duruyor. Yeşiliz bunun devamını nerede arayacağını bilemiyor ama bir sonraki dersin fen sınıfında olması, ona tuhaf bir işaret gibi geliyor.</p><button class="scene-next">KANITI İZ DEFTERİNE EKLE →</button></div></div>`;
  if (scene === 3) stage.innerHTML = `
    <div class="completion-scene"><div><div class="completion-mark"><i></i></div><p class="eyebrow">BÖLÜM 2 TAMAMLANDI</p><h3>Birinci ipucu çözüldü.</h3><p>Tehlike... Tek kelime, yarım bırakılmış gibi duruyor. Yeşiliz bunun devamını nerede arayacağını bilemiyor ama bir sonraki dersin fen sınıfında olması, ona tuhaf bir işaret gibi geliyor.</p><div class="completion-actions"><button data-go="notebook">İZ DEFTERİNİ AÇ</button><button data-go="board">SEZON DOSYASINA DÖN</button></div></div></div>`;

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
          window.parent.postMessage({type: "NAVIGATE", target: "notebook"}, "*");
      } else {
          window.parent.postMessage({type: "NAVIGATE", target: "board"}, "*");
      }
  }));
}

function revealClue() {
  const area = document.querySelector(".inspect-area");
  area.insertAdjacentHTML("beforeend", `<div class="clue-modal"><div class="clue-paper"><div class="leaf-symbol"></div><p>Bu okulda bir iz bıraktım.<br>Bulan, devam ettirsin.</p><small>01</small><button>İNCELEMEYE DEVAM ET</button></div></div>`);
  area.querySelector(".clue-modal button").addEventListener("click", () => { scene += 1; renderEpisode(); });
}

function recordEpisode() {
  if (!state.completed.includes(2)) state.completed.push(2);
  if (!state.evidence.some(e => e.id === "pulse")) state.evidence.push({ id: "pulse", title: "Nabız Çizimi", text: "Sembolün arkasındaki dalgalı çizgi. Büyütülünce 'Bedenin sana söylediklerini dinle' yazdığı görülüyor." });
  if (!state.evidence.some(e => e.id === "danger")) state.evidence.push({ id: "danger", title: "Yarım Kelime: Tehlike...", text: "Kâğıdın köşesindeki kırışıklıkta bulunan yarım kelime." });
  if (!state.questions.some(q => q.id === "body_signal")) state.questions.push({ id: "body_signal", title: "Beden bir sinyal cihazı mıdır?", text: "Bu izi bırakan kişi, bedenin susmadığını, bir şeyleri hissettiğini bize neden söylemek istedi?" });
  save(); showToast("Kanıtlar İz Defteri'ne kaydedildi.");
}

const st = document.querySelector("#soundToggle");
if (st) st.addEventListener("click", () => {
  state.sound = !state.sound;
  const ambientMusic = document.querySelector("#ambientMusic");
  if (state.sound) {
    startAmbientMusic();
  } else {
    if (ambientMusic) ambientMusic.pause();
    musicWasUnlocked = false;
  }
  save();
});

const ft = document.querySelector("#fullscreenToggle");
if (ft) ft.addEventListener("click", async () => {
  if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
  else await document.exitFullscreen?.();
});

const backBtns = document.querySelectorAll(".back-button, [data-go='home']");
backBtns.forEach(b => b.addEventListener("click", () => {
  window.parent.postMessage({type: "NAVIGATE", target: "home"}, "*");
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


// Görsel Envanter Yönetimi (Bölüm 2)
const VISIBLE_SLOTS = 5;
function updateInventoryUI() {
  const track = document.querySelector("#inventorySlots");
  const upBtn = document.querySelector("#invUpBtn");
  const downBtn = document.querySelector("#invDownBtn");
  if (!track) return;

  if (!state.inventory) state.inventory = [];
  if (state.invScrollIndex === undefined) state.invScrollIndex = 0;

  const maxScroll = Math.max(0, state.inventory.length - VISIBLE_SLOTS);
  if (upBtn) upBtn.disabled = (state.invScrollIndex >= maxScroll);
  if (downBtn) downBtn.disabled = (state.invScrollIndex <= 0);

  while (track.children.length > state.inventory.length) {
    track.removeChild(track.lastChild);
  }
  while (track.children.length < state.inventory.length) {
    const slot = document.createElement("div");
    slot.className = "inv-slot has-item";
    slot.innerHTML = `<img src="" alt=""><span class="slot-label"></span>`;
    track.appendChild(slot);
  }
  
  Array.from(track.children).forEach((slot, index) => {
    const item = state.inventory[index];
    slot.dataset.id = item.id;
    const img = slot.querySelector("img");
    const label = slot.querySelector(".slot-label");
    img.src = item.icon;
    label.textContent = item.name;
  });

  const slotHeight = 118 + 18; 
  track.style.transform = `translateY(-${state.invScrollIndex * slotHeight}px)`;
  
  // Note: 2/yan.js has saveState or save() function depending on definition.
  // Assuming saveState() exists if this is a yan.js file structure.
  if (typeof saveState === 'function') saveState();
}

setTimeout(() => {
  const upBtn = document.querySelector("#invUpBtn");
  const downBtn = document.querySelector("#invDownBtn");
  if (upBtn) {
    upBtn.addEventListener("click", () => {
      if (!state.inventory) return;
      const maxScroll = Math.max(0, state.inventory.length - VISIBLE_SLOTS);
      if (state.invScrollIndex < maxScroll) {
        state.invScrollIndex++;
        updateInventoryUI();
      }
    });
  }
  if (downBtn) {
    downBtn.addEventListener("click", () => {
      if (!state.inventory) return;
      if (state.invScrollIndex > 0) {
        state.invScrollIndex--;
        updateInventoryUI();
      }
    });
  }
  updateInventoryUI();
}, 100);

const sfxBtn = document.querySelector("#sfxToggle");
if (sfxBtn) {
  sfxBtn.addEventListener("click", () => {
    state.sfx = !state.sfx;
    if (typeof updateChrome === "function") updateChrome();
    if (typeof save === "function") save();
  });
}

document.addEventListener("click", (e) => {
  if (!state.sfx) return;
  const isClickable = e.target.closest('button') || e.target.closest('a') || (window.getComputedStyle(e.target).cursor === 'pointer');
  if (isClickable) {
    const cs = document.getElementById('clickSound');
    if (cs) {
      cs.currentTime = 0;
      cs.play().catch(()=>{});
    }
  }
});
