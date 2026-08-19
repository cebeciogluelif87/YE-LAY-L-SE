with open("1/yan.js", "r") as f:
    content = f.read()

anchor = """    }, 300);
  }"""

scene3_code = """

  if (scene === 2) {
    stage.innerHTML = `
      <div class="story-scene" id="scene3_stage" style="position:relative; width:100%; height:100%; background:black;">
        <img id="scene3_bg" src="assets/a3.png" alt="Arkaplan" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
      </div>
    `;

    setTimeout(() => {
      if (typeof showDialog !== "undefined") {
        showDialog([
          "Orda bir şey var gibi. Oyuğa tıklayarak yakından bakalım."
        ], null, () => {
          
          const oyukArea = document.createElement("div");
          oyukArea.style.position = "absolute";
          oyukArea.style.cursor = "pointer";
          oyukArea.style.width = "10%";
          oyukArea.style.height = "15%";
          oyukArea.style.left = "45%";
          oyukArea.style.top = "75%";
          
          oyukArea.addEventListener("click", () => {
            const bg = document.getElementById("scene3_bg");
            if(bg) bg.src = "assets/a4.png";
            oyukArea.remove();
            
            setTimeout(() => {
              showDialog([
                "Burda bir not var. Ama uzanamayacağım kadar dar oyuk. Tahtayı kaldırmanın bir yolunu bulmalıyım."
              ], "assets/yesil-iz-portrait.png", () => {
                
                if(bg) bg.src = "assets/a5.png";
                
                setTimeout(() => {
                  showDialog([
                    "Etrafta tahtayı kaldırabileceğin bir nesne ara."
                  ], null, () => {
                    
                    const dolapKulp = document.createElement("div");
                    dolapKulp.style.position = "absolute";
                    dolapKulp.style.cursor = "pointer";
                    dolapKulp.style.width = "8%";
                    dolapKulp.style.height = "12%";
                    dolapKulp.style.left = "60%"; 
                    dolapKulp.style.top = "40%";  
                    
                    dolapKulp.addEventListener("click", () => {
                      const ds = document.getElementById("dolapSound");
                      if (ds && state.sound) { ds.currentTime = 0; ds.play().catch(()=>{}); }
                      
                      setTimeout(() => {
                        if(bg) bg.src = "assets/a6.png";
                        dolapKulp.remove();
                        // If they want to go to next scene, we can do it here later
                      }, 1000);
                    });
                    
                    const stg = document.getElementById("scene3_stage");
                    if(stg) stg.appendChild(dolapKulp);
                    
                  }, "metin");
                }, 300);
              }, "konusma");
            }, 300);
          });
          
          const stg = document.getElementById("scene3_stage");
          if(stg) stg.appendChild(oyukArea);
          
        }, "metin");
      }
    }, 300);
  }"""

# Find the LAST occurrence of anchor using rfind
last_index = content.rfind(anchor)
if last_index != -1 and "scene === 2" not in content:
    content = content[:last_index + len(anchor)] + scene3_code + content[last_index + len(anchor):]
    with open("1/yan.js", "w") as f:
        f.write(content)
    print("Scene 3 added")
else:
    print("Could not add Scene 3")
