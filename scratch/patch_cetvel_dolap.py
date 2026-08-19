with open("1/yan.js", "r") as f:
    content = f.read()

# 1. Update cetvel size and position
content = content.replace(
    'cetvel.style.left = "40%";',
    'cetvel.style.left = "0";'
)
content = content.replace(
    'cetvel.style.top = "60%";',
    'cetvel.style.top = "0";'
)
content = content.replace(
    'cetvel.style.width = "15%";',
    'cetvel.style.width = "100%";\n                          cetvel.style.height = "100%";\n                          cetvel.style.objectFit = "cover";'
)

# 2. Update dolap sound logic
old_kulp_event = """                    dolapKulp.addEventListener("click", (e) => {
                      e.stopPropagation();
                      const ds = document.getElementById("dolapSound");
                      if (ds && state.sound) { ds.currentTime = 0; ds.play().catch(()=>{}); }"""

new_kulp_event = """                    dolapKulp.addEventListener("click", () => {
                      // Let ok.mp3 play first, then play dolap.mp3 after a short delay
                      setTimeout(() => {
                        const ds = document.getElementById("dolapSound");
                        if (ds && (state.sound || state.sfx)) { ds.currentTime = 0; ds.play().catch(()=>{}); }
                      }, 300);"""

content = content.replace(old_kulp_event, new_kulp_event)

with open("1/yan.js", "w") as f:
    f.write(content)

print("cetvel and dolapSound patched")
