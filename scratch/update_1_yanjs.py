with open("1/yan.js", "r") as f:
    content = f.read()

content = content.replace('const ambientMusic = document.querySelector("#ambientMusic");\n', '')
content = content.replace('ambientMusic.play().then(() => { musicWasUnlocked = true; }).catch(() => {});', 'window.parent.postMessage("PLAY_MUSIC", "*");')
content = content.replace('else { ambientMusic.pause(); musicWasUnlocked = false; }', 'else { window.parent.postMessage("PAUSE_MUSIC", "*"); musicWasUnlocked = false; }')

with open("1/yan.js", "w") as f:
    f.write(content)

print("1/yan.js updated for music")
