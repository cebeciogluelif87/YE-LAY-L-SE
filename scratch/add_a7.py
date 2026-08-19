with open("1/yan.js", "r") as f:
    content = f.read()

target = """                      setTimeout(() => {
                        if(bg) bg.src = "assets/a6.png";
                        dolapKulp.remove();
                        // If they want to go to next scene, we can do it here later
                      }, 1000);"""

replacement = """                      setTimeout(() => {
                        if(bg) bg.src = "assets/a6.png";
                        dolapKulp.remove();
                        
                        // a6.png de dolabın içine tıklama alanı çiz.
                        const dolapIci = document.createElement("div");
                        dolapIci.style.position = "absolute";
                        dolapIci.style.cursor = "pointer";
                        dolapIci.style.width = "30%";
                        dolapIci.style.height = "60%";
                        dolapIci.style.left = "35%";
                        dolapIci.style.top = "25%";
                        dolapIci.style.border = "4px dashed green";
                        dolapIci.style.backgroundColor = "rgba(0, 255, 0, 0.3)";
                        
                        dolapIci.addEventListener("click", () => {
                          if(bg) bg.src = "assets/a7.png";
                          dolapIci.remove();
                          
                          // üzerinde cetvel.png dolaptaki kitapların üzerinde dursun
                          const cetvel = document.createElement("img");
                          cetvel.src = "assets/cetvel.png";
                          cetvel.style.position = "absolute";
                          cetvel.style.left = "40%";
                          cetvel.style.top = "60%";
                          cetvel.style.width = "15%";
                          cetvel.style.cursor = "pointer";
                          cetvel.style.zIndex = "10";
                          
                          cetvel.addEventListener("click", () => {
                            // cetvel.png ye tıklayınca cetvel.png ipucu penceresine geçsin.
                            cetvel.style.transition = "all 0.8s ease-in-out";
                            cetvel.style.left = "1800px";
                            cetvel.style.top = "400px";
                            cetvel.style.transform = "scale(0.2) rotate(45deg)";
                            cetvel.style.opacity = "0";
                            
                            setTimeout(() => {
                              cetvel.remove();
                              // add to inventory
                              if (typeof state !== "undefined" && state.inventory) {
                                state.inventory.push({ id: "cetvel", name: "Eski Cetvel", icon: "../assets/cetvel.png" });
                                if (typeof updateInventoryUI === "function") updateInventoryUI();
                                if (typeof save === "function") save();
                              }
                            }, 800);
                          });
                          
                          const stg = document.getElementById("scene3_stage");
                          if(stg) stg.appendChild(cetvel);
                        });
                        
                        const stg = document.getElementById("scene3_stage");
                        if(stg) stg.appendChild(dolapIci);
                      }, 1000);"""

content = content.replace(target, replacement)

with open("1/yan.js", "w") as f:
    f.write(content)

print("a7 and cetvel logic added")
