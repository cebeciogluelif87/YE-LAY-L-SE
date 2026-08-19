import re

# 1. Restore ana.html
with open("ana.html", "r") as f:
    ana_content = f.read()

if '<audio id="ambientMusic"' not in ana_content:
    ana_content = ana_content.replace('<div id="app">', '<div id="app">\n    <audio id="ambientMusic" src="assets/gizem.mp3" preload="auto" loop></audio>')
with open("ana.html", "w") as f:
    f.write(ana_content)

# 2. Restore yan.html files
for file in ["1/yan.html", "2/yan.html"]:
    with open(file, "r") as f:
        content = f.read()
    
    # Restore ../home.html to ../ana.html
    content = content.replace("../home.html", "../ana.html")
    
    if '<audio id="ambientMusic"' not in content:
        content = content.replace('<div id="app">', '<div id="app">\n    <audio id="ambientMusic" src="../assets/gizem.mp3" preload="auto" loop></audio>')
        
    with open(file, "w") as f:
        f.write(content)

print("Restored audio tags and ana.html references")
