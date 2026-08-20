const defaultState = {
  completed: [],
  evidence: [], // Somut Kanıtlar arşivi
  notebook: {
    thoughts: [],  // Düşünceler / Notlar
    findings: [],  // Öğrenilenler
    questions: []  // Açık Sorular
  },
  questions: [], // Geriye dönük uyumluluk
  inventory: [], // Bölüm içi aktif nesneler
  invScrollIndex: 0,
  lastSave: null,
  activeAct: 0,
  sound: true,
  sfx: true,
  episode1Stage: null, // "intro1" | "intro2" | "exploration" | "a8" | "a9"
  episode1DialogIndex: 0,
  lockerOpen: false,
  rulerTaken: false,
  floorOpened: false,
  paperFound: false,
  paperTaken: false,
  paperInspecting: false,
  paperStep: 0,
  paperFullyOpened: false,
  paperBackSeen: false,
  paperLightPuzzleSolved: false,
  paperMessageRevealed: false,
  firstRiddleSolved: false
};

let state;
try {
  state = { ...defaultState, ...JSON.parse(localStorage.getItem("yesiliz-state") || "{}") };
} catch {
  state = { ...defaultState };
}

if (!state.notebook || typeof state.notebook !== "object") {
  state.notebook = {
    thoughts: [],
    findings: [],
    questions: Array.isArray(state.questions) ? [...state.questions] : []
  };
}

// Kanıt Panosu için görsel yolu migrasyonu (ana.html perspektifinden 1/assets/...)
if (Array.isArray(state.evidence)) {
  let migrated = false;
  state.evidence.forEach(item => {
    if (item && item.image) {
      if (item.image === "assets/katli3.png") {
        item.image = "1/assets/katli3.png";
        migrated = true;
      } else if (item.episode && item.image.startsWith("assets/")) {
        item.image = `${item.episode}/${item.image}`;
        migrated = true;
      }
    }
  });
  if (migrated) {
    try {
      localStorage.setItem("yesiliz-state", JSON.stringify(state));
    } catch { }
  }
}

// Envanterde cetvel varsa state.rulerTaken senkronize olsun
if (Array.isArray(state.inventory) && state.inventory.some(i => i.id === "cetvel")) {
  state.rulerTaken = true;
}

let scene = 0;
const toast = document.querySelector("#toast");
let musicWasUnlocked = false;

function startAmbientMusic() {
  if (!state.sound || musicWasUnlocked) return;
  const ambientMusic = document.querySelector("#ambientMusic");
  if (ambientMusic) {
    ambientMusic.play().then(() => { musicWasUnlocked = true; }).catch(() => { });
  }
}

function playClickSound() {
  if (!state.sfx) return;
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
  if (sfxBtn) {
    sfxBtn.textContent = "♫";
    sfxBtn.classList.toggle("muted", !state.sfx);
  }
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2300);
}

function addNotebookEntry(category, entry) {
  if (!state.notebook || typeof state.notebook !== "object") {
    state.notebook = { thoughts: [], findings: [], questions: [] };
  }
  if (!Array.isArray(state.notebook[category])) {
    state.notebook[category] = [];
  }
  const existingIdx = state.notebook[category].findIndex(item => item.id === entry.id);
  if (existingIdx >= 0) {
    state.notebook[category][existingIdx] = {
      ...state.notebook[category][existingIdx],
      ...entry
    };
  } else {
    state.notebook[category].push({
      date: new Date().toISOString(),
      ...entry
    });
  }
}

/* =========================================================
   STANDART ZOOM / YAKIN ÇEKİM MODAL SİSTEMİ
   ========================================================= */
let currentZoomType = null;

function openZoom(imageSrc, type, onSetup = null) {
  const overlay = document.getElementById("zoomOverlay");
  const img = document.getElementById("zoomImage");
  const hotspotsContainer = document.getElementById("zoomHotspots");
  if (!overlay || !img || !hotspotsContainer) return;

  currentZoomType = type;
  img.style.display = "block";
  img.style.opacity = "1";
  img.src = imageSrc;
  hotspotsContainer.innerHTML = "";

  if (typeof onSetup === "function") {
    onSetup(hotspotsContainer);
  } else if (type === "oyuk") {
    // a4 açıldığında diyalog gösterilir, zoom açık kalır
    setTimeout(() => {
      if (typeof showDialog !== "undefined") {
        showDialog([
          "Burada bir oyuk var...",
          "İçeride bir şey görüyorum ama elim yetişmiyor.",
          "Belki uzanabileceğim bir şey bulabilirim."
        ], "assets/yesil-iz-portrait.png", null, "konusma");
      }
    }, 200);
  } else if (type === "dolap_ici") {
    // a6 zoom: Cetvel henüz alınmamışsa göster
    const hasRuler = state.rulerTaken || (Array.isArray(state.inventory) && state.inventory.some(i => i.id === "cetvel"));
    if (!hasRuler) {
      const cetvelImg = document.createElement("img");
      cetvelImg.src = "assets/cetvel.png";
      cetvelImg.className = "zoom-item-cetvel";
      cetvelImg.alt = "Eski Cetvel";
      cetvelImg.title = "Cetveli Al";

      cetvelImg.addEventListener("click", (e) => {
        e.stopPropagation();

        const clingSound = new Audio('../assets/cling.mp3');
        if (state.sfx) clingSound.play().catch(() => { });

        cetvelImg.remove();

        if (!Array.isArray(state.inventory)) state.inventory = [];
        if (!state.inventory.find(i => i.id === "cetvel")) {
          state.inventory.unshift({ id: "cetvel", name: "Eski Cetvel", icon: "assets/cetvel_ikon.png" });
        }
        state.rulerTaken = true;
        save();

        if (typeof window.updateInventoryUI === "function") {
          window.updateInventoryUI();
        }

        setTimeout(() => {
          if (typeof showDialog !== "undefined") {
            showDialog([
              "Bir cetvel.",
              "İşe yarayabilir."
            ], "assets/yesil-iz-portrait.png", null, "konusma");
          }
        }, 200);
      });

      hotspotsContainer.appendChild(cetvelImg);
    }
  }

  overlay.classList.add("active");
}

