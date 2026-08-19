import re

with open("1/yan.js", "r") as f:
    content = f.read()

# Replace everything from "} else if (scene === 1)" to "window.parent.postMessage({type: "NAVIGATE", target: "home"}, "*");" with a simpler skeleton

# We want to remove the old scenes but keep the button bindings if any.
# Actually, since the user is writing the game from scratch, they will add their own scenes.
# Let's just remove the hardcoded `else if (scene === 1) ... if (scene === 3)` blocks.

start_str = '} else if (scene === 1)'
# We will just regex replace the specific blocks.
content = re.sub(r'\} else if \(scene === 1\) stage\.innerHTML = `[\s\S]*?</div>`;', '}', content)
content = re.sub(r'if \(scene === 2\) stage\.innerHTML = `[\s\S]*?</div>`;', '', content)
content = re.sub(r'if \(scene === 3\) stage\.innerHTML = `[\s\S]*?</div>`;', '', content)

# Remove the revealClue and recordEpisode functions which are part of the old game logic
content = re.sub(r'function revealClue\(\) \{[\s\S]*?\}\n\n', '', content)
content = re.sub(r'function recordEpisode\(\) \{[\s\S]*?\}\n\n', '', content)

# Remove the old bindings that reference those functions
content = re.sub(r'const next = stage\.querySelector\("\.scene-next"\);[\s\S]*?\}\);\n', '', content)
content = re.sub(r'const hotspot = stage\.querySelector\("\.hotspot"\);\n\s*if \(hotspot\) hotspot\.addEventListener\("click", revealClue\);\n', '', content)

# Also fix the postMessage in the remaining logic (which I forgot to change in yan.js previously?)
content = content.replace('window.parent.postMessage({type: "NAVIGATE", target: "notebook"}, "*");', 'window.location.href = "../ana.html#notebook";')
content = content.replace('window.parent.postMessage({type: "NAVIGATE", target: "board"}, "*");', 'window.location.href = "../ana.html#board";')
content = content.replace('window.parent.postMessage({type: "NAVIGATE", target: "home"}, "*");', 'window.location.href = "../ana.html";')

with open("1/yan.js", "w") as f:
    f.write(content)

print("1/yan.js cleaned")
