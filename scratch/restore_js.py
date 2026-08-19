import re

files = ["ana.js", "1/yan.js", "2/yan.js"]

sync_logic = """
const ambientMusic = document.querySelector("#ambientMusic");
if (ambientMusic) {
  const savedTime = sessionStorage.getItem("musicTime");
  if (savedTime !== null) {
    ambientMusic.currentTime = parseFloat(savedTime);
  }
  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("musicTime", ambientMusic.currentTime);
  });
}
"""

for file in files:
    with open(file, "r") as f:
        content = f.read()

    # If it was updated by the wrapper logic, revert it
    content = content.replace('window.parent.postMessage("PLAY_MUSIC", "*");', 'if(ambientMusic) { ambientMusic.play().then(() => { musicWasUnlocked = true; }).catch(() => {}); }')
    content = content.replace('window.parent.postMessage("PLAY_MUSIC", "*")', 'if(ambientMusic) ambientMusic.play()')
    content = content.replace('window.parent.postMessage("PAUSE_MUSIC", "*")', 'if(ambientMusic) ambientMusic.pause()')
    content = content.replace('else { window.parent.postMessage("PAUSE_MUSIC", "*"); musicWasUnlocked = false; }', 'else { if(ambientMusic) ambientMusic.pause(); musicWasUnlocked = false; }')
    
    # We also need to insert the sync_logic at the top if it's not there
    if 'sessionStorage.getItem("musicTime")' not in content:
        content = sync_logic + "\n" + content

    with open(file, "w") as f:
        f.write(content)

print("Restored and updated JS with sessionStorage sync")