function closeZoom() {
  const overlay = document.getElementById("zoomOverlay");
  if (!overlay) return;

  // Kâğıt incelenmeye başlandıysa açılma adımları bitene kadar dışarı tıklamayla kapatma devre dışı
  if (currentZoomType === "paper_inspection" && state.paperInspecting && !state.paperFullyOpened) {
    return;
  }

  const isLightPuzzleClosing = (currentZoomType === "paper_revealed" || currentZoomType === "window_light_puzzle") && state.paperLightPuzzleSolved;

  overlay.classList.remove("active");
  currentZoomType = null;

  // Oyuncu katli7.png'yi inceledikten sonra pencere dışına basınca zoom kapanır ve A14 sahnesi / Kod diyaloğu başlar
  if (isLightPuzzleClosing) {
    renderA14Scene();
  }
}

/* =========================================================
   VİDEO KESİTİ VE KATLI KÂĞIT İNCELEME SİSTEMİ
   ========================================================= */
function playFloorCutscene() {
  // Cetveli envanterden hemen kaldır ve seçimi sıfırla
  if (Array.isArray(state.inventory)) {
    state.inventory = state.inventory.filter(item => item.id !== "cetvel");
  }
  if (typeof selectedItem !== "undefined") {
    selectedItem = null;
  }
  window.selectedItem = null;
  state.rulerTaken = true;
  if (typeof window.updateInventoryUI === "function") {
    window.updateInventoryUI();
  }
  save();

  const videoOverlay = document.getElementById("videoOverlay");
  const video = document.getElementById("cutsceneVideo");
  if (!videoOverlay || !video) {
    // Fallback: doğrudan aç
    state.floorOpened = true;
    state.paperFound = true;
    save();
    openPaperZoom();
    return;
  }

  video.src = "assets/x.webm";
  videoOverlay.style.display = "flex";
  video.currentTime = 0;
  video.muted = !state.sound;

  video.play().catch(() => {
    // Autoplay fallback
    video.muted = true;
    video.play().catch(() => { });
  });

  video.onended = () => {
    videoOverlay.style.display = "none";
    state.floorOpened = true;
    state.paperFound = true;
    save();
    openPaperZoom();
  };
}

function openPaperZoom() {
  const overlay = document.getElementById("zoomOverlay");
  const img = document.getElementById("zoomImage");
  const hotspotsContainer = document.getElementById("zoomHotspots");
  if (!overlay || !img || !hotspotsContainer) return;

  currentZoomType = "paper_inspection";
  hotspotsContainer.innerHTML = "";

  const paperSteps = [
    "assets/katli.png",
    "assets/katli1.png",
    "assets/katli2.png",
    "assets/katli3.png"
  ];
  const maxStep = paperSteps.length - 1;

  if (!state.paperInspecting) {
    // 1. Durum: o1.png arkada gösterilir (kâğıt görselin içinde zaten mevcuttur)
    img.style.display = "block";
    img.style.opacity = "1";
    img.src = "assets/o1.png";

    const paperHotspot = document.createElement("div");
    paperHotspot.className = "scene-hotspot hotspot-paper-in-hole";
    paperHotspot.style.position = "absolute";
    paperHotspot.style.left = "50%";
    paperHotspot.style.top = "54%";
    paperHotspot.style.width = "18%";
    paperHotspot.style.height = "22%";
    paperHotspot.style.cursor = "pointer";
    paperHotspot.style.zIndex = "12";
    paperHotspot.title = "Kâğıdı İncele";

    paperHotspot.addEventListener("click", (e) => {
      e.stopPropagation();
      playClickSound();

      // Kâğıt alındı olarak işaretlenir
      state.paperTaken = true;
      state.paperInspecting = true;
      state.paperStep = 0;
      save();

      // Hotspotu ve o1.png görselini kaldır
      paperHotspot.remove();
      img.style.opacity = "0";

      // katli.png ancak tıklandığında oluşturulur ve merkezde yakınlaşarak (scale 0.6 -> 1) gösterilir
      const katliImg = document.createElement("img");
      katliImg.src = "assets/katli.png";
      katliImg.className = "paper-centered-inspect";
      katliImg.alt = "Katlı Kâğıt";
      katliImg.title = "Kâğıdı Aç";
      katliImg.style.transform = "translate(-50%, -50%) scale(0.6)";

      hotspotsContainer.appendChild(katliImg);

      setTimeout(() => {
        katliImg.style.transform = "translate(-50%, -50%) scale(1)";
      }, 20);

      setupPaperUnfolding(katliImg, paperSteps, maxStep);
    });

    hotspotsContainer.appendChild(paperHotspot);
  } else {
    // 2. Durum: Zaten kâğıt inceleniyor, doğrudan ortadaki kâğıt gösterilsin
    img.style.display = "block";
    img.style.opacity = "0"; // o1 arka planı gizli

    const step = Math.min(maxStep, Math.max(0, state.paperStep || 0));
    const katliImg = document.createElement("img");
    katliImg.src = paperSteps[step];
    katliImg.className = "paper-centered-inspect";
    if (state.paperFullyOpened || step === maxStep) {
      katliImg.classList.add("fully-opened");
    }
    katliImg.alt = "Katlı Kâğıt";

    hotspotsContainer.appendChild(katliImg);
    setupPaperUnfolding(katliImg, paperSteps, maxStep);
  }

  overlay.classList.add("active");
}

