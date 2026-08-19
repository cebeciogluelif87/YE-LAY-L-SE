with open("1/yan.html", "r") as f:
    content = f.read()

content = content.replace('const ambientMusic = document.querySelector("#ambientMusic");\n', '')
content = content.replace('ambientMusic.play().catch(() => {});', 'window.parent.postMessage("PLAY_MUSIC", "*");')
content = content.replace('ambientMusic.pause();', 'window.parent.postMessage("PAUSE_MUSIC", "*");')

with open("1/yan.html", "w") as f:
    f.write(content)

print("1/yan.html JS updated")
