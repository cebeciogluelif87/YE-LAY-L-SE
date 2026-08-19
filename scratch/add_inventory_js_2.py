with open("2/yan.js", "a") as f:
    f.write("""

// Görsel Envanter Yönetimi (Bölüm 2)
const VISIBLE_SLOTS = 6;
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
""")

print("Appended inventory JS to 2/yan.js")