function setupPaperUnfolding(katliImg, paperSteps, maxStep) {
  katliImg.onclick = (e) => {
    e.stopPropagation();

    if (state.paperStep < maxStep) {
      playClickSound();
      state.paperStep++;

      // Hafif yumuşak geçiş animasyonu (200–350 ms)
      katliImg.classList.add("step-changing");
      setTimeout(() => {
        katliImg.src = paperSteps[state.paperStep];
        katliImg.classList.remove("step-changing");
      }, 150);

      if (state.paperStep === maxStep) {
        state.paperTaken = true;
        state.paperFullyOpened = true;
        state.episode1Stage = "a8";
        katliImg.classList.add("fully-opened");
        katliImg.onclick = null; // Başka tıklama gerekmez

        // 4. İpucu / Envanter paneline ekle
        if (!state.firstRiddleSolved) {
          if (!Array.isArray(state.inventory)) state.inventory = [];
          if (!state.inventory.some(i => i.id === "eski_not")) {
            state.inventory.unshift({
              id: "eski_not",
              name: "Eski Not",
              icon: "assets/katli3.png"
            });
            if (typeof window.updateInventoryUI === "function") {
              window.updateInventoryUI();
            }
            showToast("Eski Not envantere eklendi.");
          }
        }

        // 5. Kanıt Panosu'na (state.evidence) ekle - ana.html göreli yolu: 1/assets/...
        if (!Array.isArray(state.evidence)) state.evidence = [];
        if (!state.evidence.some(e => e.id === "evidence_01")) {
          state.evidence.push({
            id: "evidence_01",
            title: "Kantindeki Eski Not",
            image: "1/assets/katli3.png",
            episode: 1,
            location: "Okul Kantini – Eski Dolap",
            description: "Eski dolabın altındaki oyukta saklanmış katlı kâğıt.",
            date: new Date().toISOString()
          });
        }

        // 6. İz Defteri - Gözlem ekle
        addNotebookEntry("thoughts", {
          id: "ep1_note_paper_found",
          episode: 1,
          type: "observation",
          title: "Gözlem",
          text: "Eski dolabın altında saklanmış bir kâğıt buldum. Buraya tesadüfen düşmüş gibi görünmüyor."
        });

        save();

        // 300–500 ms kısa bekleme -> zoom otomatik kapanır -> doğrudan a8 sahnesi ve Yeşiliz konuşması başlar
        setTimeout(() => {
          const overlay = document.getElementById("zoomOverlay");
          if (overlay) overlay.classList.remove("active");
          currentZoomType = null;
          renderA8Scene();
        }, 400);
      } else {
        save();
      }
    }
  };
}

/* =========================================================
   A8 VE A9 HİKÂYE SAHNELERİ
   ========================================================= */
function renderA8Scene(initialIndex = 0) {
  const stage = document.querySelector("#roomStage");
  if (!stage) return;

  state.episode1Stage = "a8";
  save();

  const stepInd = document.querySelector("#stepIndicator");
  if (stepInd) stepInd.textContent = `SAHNE 4 / 4`;
  const prog = document.querySelector("#sceneProgress");
  if (prog) prog.style.width = `100%`;

  stage.innerHTML = `
    <div class="story-scene" id="scene_a8_stage" style="position:relative; width:100%; height:100%; background:black;">
      <img id="scene_a8_bg" src="assets/a8.png" alt="Yeşil-İz Kâğıdı İnceliyor" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; pointer-events:none;">
    </div>
  `;

  setTimeout(() => {
    if (typeof showDialog !== "undefined") {
      showDialog([
        { text: "Boş bir kağıt değilmiş...", portrait: "assets/yesil-iz-portrait.png" },
        { text: "Soluk bir yaprak deseni...", portrait: "assets/yesil-iz-portrait.png" }
      ], "assets/yesil-iz-portrait.png", () => {
        state.episode1DialogIndex = 0;
        renderA9Scene(0);
      }, "konusma", initialIndex);
    }
  }, 300);
}

function renderA9Scene(initialIndex = 0) {
  const stage = document.querySelector("#roomStage");
  if (!stage) return;

  state.episode1Stage = "a9";
  save();

  const stepInd = document.querySelector("#stepIndicator");
  if (stepInd) stepInd.textContent = `SAHNE 4 / 4`;
  const prog = document.querySelector("#sceneProgress");
  if (prog) prog.style.width = `100%`;

  const a9DialogSequence = [
    { text: "Onu nereden buldun?", portrait: "assets/kantinci.png", bg: "assets/a9.png" },
    { text: "Şurada... dolabın altındaki oyuktaydı.", portrait: "assets/yesil-iz-portrait.png", bg: "assets/a9.png" },
    { text: "Şu eski dolabın altında mı?", portrait: "assets/kantinci.png", bg: "assets/a9.png" },
    { text: "Eskiden üstünde büyük bir pano vardı. ", portrait: "assets/kantinci.png", bg: "assets/a10.png" },
    { text: "Öğrenciler duyurularını, notlarını, çizdikleri şeyleri... ne bulurlarsa oraya asarlardı.", portrait: "assets/kantinci.png", bg: "assets/a10.png" },
    { text: "Peki pano şimdi nerede?", portrait: "assets/yesil-iz-portrait.png", bg: "assets/a10.png" },
    { text: "Bir gün kaldırıldı.", portrait: "assets/kantinci.png", bg: "assets/a11.png" },
    { text: "Kim kaldırdı?", portrait: "assets/yesil-iz-portrait.png", bg: "assets/a11.png" },
    { text: "Bilmiyorum. Kimse pek sormadı. Bazı şeyler öyle sessizce kaybolur ki...", portrait: "assets/kantinci.png", bg: "assets/a12.png" },
    { text: "Yokluklarını ancak biri yeniden izlerini bulduğunda fark edersin.", portrait: "assets/kantinci.png", bg: "assets/a12.png" }
  ];

  const validIndex = Math.min(a9DialogSequence.length - 1, Math.max(0, initialIndex));
  const currentBg = (a9DialogSequence[validIndex] && a9DialogSequence[validIndex].bg) || "assets/a9.png";

  stage.innerHTML = `
    <div class="story-scene" id="scene_a9_stage" style="position:relative; width:100%; height:100%; background:black;">
      <img id="scene_a9_bg" src="${currentBg}" alt="Kantinci Sahnesi" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; pointer-events:none;">
    </div>
  `;

  setTimeout(() => {
    if (typeof showDialog !== "undefined") {
      showDialog(a9DialogSequence, null, () => {
        // A12 Kantinci konuşması biter -> İz Defteri Öğrendiğim kaydı eklenir
        addNotebookEntry("findings", {
          id: "ep1_note_canteen_board",
          episode: 1,
          type: "learned",
          title: "Öğrendiğim",
          text: "Eski dolabın üzerinde bir zamanlar öğrencilerin kullandığı bir pano varmış. Sonra pano sessizce ortadan kaldırılmış."
        });

        // Yeşiliz iç sesi devreye girer
        state.episode1DialogIndex = 0;
        showDialog([
          { text: "Bir dakika...", portrait: "assets/yesil-iz-portrait.png" },
          { text: "Kâğıdın arkasına hiç bakmadım.", portrait: "assets/yesil-iz-portrait.png" }
        ], "assets/yesil-iz-portrait.png", () => {
          openPaperFrontScene();
        }, "konusma");
      }, "konusma", validIndex);
    }
  }, 300);
}

