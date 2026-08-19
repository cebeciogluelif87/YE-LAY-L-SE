import re

with open("1/yan.html", "r") as f:
    content = f.read()

# Add onComplete callback to showDialog
content = content.replace('function showDialog(sequence, portraitSrc = null) {', 'let dialogCallback = null;\n    function showDialog(sequence, portraitSrc = null, onComplete = null) {\n      dialogCallback = onComplete;')
content = content.replace('dialogOverlay.classList.remove("active");', 'dialogOverlay.classList.remove("active");\n          if (dialogCallback) { dialogCallback(); dialogCallback = null; }')

with open("1/yan.html", "w") as f:
    f.write(content)
print("1/yan.html updated with dialog callback")
