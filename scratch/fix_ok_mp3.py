import re

files = ["1/yan.js", "2/yan.js"]
new_sound = """function playClickSound() {
  if (!state.sound) return;
  const audio = new Audio("../assets/ok.mp3");
  audio.volume = 1.0;
  audio.play().catch(e => console.error("Sound error:", e));
}"""

for file in files:
    with open(file, "r") as f:
        content = f.read()

    content = re.sub(r'function playClickSound\(\) \{[\s\S]*?\}', new_sound, content)
    with open(file, "w") as f:
        f.write(content)

print("Sound function updated")
