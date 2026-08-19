import re

files = ["1/yan.js", "2/yan.js"]

for file in files:
    with open(file, "r") as f:
        content = f.read()

    # Revert startAmbientMusic to play local ambientMusic
    def repl_start(m):
        return """function startAmbientMusic() {
  if (!state.sound || musicWasUnlocked) return;
  const ambientMusic = document.querySelector("#ambientMusic");
  if (ambientMusic) {
    ambientMusic.play().then(() => { musicWasUnlocked = true; }).catch(() => {});
  }
}"""
    
    content = re.sub(r'function startAmbientMusic\(\) \{[\s\S]*?\}', repl_start, content)

    # Revert soundToggle listener to pause local ambientMusic directly
    def repl_sound_toggle(m):
        return """const st = document.querySelector("#soundToggle");
if (st) st.addEventListener("click", () => {
  state.sound = !state.sound;
  const ambientMusic = document.querySelector("#ambientMusic");
  if (state.sound) {
    startAmbientMusic();
  } else {
    if (ambientMusic) ambientMusic.pause();
    musicWasUnlocked = false;
  }
  save();
});"""

    content = re.sub(r'const st = document\.querySelector\("#soundToggle"\);\s*if \(st\) st\.addEventListener\("click", \(\) => \{[\s\S]*?\}\);', repl_sound_toggle, content)

    # Change any remaining postMessage to window.location.href (e.g. exitBtns)
    content = content.replace('window.parent.postMessage({ type: "NAVIGATE", target: "home" }, "*");', 'window.location.href = "../ana.html";')

    with open(file, "w") as f:
        f.write(content)

print("yan.js files updated")
