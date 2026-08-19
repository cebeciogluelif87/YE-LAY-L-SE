import re

files_html = ["1/yan.html", "2/yan.html"]
for file in files_html:
    with open(file, "r") as f:
        content = f.read()
    
    if '<audio id="clickSound"' not in content:
        content = content.replace('<div id="app">', '<div id="app">\n    <audio id="clickSound" src="../assets/ok.mp3" preload="auto"></audio>')
        with open(file, "w") as f:
            f.write(content)

files_js = ["1/yan.js", "2/yan.js"]
new_sound = """function playClickSound() {
  if (!state.sound) return;
  const clickSound = document.querySelector("#clickSound");
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.error("Sound error:", e));
  }
}"""

for file in files_js:
    with open(file, "r") as f:
        content = f.read()

    content = re.sub(r'function playClickSound\(\) \{[\s\S]*?\}', new_sound, content)
    with open(file, "w") as f:
        f.write(content)

print("Audio tag added")