/* =========================================================
   A12 SONRASI KÂĞIT ÖN / ARKA YÜZ VE PENCERE BULMACASI
   ========================================================= */
function openPaperFrontScene() {
  state.episode1Stage = "paper_front_after_canteen";
  save();

  const overlay = document.getElementById("zoomOverlay");
  const img = document.getElementById("zoomImage");
  const hotspotsContainer = document.getElementById("zoomHotspots");
  if (!overlay || !img || !hotspotsContainer) return;

  currentZoomType = "paper_front";
  hotspotsContainer.innerHTML = "";

  img.src = "assets/katli4.png";
  img.style.display = "block";
  overlay.classList.add("active");

  const katliImg = document.createElement("img");
  katliImg.src = "assets/katli4.png";
  katliImg.className = "paper-centered-inspect";
  katliImg.alt = "Katlı Kâğıt Ön Yüz";
  hotspotsContainer.appendChild(katliImg);

  // Oyuncu kâğıda tıklar -> katli6.png'ye çevrilir
  katliImg.onclick = () => {
    playClickSound();
    katliImg.onclick = null;
    katliImg.classList.add("flipping");
    setTimeout(() => {
      katliImg.src = "assets/katli6.png";
      img.src = "assets/katli6.png";
      katliImg.classList.remove("flipping");
      openPaperBackScene(true);
    }, 180);
  };
}

function openPaperBackScene(playDialog = false) {
  state.paperBackSeen = true;
  state.episode1Stage = "paper_back_faded";
  save();

  const overlay = document.getElementById("zoomOverlay");
  const img = document.getElementById("zoomImage");
  const hotspotsContainer = document.getElementById("zoomHotspots");
  if (!overlay || !img || !hotspotsContainer) return;

  currentZoomType = "paper_back";
  hotspotsContainer.innerHTML = "";

  img.src = "assets/katli6.png";
  img.style.display = "block";
  overlay.classList.add("active");

  const katliImg = document.createElement("img");
  katliImg.src = "assets/katli6.png";
  katliImg.className = "paper-centered-inspect";
  katliImg.alt = "Katlı Kâğıt Arka Yüz (Silik)";
  hotspotsContainer.appendChild(katliImg);

  if (playDialog) {
    setTimeout(() => {
      if (typeof showDialog !== "undefined") {
        showDialog([
          { text: "Burada bir şey yazıyor...", portrait: "assets/yesil-iz-portrait.png" },
          { text: "Ama mürekkep neredeyse tamamen solmuş.Okumanın bir yolunu bulmalıyım.", portrait: "assets/yesil-iz-portrait.png" }
        ], "assets/yesil-iz-portrait.png", () => {
          // Konuşma biter, zoom kapanır, a13.png sahnesine geçilir
          overlay.classList.remove("active");
          currentZoomType = null;
          renderA13Scene();
        }, "konusma");
      }
    }, 200);
  } else {
    // Resume durumu: zoom overlay tıklandığında A13'e geç
    overlay.onclick = () => {
      overlay.classList.remove("active");
      overlay.onclick = null;
      renderA13Scene();
    };
  }
}

function renderA13Scene() {
  const stage = document.querySelector("#roomStage");
  if (!stage) return;

  state.episode1Stage = state.paperLightPuzzleSolved ? "window_puzzle_solved" : "a13_window";
  save();

  const stepInd = document.querySelector("#stepIndicator");
  if (stepInd) stepInd.textContent = `SAHNE 4 / 4`;
  const prog = document.querySelector("#sceneProgress");
  if (prog) prog.style.width = `100%`;

  // Silik kâğıt (veya çözüldüyse ortaya çıkan kâğıt) envanterde yer alır
  if (!state.firstRiddleSolved) {
    if (!Array.isArray(state.inventory)) state.inventory = [];
    const existingNot = state.inventory.find(i => i.id === "eski_not");
    const currentIcon = state.paperLightPuzzleSolved ? "assets/katli7.png" : "assets/katli6.png";
    if (existingNot) {
      existingNot.icon = currentIcon;
    } else {
      state.inventory.unshift({
        id: "eski_not",
        name: "Eski Not",
        icon: currentIcon
      });
    }
    if (typeof window.updateInventoryUI === "function") window.updateInventoryUI();
  }

  stage.innerHTML = `
    <div class="story-scene" id="scene_a13_stage" style="position:relative; width:100%; height:100%; background:black;">
      <img id="scene_a13_bg" src="assets/a13.png" alt="Kantinde Pencere Kenarı" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; pointer-events:none;">
      <div id="scene_a13_hotspots" style="position:absolute; inset:0;"></div>
    </div>
  `;

  const hotspotsContainer = stage.querySelector("#scene_a13_hotspots");
  if (!hotspotsContainer) return;

  // Pencere Hotspotu (Görünmez cam alanı)
  const windowHotspot = document.createElement("div");
  windowHotspot.className = "scene-hotspot hotspot-pencere";
  windowHotspot.style.left = "5%";
  windowHotspot.style.top = "8%";
  windowHotspot.style.width = "40%";
  windowHotspot.style.height = "65%";
  windowHotspot.style.background = "transparent";
  windowHotspot.style.cursor = "pointer";

  windowHotspot.addEventListener("click", () => {
    if (state.paperLightPuzzleSolved) {
      // Zaten çözüldüyse pencere.png arkada, katli7.png ortada açılır
      const overlay = document.getElementById("zoomOverlay");
      const img = document.getElementById("zoomImage");
      const hotspotsContainer = document.getElementById("zoomHotspots");
      if (!overlay || !img || !hotspotsContainer) return;

      currentZoomType = "paper_revealed";
      hotspotsContainer.innerHTML = "";
      img.src = "assets/pencere.png";
      img.style.display = "block";
      img.style.opacity = "1";
      overlay.classList.add("active");

      const paperImg = document.createElement("img");
      paperImg.src = "assets/katli7.png";
      paperImg.className = "paper-centered-inspect";
      paperImg.alt = "Kâğıt Işığa Tutuldu";
      hotspotsContainer.appendChild(paperImg);
      return;
    }

    const isPaperSelected = (window.selectedItem && (window.selectedItem.id === "eski_not" || (window.selectedItem.icon && window.selectedItem.icon.includes("katli")))) ||
      (typeof selectedItem !== "undefined" && selectedItem && (selectedItem.id === "eski_not" || (selectedItem.icon && selectedItem.icon.includes("katli"))));

    if (isPaperSelected) {
      // Seçili nesneyi temizle
      if (typeof selectedItem !== "undefined") selectedItem = null;
      window.selectedItem = null;
      if (typeof window.updateInventoryUI === "function") window.updateInventoryUI();

      playWindowLightPuzzle();
    }
  });

  hotspotsContainer.appendChild(windowHotspot);
}

