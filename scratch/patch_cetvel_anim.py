with open("1/yan.js", "r") as f:
    content = f.read()

old_anim = """                            cetvel.style.transition = "all 0.8s ease-in-out";
                            cetvel.style.left = "1800px";
                            cetvel.style.top = "400px";
                            cetvel.style.transform = "rotate(45deg)";
                            cetvel.style.opacity = "0";
                            
                            setTimeout(() => {
                              cetvel.remove();
                              // add to inventory
                              if (!state.evidence.includes("cetvel")) {
                                state.evidence.push("cetvel");
                                save();
                                renderInventory();
                              }
                            }, 800);"""

new_anim = """                            cetvel.style.transition = "all 0.8s ease-in-out";
                            cetvel.style.width = "118px";
                            cetvel.style.height = "118px";
                            cetvel.style.left = "1753px";
                            cetvel.style.top = "220px";
                            cetvel.style.transform = "rotate(0deg)";
                            cetvel.style.opacity = "0.5";
                            
                            setTimeout(() => {
                              const clingSound = new Audio('../assets/cling.mp3');
                              if (state.sfx) clingSound.play().catch(()=>{});
                              
                              cetvel.remove();
                              // add to inventory
                              if (!state.evidence.includes("cetvel")) {
                                state.evidence.push("cetvel");
                                save();
                                renderInventory();
                              }
                            }, 800);"""

content = content.replace(old_anim, new_anim)

with open("1/yan.js", "w") as f:
    f.write(content)

print("Patched cetvel animation and added cling.mp3")
