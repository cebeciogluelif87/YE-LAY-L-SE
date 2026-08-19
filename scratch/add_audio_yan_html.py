import re

files = ["1/yan.html", "2/yan.html"]

for file in files:
    with open(file, "r") as f:
        content = f.read()

    # Inject ambientMusic audio tag right after clickSound
    audio_tag = '<audio id="ambientMusic" src="../assets/gizem2.mp3" preload="auto" loop></audio>'
    if 'id="ambientMusic"' not in content:
        content = content.replace('<audio id="clickSound"', f'{audio_tag}\n    <audio id="clickSound"')

    # Change navigation back to window.location.href
    content = content.replace('window.parent.postMessage({type: "NAVIGATE", target: "notebook"}, "*");', 'window.location.href = "../ana.html#notebook";')
    content = content.replace('window.parent.postMessage({type: "NAVIGATE", target: "board"}, "*");', 'window.location.href = "../ana.html#board";')
    content = content.replace('window.parent.postMessage({type: "NAVIGATE", target: "home"}, "*");', 'window.location.href = "../ana.html";')

    with open(file, "w") as f:
        f.write(content)

print("yan.html navigation and audio tags updated")