function playWindowLightPuzzle() {
  const overlay = document.getElementById("zoomOverlay");
  const img = document.getElementById("zoomImage");
  const hotspotsContainer = document.getElementById("zoomHotspots");
  if (!overlay || !img || !hotspotsContainer) return;

  currentZoomType = "paper_revealed";
  hotspotsContainer.innerHTML = "";

  // Arka planda pencere.png -> cerceve.png içinde sırayla değişen kâğıt kareleri
  const frames = [
    "assets/katli6.png",
    "assets/katli00.png",
    "assets/katli01.png",
    "assets/katli02.png",
    "assets/katli03.png",
    "assets/katli7.png"
  ];

  // Görselleri önceden belleğe yükle
  frames.forEach(src => {
    const preloadImg = new Image();
    preloadImg.src = src;
  });

  img.src = "assets/pencere.png";
  img.style.display = "block";
  img.style.opacity = "1";
  overlay.classList.add("active");

  const paperImg = document.createElement("img");
  paperImg.src = frames[0];
  paperImg.className = "paper-centered-inspect";
  paperImg.alt = "Kâğıt Işığa Tutuluyor";
  hotspotsContainer.appendChild(paperImg);

  // 1 saniye aralıklarla kareleri değiştir
  let currentFrameIdx = 0;
  const frameInterval = setInterval(() => {
    currentFrameIdx++;
    if (currentFrameIdx < frames.length) {
      paperImg.src = frames[currentFrameIdx];
    }

    // katli7.png (son kare) ulaşıldığında animasyon durur ve sabit kalır
    if (currentFrameIdx >= frames.length - 1) {
      clearInterval(frameInterval);

      // State ve veri güncellemeleri
      state.paperBackSeen = true;
      state.paperLightPuzzleSolved = true;
      state.paperMessageRevealed = true;
      state.episode1Stage = "window_puzzle_solved";

      // Envanter güncelle: katli7.png
      const notItem = state.inventory.find(i => i.id === "eski_not");
      if (notItem) notItem.icon = "assets/katli7.png";
      if (typeof window.updateInventoryUI === "function") window.updateInventoryUI();

      // Kanıt Panosu güncelle: 1/assets/katli7.png
      if (Array.isArray(state.evidence)) {
        const ev = state.evidence.find(e => e.id === "evidence_01");
        if (ev) {
          ev.image = "1/assets/katli7.png";
          ev.description = "Güneş ışığında ortaya çıkan gizli mesaj: 'Sessizliğin en çok konuştuğu yerde ara.'";
        }
      }

      // 4. İz Defteri - Çözülmemiş İpucu ekle (Kütüphane henüz yazılmaz)
      addNotebookEntry("thoughts", {
        id: "ep1_note_paper_riddle",
        episode: 1,
        type: "clue",
        title: "Çözülmemiş İpucu",
        text: "“Sessizliğin en çok konuştuğu yerde ara.”",
        solved: false
      });

      save();

      // katli7.png (son kare) ekranda sabit kalır. Otomatik kapanmaz;
      // Oyuncu zoom penceresi dışına (veya kâğıda) basınca closeZoom() tetiklenir, zoom kapanır ve A14 Kod diyaloğu başlar.
      paperImg.style.cursor = "pointer";
      paperImg.addEventListener("click", () => {
        closeZoom();
      });
    }
  }, 1000);
}

