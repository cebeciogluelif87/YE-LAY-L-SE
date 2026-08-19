const ambientMusic = document.querySelector("#ambientMusic");
const gameMusic = document.querySelector("#gameMusic");

function updateMusic() {
  if (!state.sound) {
    if (ambientMusic) ambientMusic.pause();
    if (gameMusic) gameMusic.pause();
    return;
  }
  
  const frameContainer = document.getElementById("gameIframeContainer");
  const inGame = frameContainer && frameContainer.style.display === "block";
  
  if (inGame) {
    if (ambientMusic) ambientMusic.pause();
    if (gameMusic) gameMusic.play().catch(() => {});
  } else {
    if (gameMusic) gameMusic.pause();
    if (ambientMusic) ambientMusic.play().catch(() => {});
  }
}

function startAmbientMusic() {
  updateMusic();
}

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

const defaultState = {
  completed: [],
  evidence: [], // Somut Kanıtlar: [{ id, episode, title, location, image, description, date }]
  notebook: {
    thoughts: [],  // Düşünceler / Notlar: [{ id, episode, title, text, date }]
    findings: [],  // Öğrenilenler: [{ id, episode, title, text, date }]
    questions: []  // Açık Sorular: [{ id, episode, question, status, answer, date }]
  },
  questions: [], // Geriye dönük uyumluluk
  inventory: [], // Bölüm içi geçici nesneler
  invScrollIndex: 0,
  lastSave: null,
  activeAct: 0,
  sound: true,
  sfx: true,
  episode1Stage: null,
  episode1DialogIndex: 0,
  lockerOpen: false,
  rulerTaken: false,
  floorOpened: false,
  paperFound: false,
  paperTaken: false,
  paperInspecting: false,
  paperStep: 0,
  paperFullyOpened: false
};

let state;
try {
  state = { ...defaultState, ...JSON.parse(localStorage.getItem("yesiliz-state") || "{}") };
} catch {
  state = { ...defaultState };
}

// Veri yapısı normalizasyonu
if (!state.notebook || typeof state.notebook !== "object") {
  state.notebook = {
    thoughts: [],
    findings: [],
    questions: Array.isArray(state.questions) ? [...state.questions] : []
  };
}
if (!Array.isArray(state.notebook.thoughts)) state.notebook.thoughts = [];
if (!Array.isArray(state.notebook.findings)) state.notebook.findings = [];
if (!Array.isArray(state.notebook.questions)) state.notebook.questions = [];
if (!Array.isArray(state.evidence)) state.evidence = [];

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
    } catch {}
  }
}

const view = document.querySelector("#view");
const toast = document.querySelector("#toast");

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
  document.querySelectorAll("[data-start]").forEach(button => button.addEventListener("click", () => startEpisode(1)));
}

function navigate(target) {
  if (target === "home") { updateMusic(); renderHome(); }
  if (target === "board") renderBoard();
  if (target === "notebook") renderNotebook();
}

function renderHome() {
  render("#homeTemplate");
  const ls = document.querySelector("#lastSave");
  if (ls) ls.textContent = stampDate(state.lastSave);
  const action = document.querySelector(".next-case-copy b");
  if (action && state.completed.includes(1)) action.textContent = "Bölüm 1 — Tamamlandı";
}

/* =========================================================
   KANIT PANOSU – SOMUT ARAŞTIRMA ARŞİVİ
   ========================================================= */
let currentBoardMode = "archive"; // "archive" veya "episodes"

function renderBoard() {
  render("#boardTemplate");

  const btnArchive = document.querySelector("#btnEvidenceArchive");
  const btnEpisodes = document.querySelector("#btnEpisodeMap");
  const countBadge = document.querySelector("#boardEvidenceCount");
  const actTabsBar = document.querySelector("#actTabsBar");
  const archiveGrid = document.querySelector("#evidenceArchiveGrid");
  const episodeGrid = document.querySelector("#episodeCardsGrid");
  const sideNote = document.querySelector("#boardSideNote");

  if (countBadge) countBadge.textContent = `(${state.evidence.length})`;

  if (btnArchive && btnEpisodes) {
    btnArchive.onclick = () => {
      currentBoardMode = "archive";
      btnArchive.classList.add("active");
      btnEpisodes.classList.remove("active");
      switchBoardView();
    };
    btnEpisodes.onclick = () => {
      currentBoardMode = "episodes";
      btnEpisodes.classList.add("active");
      btnArchive.classList.remove("active");
      switchBoardView();
    };
  }

  function switchBoardView() {
    if (currentBoardMode === "archive") {
      if (actTabsBar) actTabsBar.style.display = "none";
      if (episodeGrid) episodeGrid.style.display = "none";
      if (sideNote) sideNote.style.display = "none";
      if (archiveGrid) {
        archiveGrid.style.display = "grid";
        renderEvidenceArchive(archiveGrid);
      }
    } else {
      if (archiveGrid) archiveGrid.style.display = "none";
      if (actTabsBar) {
        actTabsBar.style.display = "flex";
        renderActTabs(actTabsBar);
      }
      if (episodeGrid) {
        episodeGrid.style.display = "grid";
        renderEpisodeGrid(episodeGrid);
      }
      if (sideNote) sideNote.style.display = "block";
    }
  }

  switchBoardView();
}

