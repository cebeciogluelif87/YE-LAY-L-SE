with open("ana.js", "r") as f:
    content = f.read()

content = content.replace('if (target === "board") { if(ambientMusic) ambientMusic.pause(); musicWasUnlocked = false; renderBoard(); }', 'if (target === "board") renderBoard();')
content = content.replace('if (target === "notebook") { if(ambientMusic) ambientMusic.pause(); musicWasUnlocked = false; renderNotebook(); }', 'if (target === "notebook") renderNotebook();')

with open("ana.js", "w") as f:
    f.write(content)
print("navigate function fixed")