function renderA14Scene(initialIndex = 0) {
  const stage = document.querySelector("#roomStage");
  if (!stage) return;

  state.episode1Stage = "a14";
  save();

  const stepInd = document.querySelector("#stepIndicator");
  if (stepInd) stepInd.textContent = `SAHNE 4 / 4`;
  const prog = document.querySelector("#sceneProgress");
  if (prog) prog.style.width = `100%`;

  // Kod ve Yeşil-İz diyaloğu otomatik başlar
  const kodDialogSequence = [
    { text: "Hey, bunu nereden buldun? Bu bir el yazısı şifresi gibi duruyor...", portrait: "assets/kod.png", bg: "assets/a14.png" },
    { text: "Ama daha ilginç olan, kâğıdın kenarındaki bu küçük numara. Bak, ‘01’ yazıyor.", portrait: "assets/kod.png", bg: "assets/a15.png" },
    { text: "Sanki bir seri gibi.", portrait: "assets/kod.png", bg: "assets/a15.png" },
    { text: "Bir seri... Yani bu, tek bir not değil. Bir dizinin ilk parçası olabilir.", portrait: "assets/yesil-iz-portrait.png", bg: "assets/a16.png" },
    { text: "Peki ilk ipucunun cevabı ne?", portrait: "assets/yesil-iz-portrait.png", bg: "assets/a16.png" }
  ];

  const validIndex = Math.min(kodDialogSequence.length - 1, Math.max(0, initialIndex));
  const currentBg = (kodDialogSequence[validIndex] && kodDialogSequence[validIndex].bg) || "assets/a14.png";

  // Eski a13 pencere hotspotları tamamen temizlenir, a14.png tam ekran sahne olarak çizilir
  stage.innerHTML = `
    <div class="story-scene" id="scene_a14_stage" style="position:relative; width:100%; height:100%; background:black;">
      <img id="scene_a14_bg" src="${currentBg}" alt="Kod ve Yeşil-İz Sahnesi" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; pointer-events:none;">
    </div>
  `;

  setTimeout(() => {
    if (typeof showDialog !== "undefined") {
      showDialog(kodDialogSequence, null, () => {
        // 3. İz Defteri - Açık Soru ekle (01 seri numarası)
        addNotebookEntry("questions", {
          id: "ep1_note_01_question",
          episode: 1,
          type: "question",
          title: "Açık Soru",
          question: "01 bir seri numarasıysa, devamı nerede?",
          status: "open"
        });

        // Konuşma biter, diyalog kapanır, şifre/cevap giriş modalı açılır
        openRiddleModal();
      }, "konusma", validIndex);
    }
  }, 250);
}

function openRiddleModal() {
  const overlay = document.getElementById("riddleOverlay");
  const input = document.getElementById("riddleInput");
  const form = document.getElementById("riddleForm");
  const error = document.getElementById("riddleError");
  if (!overlay || !input || !form) return;

  error.textContent = "";
  input.value = "";
  overlay.classList.add("active");
  setTimeout(() => input.focus(), 150);

  form.onsubmit = (e) => {
    e.preventDefault();
    const rawVal = input.value || "";
    const clean = rawVal.trim().toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g');

    if (clean === "kutuphane") {
      // Doğru cevap!
      playClickSound();
      overlay.classList.remove("active");
      form.onsubmit = null;

      // 1. Eski Not'u ipucu/envanter penceresinden kaldır
      if (Array.isArray(state.inventory)) {
        state.inventory = state.inventory.filter(i => i.id !== "eski_not");
      }
      if (typeof window.selectedItem !== "undefined" && window.selectedItem && window.selectedItem.id === "eski_not") {
        window.selectedItem = null;
      }
      if (typeof selectedItem !== "undefined" && selectedItem && selectedItem.id === "eski_not") {
        selectedItem = null;
      }
      if (typeof window.updateInventoryUI === "function") {
        window.updateInventoryUI();
      }

      // 2. Kanıt Panosu'ndaki kaydı SİLME; kalıcı kanıt olarak güncelle
      if (!Array.isArray(state.evidence)) state.evidence = [];
      const evIndex = state.evidence.findIndex(e => e.id === "evidence_01");
      const evData = {
        id: "evidence_01",
        title: "Eski Not",
        category: "clue",
        episode: 1,
        image: "1/assets/katli7.png",
        description: "Güneş ışığında ortaya çıkan gizli mesaj: 'Sessizliğin en çok konuştuğu yerde ara.'",
        status: "solved"
      };
      if (evIndex >= 0) {
        state.evidence[evIndex] = { ...state.evidence[evIndex], ...evData };
      } else {
        state.evidence.push(evData);
      }

      // 3. İz Defteri'ndeki çözülmemiş ipucunu güncelle (çoğaltma yapmadan)
      addNotebookEntry("thoughts", {
        id: "ep1_note_paper_riddle",
        episode: 1,
        type: "clue",
        title: "ÇÖZÜLEN İPUCU",
        text: "“Sessizliğin en çok konuştuğu yerde ara.”\n\nÇözüm: Kütüphane",
        solved: true
      });
      addNotebookEntry("findings", {
        id: "ep1_note_next_trace",
        episode: 1,
        type: "next_trace",
        title: "Sonraki İz",
        text: "Soruşturma kütüphanede devam ediyor."
      });

      // State kaydet
      state.firstRiddleSolved = true;
      state.episode1Stage = "first_riddle_solved";
      if (!Array.isArray(state.completed)) state.completed = [];
      if (!state.completed.includes(1)) {
        state.completed.push(1);
      }
      save();

      // 4. Final Diyaloğu ve ardından kapanis.mp4 -> Bölüm 1 Tamamlandı Ekranı
      setTimeout(() => {
        if (typeof showDialog !== "undefined") {
          showDialog([
            { text: "Kütüphane...", portrait: "assets/yesil-iz-portrait.png" },
            { text: "Demek sıradaki iz orada.", portrait: "assets/kod.png" }
          ], "assets/yesil-iz-portrait.png", () => {
            // Konuşma bittiğinde önce kapanis.mp4 oynatılır, video tamamlandığında Bölüm 1 Tamamlandı ekranı açılır
            playClosingCutscene(() => {
              renderCompletionScene();
            });
          }, "konusma");
        }
      }, 300);
    } else {
      // Yanlış cevap
      if (!clean) {
        error.textContent = "Lütfen bir cevap yazın.";
      } else {
        error.textContent = "Bu cevap ipucuyla uyuşmuyor.";
      }
      input.focus();
    }
  };
}

