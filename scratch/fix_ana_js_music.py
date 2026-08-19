with open("ana.js", "r") as f:
    content = f.read()

import re

# Find the block from const ambientMusic to function startAmbientMusic() { updateMusic(); }
content = re.sub(r'const ambientMusic = document\.querySelector\("#ambientMusic"\);[\s\S]*?function startAmbientMusic\(\) \{\n  updateMusic\(\);\n\}', """const ambientMusic = document.querySelector("#ambientMusic");
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
}""", content)

with open("ana.js", "w") as f:
    f.write(content)

print("fixed ana.js")
