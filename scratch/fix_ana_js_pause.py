import re

with open("ana.js", "r") as f:
    content = f.read()

# Fix PAUSE_MUSIC
content = content.replace('if (ambientMusic) ambientMusic.pause();', 'updateMusic();')

with open("ana.js", "w") as f:
    f.write(content)
print("Fixed pause logic")