function playClosingCutscene(onComplete) {
  // kapanis.mp4 oynatılacağı zaman gizem.mp3 / gizem2.mp3 ve tüm arka plan müzikleri durdurulur
  const allAudios = document.querySelectorAll("audio");
  allAudios.forEach(a => {
    try {
      a.pause();
    } catch(e) {}
  });

  const ambientMusic = document.querySelector("#ambientMusic");
  if (ambientMusic) {
    try {
      ambientMusic.pause();
    } catch(e) {}
  }

  const videoOverlay = document.getElementById("videoOverlay");
  const video = document.getElementById("cutsceneVideo");
  if (!videoOverlay || !video) {
    if (typeof onComplete === "function") onComplete();
    return;
  }

  video.src = "assets/kapanis.mp4";
  videoOverlay.style.display = "flex";
  video.currentTime = 0;
  video.muted = !state.sound;

  video.play().catch(() => {
    video.muted = true;
    video.play().catch(() => { });
  });

  video.onended = () => {
    videoOverlay.style.display = "none";
    state.episode1Stage = "episode1_completed";
    state.firstRiddleSolved = true;
    if (!Array.isArray(state.completed)) state.completed = [];
    if (!state.completed.includes(1)) state.completed.push(1);
    if (Array.isArray(state.inventory)) {
      state.inventory = state.inventory.filter(i => i.id !== "eski_not");
    }
    save();
    sessionStorage.setItem("justCompleted1", "true");
    window.location.href = "../ana.html#completed1";
  };
}

function renderCompletionScene() {
  state.episode1Stage = "episode1_completed";
  state.firstRiddleSolved = true;
  if (!Array.isArray(state.completed)) state.completed = [];
  if (!state.completed.includes(1)) state.completed.push(1);
  if (Array.isArray(state.inventory)) {
    state.inventory = state.inventory.filter(i => i.id !== "eski_not");
  }
  save();
  sessionStorage.setItem("justCompleted1", "true");
  window.location.href = "../ana.html#completed1";
}

/* =========================================================
   ANA OYUN VE SAHNE YÖNETİMİ
   ========================================================= */
function playDolapSound() {
  if (!state.sfx) return;
  const ds = document.getElementById("dolapSound");
  if (ds) {
    ds.currentTime = 0;
    ds.play().catch(() => {
      const snd = new Audio("assets/dolap.mp3");
      snd.play().catch(() => { });
    });
  } else {
    const snd = new Audio("assets/dolap.mp3");
    snd.play().catch(() => { });
  }
}

function renderMainScene() {
  const stage = document.querySelector("#roomStage");
  if (!stage) return;

  state.episode1Stage = "exploration";
  save();

  const stepInd = document.querySelector("#stepIndicator");
  if (stepInd) stepInd.textContent = `SAHNE 3 / 4`;
  const prog = document.querySelector("#sceneProgress");
  if (prog) prog.style.width = `75%`;

  const bgSrc = state.lockerOpen ? "assets/a5.png" : "assets/a3.png";

  stage.innerHTML = `
    <div class="story-scene" id="main_exploration_stage" style="position:relative; width:100%; height:100%; background:black;">
      <img id="main_scene_bg" src="${bgSrc}" alt="Arkaplan" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; pointer-events:none;">
      <div id="main_scene_hotspots" style="position:absolute; inset:0;"></div>
    </div>
  `;

  const hotspotsContainer = stage.querySelector("#main_scene_hotspots");
  if (!hotspotsContainer) return;

  // A. Oyuk Hotspotu (Her iki sahnede de: a3 ve a5)
  const oyukHotspot = document.createElement("div");
  oyukHotspot.className = "scene-hotspot hotspot-oyuk";
  oyukHotspot.style.left = "66.5%";
  oyukHotspot.style.top = "88.5%";
  oyukHotspot.style.width = "9.5%";
  oyukHotspot.style.height = "9.5%";
  oyukHotspot.title = "Oyuğu İncele";

  oyukHotspot.addEventListener("click", () => {
    const isRulerSelected = (window.selectedItem && window.selectedItem.id === "cetvel") ||
      (typeof selectedItem !== "undefined" && selectedItem && selectedItem.id === "cetvel");

    if (!state.floorOpened) {
      if (isRulerSelected) {
        playFloorCutscene();
      } else {
        openZoom("assets/a4.png", "oyuk");
      }
    } else {
      // floorOpened === true: Tahta açılmış
      if (!state.paperTaken) {
        // Tahta açıldı + kâğıt alınmadı -> o1.png
        openPaperZoom();
      } else {
        // Tahta açıldı + kâğıt alındı -> o2.png (boş oyuk)
        openZoom("assets/o2.png", "empty_hole");
      }
    }
  });
  hotspotsContainer.appendChild(oyukHotspot);

  if (!state.lockerOpen) {
    // B. Dolap Hotspotu (Dolap kapalıyken - a3.png)
    const dolapHotspot = document.createElement("div");
    dolapHotspot.className = "scene-hotspot hotspot-dolap";
    dolapHotspot.style.left = "70.5%";
    dolapHotspot.style.top = "18%";
    dolapHotspot.style.width = "10%";
    dolapHotspot.style.height = "60%";
    dolapHotspot.title = "Dolabı Aç";

    dolapHotspot.addEventListener("click", () => {
      playDolapSound();
      state.lockerOpen = true;
      save();
      renderMainScene();
    });
    hotspotsContainer.appendChild(dolapHotspot);
  } else {
    // Dolap Açıkken - a5.png:
    // B. Dolabın İç Kısmı Hotspotu (a6 zoom açar)
    const dolapIciHotspot = document.createElement("div");
    dolapIciHotspot.className = "scene-hotspot hotspot-dolap-ici";
    dolapIciHotspot.style.left = "71%";
    dolapIciHotspot.style.top = "18%";
    dolapIciHotspot.style.width = "9.5%";
    dolapIciHotspot.style.height = "60%";
    dolapIciHotspot.title = "Dolabın İçini İncele";

    dolapIciHotspot.addEventListener("click", () => {
      openZoom("assets/a6.png", "dolap_ici");
    });
    hotspotsContainer.appendChild(dolapIciHotspot);

    // C. Açık Dolap Kapağı Hotspotu (Dolabı kapatır)
    const dolapKapakHotspot = document.createElement("div");
    dolapKapakHotspot.className = "scene-hotspot hotspot-dolap-kapak";
    dolapKapakHotspot.style.left = "61.5%";
    dolapKapakHotspot.style.top = "18%";
    dolapKapakHotspot.style.width = "9%";
    dolapKapakHotspot.style.height = "60%";
    dolapKapakHotspot.title = "Dolabı Kapat";

    dolapKapakHotspot.addEventListener("click", () => {
      playDolapSound();
      state.lockerOpen = false;
      save();
      renderMainScene();
    });
    hotspotsContainer.appendChild(dolapKapakHotspot);
  }
}

