with open("app.js", "r") as f:
    content = f.read()

target = """document.querySelector("#soundToggle").addEventListener("click", () => {
  state.sound = !state.sound;
  if (state.sound) startAmbientMusic();
  else { ambientMusic.pause(); musicWasUnlocked = false; }
  save();
});"""

repl = """document.querySelector("#soundToggle").addEventListener("click", () => {
  state.sound = !state.sound;
  if (state.sound) startAmbientMusic();
  else { ambientMusic.pause(); musicWasUnlocked = false; }
  updateChrome();
  save();
});

const sfxBtn = document.querySelector("#sfxToggle");
if (sfxBtn) {
  sfxBtn.addEventListener("click", () => {
    state.sfx = !state.sfx;
    updateChrome();
    save();
  });
}
"""
content = content.replace(target, repl)

with open("app.js", "w") as f:
    f.write(content)

print("added listener for sfxToggle")