function renderEvidenceArchive(container) {
  if (!container) return;

  if (!state.evidence || state.evidence.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div>
          <i></i>
          <h3>Henüz somut bir kanıt bulunamadı.</h3>
          <p>Bölüm araştırmalarını tamamladıkça bulunan belgeler, fotoğraflar ve önemli izler burada arşivlenecektir.</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = state.evidence.map((item) => `
    <article class="evidence-card-box" data-evidence-id="${item.id}">
      <div class="evidence-thumb-frame">
        <img src="${item.image}" alt="${item.title}">
        <span class="evidence-badge">BÖLÜM ${String(item.episode || 1).padStart(2, "0")}</span>
      </div>
      <div class="evidence-box-details">
        <small class="evidence-box-loc">${item.location || 'OKUL KANTİNİ'}</small>
        <h4 class="evidence-box-title">${item.title}</h4>
        <p class="evidence-box-desc">${item.description || ''}</p>
      </div>
      <span class="evidence-zoom-hint">Büyütmek için tıkla 🔍</span>
    </article>
  `).join("");

  container.querySelectorAll(".evidence-card-box").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.evidenceId;
      const found = state.evidence.find(e => e.id === id);
      if (found && found.image) {
        openFramedZoom(found.image, found.title);
      }
    });
  });
}

function renderActTabs(tabsContainer) {
  tabsContainer.innerHTML = "";
  acts.forEach((act, index) => {
    const button = document.createElement("button");
    button.textContent = act.name;
    button.className = index === state.activeAct ? "active" : "";
    button.addEventListener("click", () => {
      state.activeAct = index;
      save();
      const episodeGrid = document.querySelector("#episodeCardsGrid");
      renderActTabs(tabsContainer);
      if (episodeGrid) renderEpisodeGrid(episodeGrid);
    });
    tabsContainer.append(button);
  });
}

function renderEpisodeGrid(grid) {
  grid.innerHTML = "";
  const [start, end] = acts[state.activeAct].range;
  for (let number = start; number <= end; number++) {
    const complete = state.completed.includes(number);
    const unlocked = number === 1 || state.completed.includes(number - 1);
    const card = document.createElement("button");
    card.className = `episode-card ${complete ? "complete" : ""} ${unlocked && !complete ? "current" : ""}`;
    card.style.setProperty("--tilt", `${((number % 5) - 2) * 0.8}deg`);
    card.disabled = !unlocked;
    card.innerHTML = `
      <span class="number">${String(number).padStart(2, "0")}</span>
      ${complete ? `<b>${episodeNames[number - 1]}</b>` : ""}
      <small>${complete ? "TAMAMLANDI" : unlocked ? "İNCELEMEYE HAZIR" : "KİLİTLİ DOSYA"}</small>
    `;
    if (number === 1) card.addEventListener("click", () => startEpisode(1));
    else if (number === 2 && unlocked) card.addEventListener("click", () => startEpisode(2));
    else if (unlocked) card.addEventListener("click", () => showToast(`Bu prototipte şu an 1. ve 2. bölüm oynanabilir.`));
    grid.append(card);
  }
}

/* =========================================================
   İZ DEFTERİ – YEŞİL-İZ'İN KİŞİSEL ARAŞTIRMA GÜNLÜĞÜ
   ========================================================= */
let currentNotebookTab = "thoughts"; // "thoughts", "findings", "questions"

function renderNotebook(tab = currentNotebookTab) {
  render("#notebookTemplate");
  currentNotebookTab = tab;

  const tc = document.querySelector("#thoughtsCount");
  if (tc) tc.textContent = (state.notebook && state.notebook.thoughts) ? state.notebook.thoughts.length : 0;

  const fc = document.querySelector("#findingsCount");
  if (fc) fc.textContent = (state.notebook && state.notebook.findings) ? state.notebook.findings.length : 0;

  const qc = document.querySelector("#questionsCount");
  if (qc) qc.textContent = (state.notebook && state.notebook.questions) ? state.notebook.questions.length : 0;

  document.querySelectorAll("[data-note-tab]").forEach(button => {
    button.classList.toggle("active", button.dataset.noteTab === tab);
    button.addEventListener("click", () => {
      currentNotebookTab = button.dataset.noteTab;
      renderNotebook(currentNotebookTab);
    });
  });

  renderNotebookContent(tab);
}

