let state = {sound: true};
let selectedItem = null;

    /* Bölüm 1 - İnteraktif Kaçış/Araştırma Odası Motoru */
    
     // 1: Canteen Overview, 2: Locker Base Close-Up, 3: Origami Inspection, 4: Dossier Synthesis
    
    let foldsOpened = { top: false, bottom: false };
    let isUnderLight = false;

    const roomStage = document.querySelector("#roomStage");
            const sceneProgress = document.querySelector("#sceneProgress");
    const stepIndicator = document.querySelector("#stepIndicator");
    const dialogOverlay = document.querySelector("#dialogOverlay");
    const dialogPortraitImg = document.querySelector("#dialogPortraitImg");
    const dialogTextElement = document.querySelector("#dialogTextElement");
    const dialogPrevBtn = document.querySelector("#dialogPrevBtn");
    const dialogNextBtn = document.querySelector("#dialogNextBtn");
    const dialogPrevImg = document.querySelector("#dialogPrevImg");
    const dialogNextImg = document.querySelector("#dialogNextImg");

    let currentDialogSequence = [];
    let currentDialogIndex = 0;
    let currentPortraitSrc = null;

    function renderDialogState() {
      if (!dialogOverlay) return;
      const text = currentDialogSequence[currentDialogIndex];
      dialogTextElement.textContent = text;
      
      dialogTextElement.style.animation = 'none';
      dialogTextElement.offsetHeight; 
      dialogTextElement.style.animation = null;
      
      if (currentPortraitSrc) {
        dialogPortraitImg.src = currentPortraitSrc;
        dialogPortraitImg.style.display = "block";
      } else {
        dialogPortraitImg.style.display = "none";
      }

      const hasPrev = currentDialogIndex > 0;
      const hasNext = currentDialogIndex < currentDialogSequence.length - 1;

      dialogPrevBtn.style.display = hasPrev ? "block" : "none";
      dialogPrevImg.style.display = hasPrev ? "block" : "none";
      
      // If no next, we can still show the next button as a "close" or just hide it
      // Since it's a conversation flow, clicking next on the last one will close it.
      // So we keep the Next button visible, but maybe change its appearance?
      // For now, let's keep it visible. It acts as "Close" on the last slide.
    }

    let dialogCallback = null;
    function showDialog(sequence, portraitSrc = null, onComplete = null) {
      dialogCallback = onComplete;
      if (!dialogOverlay) return;
      if (!Array.isArray(sequence)) sequence = [sequence];
      
      currentDialogSequence = sequence;
      currentDialogIndex = 0;
      currentPortraitSrc = portraitSrc;
      
      renderDialogState();
      dialogOverlay.classList.add("active");
      
    }

    if (dialogNextBtn) {
      dialogNextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (currentDialogIndex < currentDialogSequence.length - 1) {
          currentDialogIndex++;
          renderDialogState();
        } else {
          dialogOverlay.classList.remove("active");
          if (dialogCallback) { dialogCallback(); dialogCallback = null; }
          
        }
      });
    }

    if (dialogPrevBtn) {
      dialogPrevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (currentDialogIndex > 0) {
          currentDialogIndex--;
          renderDialogState();
        }
      });
    }

    // Still allow clicking anywhere on background to advance
    if (dialogOverlay) {
      dialogOverlay.addEventListener("click", () => {
        if (currentDialogIndex < currentDialogSequence.length - 1) {
          currentDialogIndex++;
          renderDialogState();
        } else {
          dialogOverlay.classList.remove("active");
          if (dialogCallback) { dialogCallback(); dialogCallback = null; }
          
        }
      });
    }

    const VISIBLE_SLOTS = 6;

    function updateInventoryUI() {
      const track = document.querySelector("#inventorySlots");
      const upBtn = document.querySelector("#invUpBtn");
      const downBtn = document.querySelector("#invDownBtn");
      if (!track) return;

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
        slot.classList.remove("using");
        slot.classList.toggle("selected", selectedItem && selectedItem.id === item.id);
        
        const img = slot.querySelector("img");
        if (img.src !== item.icon) img.src = item.icon;
        img.alt = item.name;
        
        const label = slot.querySelector(".slot-label");
        if (label.textContent !== item.name) label.textContent = item.name;
        
        slot.onclick = () => {
          if (slot.classList.contains("using")) return;
          if (selectedItem && selectedItem.id === item.id) {
            selectedItem = null;
            showToast(`${item.name} bırakıldı.`);
          } else {
            selectedItem = item;
            showToast(`${item.name} seçildi. Kullanmak istediğin hedefe dokun.`);
          }
          updateInventoryUI();
        };
      });

      const slotHeight = 118 + 18; 
      track.style.transform = `translateY(-${state.invScrollIndex * slotHeight}px)`;
      save();
    }

    setTimeout(() => {
      document.querySelector("#invUpBtn")?.addEventListener("click", () => {
        const maxScroll = Math.max(0, state.inventory.length - VISIBLE_SLOTS);
        if (state.invScrollIndex < maxScroll) {
          state.invScrollIndex++;
          updateInventoryUI();
        }
      });
      document.querySelector("#invDownBtn")?.addEventListener("click", () => {
        if (state.invScrollIndex > 0) {
          state.invScrollIndex--;
          updateInventoryUI();
        }
      });
    }, 100);

    function consumeItem(itemId) {
      const slot = document.querySelector(`.inv-slot[data-id="${itemId}"]`);
      if (slot) {
        slot.classList.add("using");
        setTimeout(() => {
          state.inventory = state.inventory.filter(i => i.id !== itemId);
          if (selectedItem && selectedItem.id === itemId) selectedItem = null;
          const maxScroll = Math.max(0, state.inventory.length - VISIBLE_SLOTS);
          if (state.invScrollIndex > maxScroll) state.invScrollIndex = maxScroll;
          updateInventoryUI();
        }, 400); 
      } else {
        state.inventory = state.inventory.filter(i => i.id !== itemId);
        updateInventoryUI();
      }
    }

    // Ses ve Tam Ekran Kontrolleri
    

    

    const exitBtns = document.querySelectorAll("#exitEpisodeBtn, #goBackHome");
    exitBtns.forEach(btn => btn.addEventListener("click", () => {
      window.location.href = "../ana.html";
    }));

    // Başlangıç Kurulumu
    window.addEventListener("resize", fitGameStage);
    document.addEventListener("fullscreenchange", fitGameStage);
    fitGameStage();

    if (state.sound) {
      document.addEventListener("click", () => {
        
      }, { once: true });
    }

    // 1. Adımı Başlat
    
  