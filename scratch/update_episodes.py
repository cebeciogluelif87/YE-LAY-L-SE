import re

html_files = ["1/yan.html", "2/yan.html"]
js_files = ["1/yan.js", "2/yan.js"]

for file in html_files:
    with open(file, "r") as f:
        content = f.read()
    # Remove audio tags from yan.html
    content = re.sub(r'<audio id="ambientMusic"[^>]*></audio>', '', content)
    with open(file, "w") as f:
        f.write(content)

for file in js_files:
    with open(file, "r") as f:
        content = f.read()

    # Change music play/pause logic to postMessage
    content = content.replace('if(ambientMusic) { ambientMusic.play().then(() => { musicWasUnlocked = true; }).catch(() => {}); }', 'window.parent.postMessage({type: "PLAY_MUSIC"}, "*");')
    content = content.replace('if(ambientMusic) ambientMusic.play()', 'window.parent.postMessage({type: "PLAY_MUSIC"}, "*");')
    content = content.replace('if(ambientMusic) ambientMusic.pause()', 'window.parent.postMessage({type: "PAUSE_MUSIC"}, "*");')
    content = content.replace('else { if(ambientMusic) ambientMusic.pause(); musicWasUnlocked = false; }', 'else { window.parent.postMessage({type: "PAUSE_MUSIC"}, "*"); musicWasUnlocked = false; }')

    # Remove sessionStorage logic since audio is handled by ana.html now
    content = re.sub(r'const ambientMusic = document\.querySelector\("#ambientMusic"\);\nif \(ambientMusic\) \{.*?\n\}\n', '', content, flags=re.DOTALL)

    # Change window.location.href navigations
    content = content.replace('window.location.href = "../ana.html#notebook";', 'window.parent.postMessage({type: "NAVIGATE", target: "notebook"}, "*");')
    content = content.replace('window.location.href = "../ana.html#board";', 'window.parent.postMessage({type: "NAVIGATE", target: "board"}, "*");')
    content = content.replace('window.location.href = "../ana.html";', 'window.parent.postMessage({type: "NAVIGATE", target: "home"}, "*");')

    with open(file, "w") as f:
        f.write(content)

print("Episode files updated for iframe SPA")
