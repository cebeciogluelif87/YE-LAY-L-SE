import re

files = ["1/yan.html", "2/yan.html"]

for file in files:
    with open(file, "r") as f:
        content = f.read()

    # 1. Add <script src="yan.js"></script> before the inline script
    if '<script src="yan.js"></script>' not in content:
        content = content.replace('<script>', '<script src="yan.js"></script>\n  <script>')

    # 2. Fix navigation to ana.html
    content = content.replace('window.location.href = "../ana.html#notebook";', 'window.parent.postMessage({type: "NAVIGATE", target: "notebook"}, "*");')
    content = content.replace('window.location.href = "../ana.html#board";', 'window.parent.postMessage({type: "NAVIGATE", target: "board"}, "*");')
    content = content.replace('window.location.href = "../ana.html";', 'window.parent.postMessage({type: "NAVIGATE", target: "home"}, "*");')

    # 3. Remove the old PLAY_MUSIC/PAUSE_MUSIC string messages from the inline script just in case they are hiding somewhere else
    content = re.sub(r'window\.parent\.postMessage\("PLAY_MUSIC", "\*"\);', '', content)
    content = re.sub(r'window\.parent\.postMessage\("PAUSE_MUSIC", "\*"\);', '', content)

    with open(file, "w") as f:
        f.write(content)

print("yan.html navigation and script tags fixed")
