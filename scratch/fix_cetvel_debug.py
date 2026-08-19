with open("1/yan.js", "r") as f:
    content = f.read()

old = """                            setTimeout(() => {
                              const clingSound = new Audio('assets/cling.mp3');
                              if (state.sfx) clingSound.play().catch(()=>{});

                              cetvel.remove();
                              // add to inventory — window scope ile eriş
                              if (!state.inventory) state.inventory = [];
                              if (!state.inventory.find(i => i.id === "cetvel")) {
                                state.inventory.push({ id: "cetvel", name: "Eski Cetvel", icon: "assets/cetvel.png" });
                              }
                              if (typeof window.updateInventoryUI === "function") window.updateInventoryUI();
                              if (typeof window.save === "function") window.save();
                            }, 800);"""

new = """                            setTimeout(() => {
                              const clingSound = new Audio('assets/cling.mp3');
                              if (state.sfx) clingSound.play().catch(()=>{});

                              cetvel.remove();
                              // Envantera ekle ve UI'yi güncelle
                              if (!Array.isArray(state.inventory)) state.inventory = [];
                              if (!state.inventory.find(i => i.id === "cetvel")) {
                                state.inventory.unshift({ id: "cetvel", name: "Eski Cetvel", icon: "assets/cetvel.png" });
                              }
                              // Kaydettikten sonra UI güncelle
                              try { localStorage.setItem("yesiliz-state", JSON.stringify(state)); } catch(e){}
                              if (typeof window.updateInventoryUI === "function") {
                                window.updateInventoryUI();
                              } else {
                                // Fallback: doğrudan DOM'a ekle
                                const track = document.querySelector("#inventorySlots");
                                if (track) {
                                  const slot = document.createElement("div");
                                  slot.className = "inv-slot has-item";
                                  slot.innerHTML = '<img src="assets/cetvel.png" alt="Eski Cetvel" style="max-width:80%;max-height:80%;object-fit:contain;"><span class="slot-label">Eski Cetvel</span>';
                                  track.insertBefore(slot, track.firstChild);
                                }
                              }
                            }, 800);"""

if old in content:
    content = content.replace(old, new)
    print("Patched!")
else:
    print("String not found")

with open("1/yan.js", "w") as f:
    f.write(content)