function renderNotebookContent(tab) {
  const content = document.querySelector("#notebookContent");
  if (!content) return;

  const thoughts = (state.notebook && state.notebook.thoughts) ? state.notebook.thoughts : [];
  const findings = (state.notebook && state.notebook.findings) ? state.notebook.findings : [];
  const questions = (state.notebook && state.notebook.questions) ? state.notebook.questions : [];

  if (tab === "thoughts") {
    if (!thoughts.length) {
      content.innerHTML = `
        <div class="empty-state">
          <div>
            <i></i>
            <h3>Düşünce kaydı henüz yok.</h3>
            <p>Yeşil-İz'in vaka boyunca çıkardığı kişisel notlar ve şüpheler burada birikir.</p>
          </div>
        </div>
      `;
      return;
    }
    content.innerHTML = `
      <div class="journal-list">
        ${thoughts.map((item, i) => `
          <article class="journal-item">
            <div class="journal-item-header">
              <span class="journal-tag">NOT #${String(i + 1).padStart(2, "0")} · BÖLÜM ${String(item.episode || 1).padStart(2, "0")}</span>
              ${item.date ? `<time class="journal-date">${stampDate(item.date)}</time>` : ''}
            </div>
            <h3 class="journal-title">${item.title}</h3>
            <p class="journal-text">“${item.text}”</p>
          </article>
        `).join("")}
      </div>
    `;
  } else if (tab === "findings") {
    if (!findings.length) {
      content.innerHTML = `
        <div class="empty-state">
          <div>
            <i></i>
            <h3>Öğrenilen bilgi henüz yok.</h3>
            <p>Karakterlerle konuşmalardan veya araştırmalardan elde edilen önemli hikâye bilgileri burada toplanır.</p>
          </div>
        </div>
      `;
      return;
    }
    content.innerHTML = `
      <div class="journal-list">
        ${findings.map((item, i) => `
          <article class="journal-item">
            <div class="journal-item-header">
              <span class="journal-tag">BİLGİ #${String(i + 1).padStart(2, "0")} · BÖLÜM ${String(item.episode || 1).padStart(2, "0")}</span>
              ${item.date ? `<time class="journal-date">${stampDate(item.date)}</time>` : ''}
            </div>
            <h3 class="journal-title">${item.title}</h3>
            <p class="journal-finding-text">${item.text}</p>
          </article>
        `).join("")}
      </div>
    `;
  } else if (tab === "questions") {
    if (!questions.length) {
      content.innerHTML = `
        <div class="empty-state">
          <div>
            <i></i>
            <h3>Açık soru bulunmuyor.</h3>
            <p>Vaka içinde ortaya çıkan ana gizemler ve çözülmeyi bekleyen açık sorular burada listelenir.</p>
          </div>
        </div>
      `;
      return;
    }
    content.innerHTML = `
      <div class="journal-list">
        ${questions.map((item, i) => {
          const isSolved = item.status === "solved" || item.status === "çözüldü";
          return `
            <article class="journal-item">
              <div class="journal-item-header">
                <span class="journal-tag">SORU #${String(i + 1).padStart(2, "0")} · BÖLÜM ${String(item.episode || 1).padStart(2, "0")}</span>
                <span class="journal-status-badge ${isSolved ? 'status-solved' : 'status-open'}">${isSolved ? 'ÇÖZÜLDÜ' : 'AÇIK SORU'}</span>
              </div>
              <h3 class="journal-title">${item.question || item.title}</h3>
              ${item.answer ? `<p class="journal-finding-text"><b>Yanıt:</b> ${item.answer}</p>` : ''}
              ${item.text ? `<p class="journal-finding-text">${item.text}</p>` : ''}
            </article>
          `;
        }).join("")}
      </div>
    `;
  }
}

/* =========================================================
   STANDART ÇERÇEVELİ ZOOM PENCERESİ (ANA MENÜ İÇİN)
   ========================================================= */
function openFramedZoom(imageSrc, title = "") {
  const overlay = document.getElementById("zoomOverlay");
  const img = document.getElementById("zoomImage");
  if (!overlay || !img) return;

  img.src = imageSrc;
  img.alt = title;
  overlay.classList.add("active");
}

function closeFramedZoom() {
  const overlay = document.getElementById("zoomOverlay");
  if (!overlay) return;
  overlay.classList.remove("active");
}

function startEpisode(num) {
  window.location.href = `${num}/yan.html`;
}

/* =========================================================
   KONTROLLER VE ETKİNLİKLER
   ========================================================= */
const st = document.querySelector("#soundToggle");
if (st) st.addEventListener("click", () => {
  state.sound = !state.sound;
  updateMusic();
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
updateMusic();
document.addEventListener("mousedown", startAmbientMusic, { once: true });
document.addEventListener("mousemove", startAmbientMusic, { once: true });
document.addEventListener("keydown", startAmbientMusic, { once: true });

// Zoom modal dışarı tıklama ve ESC kontrolü
document.addEventListener("DOMContentLoaded", () => {
  const zoomOverlay = document.getElementById("zoomOverlay");
  const zoomContainer = document.getElementById("zoomContainer");

  if (zoomOverlay) {
    zoomOverlay.addEventListener("click", (e) => {
      if (e.target === zoomOverlay) {
        closeFramedZoom();
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
      closeFramedZoom();
    }
  });
});

if (window.location.hash === "#notebook") {
  navigate("notebook");
} else if (window.location.hash === "#board") {
  navigate("board");
} else {
  renderHome();
}

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
      cs.play().catch(() => {});
    }
  }
});
