with open("1/yan.js", "r") as f:
    content = f.read()

old = """                            setTimeout(() => {
                              const clingSound = new Audio('../assets/cling.mp3');
                              if (state.sfx) clingSound.play().catch(()=>{});

                              cetvel.remove();
                              // add to inventory
                              if (typeof state !== "undefined" && state.inventory) {
                                state.inventory.push({ id: "cetvel", name: "Eski Cetvel", icon: "assets/cetvel.png" });
                                if (typeof updateInventoryUI === "function") updateInventoryUI();
                                if (typeof save === "function") save();
                              }
                            }, 800);"""

new = """                            setTimeout(() => {
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

if old in content:
    content = content.replace(old, new)
    print("Patched!")
else:
    print("Target string not found")
    print(repr(content[content.find("Audio"):content.find("Audio")+500]))

with open("1/yan.js", "w") as f:
    f.write(content)
