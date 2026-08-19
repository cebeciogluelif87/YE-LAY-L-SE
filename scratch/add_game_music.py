import re

# 1. Update ana.html to include gameMusic
with open("ana.html", "r") as f:
    ana_html = f.read()

if 'id="gameMusic"' not in ana_html:
    ana_html = ana_html.replace('<audio id="ambientMusic"', '<audio id="ambientMusic" src="assets/gizem.mp3" preload="auto" loop></audio>\n    <audio id="gameMusic" src="assets/gizem2.mp3" preload="auto" loop></audio>\n    <!-- Replaced original audio tag to prevent duplicates -->')
    ana_html = ana_html.replace('<audio id="ambientMusic" src="assets/gizem.mp3" preload="auto" loop></audio>\n    <audio id="ambientMusic" src="assets/gizem.mp3" preload="auto" loop></audio>', '<audio id="ambientMusic" src="assets/gizem.mp3" preload="auto" loop></audio>')

with open("ana.html", "w") as f:
    f.write(ana_html)

# 2. Update ana.js
with open("ana.js", "r") as f:
    ana_js = f.read()

new_logic = """
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
    if (gameMusic) gameMusic.play().catch(()=>{});
  } else {
    if (gameMusic) gameMusic.pause();
    if (ambientMusic) ambientMusic.play().catch(()=>{});
  }
}

function startAmbientMusic() {
  updateMusic();
}
"""

# Replace startAmbientMusic logic
ana_js = re.sub(r'function startAmbientMusic\(\) \{[\s\S]*?\n\}', 'function startAmbientMusic() { updateMusic(); }', ana_js)
if 'const gameMusic' not in ana_js:
    ana_js = ana_js.replace('const ambientMusic = document.querySelector("#ambientMusic");', new_logic)

# Replace the frame activation with updateMusic() call
ana_js = ana_js.replace('frameContainer.style.display = "block";', 'frameContainer.style.display = "block";\n  updateMusic();')

# Replace the frame deactivation with updateMusic() call
ana_js = ana_js.replace('navigate(event.data.target);', 'navigate(event.data.target);\n    updateMusic();')

# Update toggle logic
ana_js = ana_js.replace('else { if(ambientMusic) ambientMusic.pause(); musicWasUnlocked = false; }', 'else { updateMusic(); }')
ana_js = ana_js.replace('if (state.sound) startAmbientMusic();', 'if (state.sound) updateMusic();')

# Fix event message listeners
ana_js = ana_js.replace('if (ambientMusic) ambientMusic.pause();', 'updateMusic();')
ana_js = ana_js.replace('startAmbientMusic();', 'updateMusic();')

with open("ana.js", "w") as f:
    f.write(ana_js)

print("Game music added")
