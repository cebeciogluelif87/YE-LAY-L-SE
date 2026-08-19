with open("ana.js", "r") as f:
    content = f.read()

# Replace ambientMusic declarations
content = content.replace('const ambientMusic = document.querySelector("#ambientMusic");\n', '')

# Replace playback methods
content = content.replace('ambientMusic.play().then(() => { musicWasUnlocked = true; }).catch(() => {});', 'window.parent.postMessage("PLAY_MUSIC", "*");')
content = content.replace('ambientMusic.play()', 'window.parent.postMessage("PLAY_MUSIC", "*")')
content = content.replace('ambientMusic.pause()', 'window.parent.postMessage("PAUSE_MUSIC", "*")')

with open("ana.js", "w") as f:
    f.write(content)

print("ana.js updated")