function renderEpisode() {
  const stage = document.querySelector("#roomStage");
  if (!stage) return;

  // Çözüldüyse Eski Not envanterden kalıcı olarak temiz kalır
  if (state.firstRiddleSolved && Array.isArray(state.inventory)) {
    state.inventory = state.inventory.filter(i => i.id !== "eski_not");
  }

  // Kaydedilmiş aşamadan kaldığı yerden devam etme kontrolü
  const savedStage = state.episode1Stage;

  if (savedStage === "episode1_completed" || savedStage === "first_riddle_solved") {
    renderCompletionScene();
    return;
  }
  if (savedStage === "a14") {
    renderA14Scene(state.episode1DialogIndex || 0);
    return;
  }
  if (savedStage === "window_puzzle_solved" || state.paperLightPuzzleSolved) {
    renderA14Scene();
    return;
  }
  if (savedStage === "a13_window") {
    renderA13Scene();
    return;
  }
  if (savedStage === "paper_back_faded") {
    openPaperBackScene(false);
    return;
  }
  if (savedStage === "paper_front_after_canteen") {
    openPaperFrontScene();
    return;
  }
  if (savedStage === "a9") {
    renderA9Scene(state.episode1DialogIndex || 0);
    return;
  }
  if (savedStage === "a8" || state.paperFullyOpened) {
    renderA8Scene(state.episode1DialogIndex || 0);
    return;
  }
  if (savedStage === "exploration" || state.floorOpened || state.lockerOpen || state.rulerTaken || state.paperFound) {
    state.episode1Stage = "exploration";
    save();
    scene = 2;
    renderMainScene();
    return;
  }
  if (savedStage === "intro2") {
    scene = 1;
  } else {
    scene = 0;
  }

  const stepInd = document.querySelector("#stepIndicator");
  if (stepInd) stepInd.textContent = `SAHNE ${scene + 1} / 4`;
  const prog = document.querySelector("#sceneProgress");
  if (prog) prog.style.width = `${(scene + 1) * 25}%`;

  if (scene === 0) {
    state.episode1Stage = "intro1";
    save();

    stage.innerHTML = `
      <div class="story-scene" style="position:relative; width:100%; height:100%; background:black;">
        <img src="assets/a1.png" alt="Arkaplan" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
      </div>
    `;

    setTimeout(() => {
      if (typeof showDialog !== "undefined") {
        showDialog([
          "Zil çalar çalmaz kantin her zamanki gürültüsüne kavuşmuştu.",
          "Masalara bırakılan tepsiler, telaşlı kahkahalar ve ayaküstü sohbetler...",
          "Yeşil-İz ise pencere kenarındaki yerinde, defterine bir şeyler karalayıp etrafı izliyor, kimsenin fark etmediği detayları yakalıyordu."
        ], null, () => {
          scene = 1;
          state.episode1Stage = "intro2";
          save();
          renderEpisode();
        }, "metin");
      }
    }, 300);
  }

  if (scene === 1) {
    state.episode1Stage = "intro2";
    save();

    stage.innerHTML = `
      <div class="story-scene" style="position:relative; width:100%; height:100%; background:black;">
        <img src="assets/a2.png" alt="Arkaplan" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
      </div>
    `;

    setTimeout(() => {
      if (typeof showDialog !== "undefined") {
        showDialog([
          "Kantinin köşesindeki o eski, tozlu dolabın önünden geçerken birden duraksadı.",
          "Ayakkabısının tabanında hafif bir oynama ve ardından bir tıkırtı hissetti.",
          "Kalabalıkta kimsenin duymayacağı ama onun dikkatinden kaçmayan bir ses..."
        ], null, () => {
          showDialog([
            "Bu ses tanıdık değil. Zemin burada hep düz olurdu."
          ], "assets/yesil-iz-portrait.png", () => {
            scene = 2;
            state.episode1Stage = "exploration";
            save();
            renderEpisode();
          }, "konusma");
        }, "metin");
      }
    }, 300);
  }

  if (scene === 2) {
    state.episode1Stage = "exploration";
    save();
    renderMainScene();
  }

  // Navigation button binding fallback
  stage.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => {
    save();
    if (button.dataset.go === "notebook") {
      window.location.href = "../ana.html#notebook";
    } else {
      window.location.href = "../ana.html#board";
    }
  }));
}

/* =========================================================
   KONTROLLER VE EVENT LISTENERS
   ========================================================= */
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
  const video = document.getElementById("cutsceneVideo");
  if (video) video.muted = !state.sound;
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

const sfxBtn = document.querySelector("#sfxToggle");
if (sfxBtn) {
  sfxBtn.addEventListener("click", () => {
    state.sfx = !state.sfx;
    updateChrome();
    save();
  });
}

document.addEventListener("click", (e) => {
  if (!state.sfx) return;
  if (e.target.closest(".hotspot-dolap") || e.target.closest(".hotspot-dolap-kapak")) return;
  const isClickable = e.target.closest('button') || e.target.closest('a') || (window.getComputedStyle(e.target).cursor === 'pointer');
  if (isClickable) {
    const cs = document.getElementById('clickSound');
    if (cs) {
      cs.currentTime = 0;
      cs.play().catch(() => { });
    }
  }
});

// Zoom modal dışarı tıklama ve ESC kontrolü
document.addEventListener("DOMContentLoaded", () => {
  const zoomOverlay = document.getElementById("zoomOverlay");
  const zoomContainer = document.getElementById("zoomContainer");

  if (zoomOverlay) {
    zoomOverlay.addEventListener("click", (e) => {
      if (e.target === zoomOverlay) {
        closeZoom();
      }
    });
  }

  if (zoomContainer) {
    zoomContainer.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeZoom();
    }
  });

  if (typeof window.updateInventoryUI === "function") {
    window.updateInventoryUI();
  }

  renderEpisode();
});
